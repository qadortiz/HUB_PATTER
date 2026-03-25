import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/Logger';
import { EmailHelper } from '../support/helpers/EmailHelper';

/**
 * LoginPage - Page Object para la página de login de Patter Hub
 * URL: https://hub.patter.com/login
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly showPasswordButton: Locator;
  
  // OTP Locators (aparecen después del primer login para Super Admin)
  private readonly otpInputs: Locator; // Locator para todos los campos OTP
  private readonly otpSubmitButton: Locator;
  private readonly otpResendLink: Locator;
  private readonly otpTimer: Locator;

  // Messages and validations
  private readonly welcomeMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page, baseURL: string) {
    super(page, baseURL);
    
    // Inicializando locators basados en la inspección real
    this.emailInput = page.locator('input[type="email"][placeholder="Email"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.getByText('Forgot password?');
    this.showPasswordButton = page.locator('button[type="button"]').first();
    
    // OTP locators (4 campos separados para código de 4 dígitos)
    // Campos OTP: pueden ser type="text", "number" o "tel", generalmente con maxlength="1"
    this.otpInputs = page.locator('input[maxlength="1"]');
    this.otpSubmitButton = page.locator('button:has-text("Continue"), button[type="submit"]').last();
    this.otpResendLink = page.getByText(/resend|send again/i);
    this.otpTimer = page.locator('text=/\\d{1,2}:\\d{2}/'); // Timer format: MM:SS
    
    // Messages
    this.welcomeMessage = page.getByText('Welcome back!');
    this.errorMessage = page.locator(
  '[class*="error"], [class*="alert"], [role="alert"], ' +
  'text=User not found, ' +
  'text=Invalid credentials, ' +
  'text=Invalid code, ' +
  'div:has-text("User not found"), ' +
  'div:has-text("Invalid")'
);
  }

  /**
   * Navega a la página de login
   */
  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForElement(this.emailInput);
    Logger.info('Página de login cargada correctamente');
  }

  /**
   * Ingresa el código OTP en los 4 campos separados
   * @param otpCode - Código de 4 dígitos (ej: "1234")
   */
  async enterOTPCode(otpCode: string): Promise<void> {
    // Validar que el código tenga 4 dígitos
    if (otpCode.length !== 4) {
      throw new Error(`OTP debe tener 4 dígitos, recibido: ${otpCode.length}`);
    }

    // Obtener los 4 campos de entrada
    const otpFields = await this.otpInputs.all();
    
    if (otpFields.length !== 4) {
      throw new Error(`Se esperaban 4 campos OTP, encontrados: ${otpFields.length}`);
    }

    // Ingresar cada dígito en su campo correspondiente
    for (let i = 0; i < 4; i++) {
      const digit = otpCode[i];
      await otpFields[i].fill(digit);
      Logger.debug(`Dígito ${i + 1}/4 ingresado`);
      
      // Breve pausa para simular escritura natural
      await this.wait(100);
    }

    Logger.info(`Código OTP completo ingresado: ${otpCode}`);
  }

  /**
   * Login como Admin (sin OTP)
   * @param email - Email del admin
   * @param password - Password del admin
   * @param rememberMe - Si debe recordar el dispositivo
   */
  async loginAsAdmin(
    email: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<void> {
    Logger.info(`Intentando login como Admin: ${email}`);
    
    await this.fillInput(this.emailInput, email, 'Email');
    await this.fillInput(this.passwordInput, password, 'Password');
    
    if (rememberMe) {
      await this.clickElement(this.rememberMeCheckbox, 'Remember me checkbox');
    }
    
    await this.clickElement(this.loginButton, 'Login button');
    await this.waitForNavigation();
    
    Logger.info('Login como Admin completado');
  }

  /**
   * Login como Super Admin (con OTP)
   * @param email - Email del super admin
   * @param password - Password del super admin
   * @param otpEmail - Email donde se recibe el OTP (puede ser diferente al login email)
   * @param rememberMe - Si debe recordar el dispositivo
   */
  async loginAsSuperAdmin(
    email: string,
    password: string,
    otpEmail: string = email,
    rememberMe: boolean = false
  ): Promise<void> {
    Logger.info(`Intentando login como Super Admin: ${email}`);
    
    // Paso 1: Ingresar credenciales
    await this.fillInput(this.emailInput, email, 'Super Admin Email');
    await this.fillInput(this.passwordInput, password, 'Super Admin Password');
    
    if (rememberMe) {
      await this.clickElement(this.rememberMeCheckbox, 'Remember me checkbox');
    }
    
    await this.clickElement(this.loginButton, 'Login button');
    
    // Paso 2: Esperar página de OTP
    Logger.info('Esperando página de verificación OTP...');
    await this.wait(2000); // Breve espera para transición
    
    // Verificar si aparecen los campos OTP
    const firstOTPField = this.otpInputs.first();
    const isOTPRequired = await this.isElementVisible(firstOTPField, 10000);
    
    if (!isOTPRequired) {
      Logger.warn('No se detectó solicitud de OTP - verificar si es necesario');
      return;
    }
    
    // Paso 3: Obtener OTP del email
    Logger.info('Obteniendo código OTP del email...');
    const otpCode = await EmailHelper.getOTPFromEmail(otpEmail);
    
    // Paso 4: Ingresar OTP en los 4 campos
    await this.enterOTPCode(otpCode);
    await this.clickElement(this.otpSubmitButton, 'Submit OTP');
    await this.waitForNavigation();
    
    Logger.info('Login como Super Admin completado con OTP');
  }

  /**
   * Login genérico que detecta automáticamente si requiere OTP
   * @param email - Email
   * @param password - Password
   * @param otpEmail - Email para OTP (opcional)
   * @param rememberMe - Recordar dispositivo
   */
  async login(
    email: string,
    password: string,
    otpEmail?: string,
    rememberMe: boolean = false
  ): Promise<void> {
    Logger.info(`Login genérico para: ${email}`);
    
    await this.fillInput(this.emailInput, email, 'Email');
    await this.fillInput(this.passwordInput, password, 'Password');
    
    if (rememberMe) {
      await this.clickElement(this.rememberMeCheckbox, 'Remember me checkbox');
    }
    
    await this.clickElement(this.loginButton, 'Login button');
    await this.wait(2000);
    
    // Detectar si se requiere OTP
    const firstOTPField = this.otpInputs.first();
    const isOTPRequired = await this.isElementVisible(firstOTPField, 5000);
    
    if (isOTPRequired) {
      Logger.info('OTP detectado - procesando...');
      const emailForOTP = otpEmail || email;
      const otpCode = await EmailHelper.getOTPFromEmail(emailForOTP);
      await this.enterOTPCode(otpCode);
      await this.clickElement(this.otpSubmitButton, 'Submit OTP');
      await this.waitForNavigation();
    } else {
      await this.waitForNavigation();
    }
    
    Logger.info('Login completado');
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.clickElement(this.showPasswordButton, 'Toggle password visibility');
  }

  /**
   * Click en "Forgot password?"
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink, 'Forgot password link');
  }

  /**
   * Re-envía el código OTP
   */
  async resendOTP(): Promise<void> {
    await this.clickElement(this.otpResendLink, 'Resend OTP');
    Logger.info('Solicitud de reenvío de OTP enviada');
  }

  /**
   * Verifica si hay mensaje de error
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage, 3000);
  }

  /**
   * Obtiene el mensaje de error
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasErrorMessage()) {
      return await this.getElementText(this.errorMessage);
    }
    return '';
  }

  /**
   * Verifica que la página de login está cargada
   */
  async isLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.welcomeMessage);
  }

  /**
   * Limpia el formulario
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    Logger.debug('Formulario de login limpiado');
  }
}
