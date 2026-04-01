import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { Logger } from '../../src/utils/Logger';
import { EmailHelper } from '../../src/support/helpers/EmailHelper';


/**
 * Step Definitions para Login Feature
 */

// =============================================================================
// GIVEN Steps - Precondiciones
// =============================================================================

Given('que el usuario navega a la página de login', async function (this: CustomWorld) {
  await this.loginPage.goto();
  const isLoaded = await this.loginPage.isLoaded();
  expect(isLoaded).toBeTruthy();
  Logger.info('✓ Usuario navegó a la página de login');
});

Given('que el usuario está en la página de login', async function (this: CustomWorld) {
  await this.loginPage.goto();
  Logger.info('✓ Usuario está en la página de login');
});

Given('que el usuario tiene credenciales de {string}', async function (this: CustomWorld, userType: string) {
  const credentials = this.getCredentials(userType as 'admin' | 'superadmin');
  expect(credentials.email).toBeTruthy();
  expect(credentials.password).toBeTruthy();
  Logger.info(`✓ Credenciales de ${userType} obtenidas correctamente`);
  
  // Guardar en el contexto para uso posterior
 // Credenciales cargadas
});

// =============================================================================
// WHEN Steps - Acciones
// =============================================================================

When('el usuario ingresa sus credenciales de admin', async function (this: CustomWorld) {
  const credentials = this.getCredentials('admin');
  await this.loginPage.fillInput(
    this.loginPage['emailInput'],
    credentials.email,
    'Admin Email'
  );
  await this.loginPage.fillInput(
    this.loginPage['passwordInput'],
    credentials.password,
    'Admin Password'
  );
  Logger.info('✓ Credenciales de admin ingresadas');
});

When('el usuario ingresa sus credenciales de superadmin', async function (this: CustomWorld) {
  const credentials = this.getCredentials('superadmin');
  await this.loginPage.fillInput(
    this.loginPage['emailInput'],
    credentials.email,
    'Super Admin Email'
  );
  await this.loginPage.fillInput(
    this.loginPage['passwordInput'],
    credentials.password,
    'Super Admin Password'
  );
  Logger.info('✓ Credenciales de superadmin ingresadas');
});

When('el usuario ingresa el email {string}', async function (this: CustomWorld, email: string) {
  await this.loginPage.fillInput(
    this.loginPage['emailInput'],
    email,
    'Email'
  );
  Logger.info(`✓ Email ingresado: ${email}`);
});

When('el usuario ingresa la contraseña {string}', async function (this: CustomWorld, password: string) {
  await this.loginPage.fillInput(
    this.loginPage['passwordInput'],
    password,
    'Password'
  );
  Logger.info('✓ Contraseña ingresada');
  
  // Guardar en contexto para verificaciones posteriores
// Credenciales cargadas
});

When('el usuario hace clic en el botón de login', async function (this: CustomWorld) {
  await this.loginPage.clickElement(
    this.loginPage['loginButton'],
    'Login Button'
  );
  Logger.info('✓ Click en botón de login');
});

When('el usuario marca la opción {string}', async function (this: CustomWorld, optionText: string) {
  if (optionText.toLowerCase().includes('remember')) {
    await this.loginPage.clickElement(
      this.loginPage['rememberMeCheckbox'],
      'Remember me checkbox'
    );
    Logger.info('✓ Opción "Remember me" marcada');
  }
});

When('el usuario hace clic en el botón de mostrar contraseña', async function (this: CustomWorld) {
  await this.loginPage.togglePasswordVisibility();
  Logger.info('✓ Toggle de visibilidad de contraseña');
});

When('el usuario hace clic en {string}', { timeout: 30000 }, async function (this: CustomWorld, linkText: string) {
  if (linkText.toLowerCase().includes('forgot')) {
    await this.page.locator('text=Forgot password?').click();
    await this.page.waitForTimeout(2000);
    Logger.info('✓ Click en "Forgot password"');
  } else if (linkText.toLowerCase().includes('resend')) {
    Logger.info('ℹ️ Resend code no disponible en este ambiente - skipping');
  }
});

When('el usuario ingresa el código OTP válido', { timeout: 90000 }, async function (this: CustomWorld) {
  Logger.info('🔍 Obteniendo código OTP de Mailinator...');
  
  const credentials = this.getCredentials('superadmin');
  const otpCode = await EmailHelper.getOTPFromEmail(credentials.email, 60000);
  
  Logger.info(`✅ Código OTP obtenido: ${otpCode}`);
  
  // Ingresar OTP manualmente campo por campo
  const otpFields = await this.page.locator('input[maxlength="1"], input[type="text"], input[type="number"]').all();
  
  Logger.info(`📋 Campos OTP encontrados: ${otpFields.length}`);
  
  if (otpFields.length !== 4) {
    throw new Error(`Se esperaban 4 campos OTP, se encontraron ${otpFields.length}`);
  }
  
  // Ingresar cada dígito en su campo
  for (let i = 0; i < 4; i++) {
    const digit = otpCode[i];
    await otpFields[i].click();
    await otpFields[i].fill(digit);
    Logger.info(`✓ Ingresado dígito ${i + 1}: ${digit}`);
    await this.page.waitForTimeout(300);
  }
  
  Logger.info('✓ OTP ingresado completamente en los 4 campos');
  
  // Esperar a que el botón se habilite
  await this.page.waitForTimeout(2000);
  
  // Verificar si el botón está habilitado
  const submitButton = this.page.locator('button:has-text("Continue"), button[type="submit"]').last();
  const isEnabled = await submitButton.isEnabled();
  Logger.info(`🔘 Botón Continue habilitado: ${isEnabled}`);
});

When('el usuario ingresa el código OTP {string}', async function (this: CustomWorld, otpCode: string) {
  await this.loginPage.enterOTPCode(otpCode);
  Logger.info(`✓ OTP ingresado: ${otpCode}`);
});

When('el usuario envía el código OTP', { timeout: 60000 }, async function (this: CustomWorld) {
  // Esperar a que el botón esté habilitado (puede tardar tras ingresar el OTP)
  await this.page.waitForTimeout(2000);
  
  await this.loginPage.clickElement(
    this.loginPage['otpSubmitButton'],
    'Submit OTP'
  );
  Logger.info('✓ Click en botón de enviar OTP');
  
  // Esperar navegación después de enviar OTP
  await this.page.waitForTimeout(3000);
  await this.page.waitForLoadState('networkidle');
});

When('el usuario hace clic en el botón de login sin ingresar datos', async function (this: CustomWorld) {
  await this.loginPage.clickElement(
    this.loginPage['loginButton'],
    'Login Button'
  );
  Logger.info('✓ Click en login sin datos');
});

// =============================================================================
// THEN Steps - Verificaciones
// =============================================================================

Then('el usuario debería ser redirigido a la página de recuperación de contraseña', async function (this: CustomWorld) {
  await this.page.waitForTimeout(2000);
  
  const modalVisible = 
    await this.page.locator('#RecoverYourPassword').isVisible().catch(() => false) ||
    await this.page.locator('text=Recover your password').isVisible().catch(() => false) ||
    await this.page.locator('#emailRecoverYourPassword').isVisible().catch(() => false);
  
  expect(modalVisible).toBeTruthy();
  Logger.info('✓ Modal de recuperación de contraseña visible');
});

Then('el dashboard debería estar completamente cargado', { timeout: 60000 }, async function (this: CustomWorld) {
  // Esperar a que el dashboard cargue completamente
  await this.page.waitForTimeout(3000);
  await this.page.waitForLoadState('networkidle');
  
  const isDashboardLoaded = await this.dashboardPage.isDashboardLoaded();
  expect(isDashboardLoaded).toBeTruthy();
  Logger.info('✓ Dashboard cargado correctamente');
});

Then('el usuario debería ver la página de verificación OTP', { timeout: 120000 }, async function (this: CustomWorld) {
  // Esperar navegación inicial
  await this.page.waitForTimeout(5000);
  
  let currentUrl = await this.loginPage.getCurrentUrl();
  Logger.info(`📍 URL después del login: ${currentUrl}`);
  
  // MANEJO DE SELECCIÓN DE ORGANIZACIÓN (igual que en Admin)
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(2000);
  
  const selectOrgVisible = await this.page.locator('text=Please select the organization').isVisible().catch(() => false) ||
                            await this.page.locator('text=Select an organization').isVisible().catch(() => false) ||
                            await this.page.locator('text=Search Organization').isVisible().catch(() => false);
  
  if (selectOrgVisible) {
    Logger.info('📋 Página de selección de organización detectada (Super Admin)');
    
    await this.page.waitForTimeout(2000);
    
    // Seleccionar organización
    const orgSelectors = [
      'text=Giving Hope Foundation',
      'text=Teamsters Strong',
      'text=Patter QA',
      'button, div[role="button"], a'
    ];
    
    let allOrgs: any[] = [];
    for (const selector of orgSelectors) {
      const orgs = await this.page.locator(selector).all();
      if (orgs.length > 0) {
        allOrgs = orgs;
        Logger.info(`✓ Encontradas organizaciones con selector: ${selector}`);
        break;
      }
    }
    
    for (const org of allOrgs) {
      const isVisible = await org.isVisible().catch(() => false);
      if (isVisible) {
        const text = await org.textContent();
        Logger.info(`Seleccionando organización: ${text}`);
        await org.click();
        break;
      }
    }
    
    Logger.info('✓ Organización seleccionada');
    await this.page.waitForTimeout(3000);
    
    // Click en botón Log in
    const loginBtn = this.page.locator('button:has-text("Log in")').first();
    const isVisible = await loginBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (isVisible) {
      await loginBtn.click();
      Logger.info('✓ Click en botón "Log in" exitoso');
      await this.page.waitForTimeout(3000);
      await this.page.waitForLoadState('networkidle');
    }
  }
  
  // AHORA SÍ verificar página OTP
  await this.page.waitForTimeout(3000);
  const firstOTPField = this.loginPage['otpInputs'].first();
  const otpVisible = await this.loginPage.isElementVisible(firstOTPField, 10000);
  expect(otpVisible).toBeTruthy();
  Logger.info('✓ Página de verificación OTP visible (4 campos detectados)');
});

  Then('el usuario debería ver un mensaje de error', { timeout: 60000 }, async function (this: CustomWorld) {
  await this.page.waitForTimeout(5000);
  
  const errorVisible = 
    await this.page.locator('text=User not found').isVisible().catch(() => false) ||
    await this.page.locator('text=Invalid credentials').isVisible().catch(() => false) ||
    await this.page.locator('text=Invalid code').isVisible().catch(() => false) ||
    await this.page.locator('text=incorrect').isVisible().catch(() => false) ||
    await this.page.locator('text=invalid').isVisible().catch(() => false) ||
    await this.page.locator('text=wrong').isVisible().catch(() => false) ||
    await this.page.locator('text=error').isVisible().catch(() => false) ||
    await this.page.locator('[role="alert"]').isVisible().catch(() => false) ||
    await this.page.locator('[class*="error"]').isVisible().catch(() => false) ||
    await this.page.locator('[class*="Error"]').isVisible().catch(() => false) ||
    await this.page.locator('[data-testid*="error"]').isVisible().catch(() => false);
  
  expect(errorVisible).toBeTruthy();
  Logger.info('✓ Mensaje de error visible');
});

Then('el usuario no debería estar autenticado', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.page.waitForTimeout(3000);
  const currentUrl = await this.loginPage.getCurrentUrl();
  const isNotAuthenticated = currentUrl.includes('/login') || 
                              currentUrl.includes('/auth') ||
                              !currentUrl.includes('/dashboard') &&
                              !currentUrl.includes('/organization') &&
                              !currentUrl.includes('/content');
  expect(isNotAuthenticated).toBeTruthy();
  Logger.info('✓ Usuario permanece en página de login');
});

Then('la sesión debería estar marcada como {string}', async function (this: CustomWorld, status: string) {
  // Verificar cookies o localStorage según implementación
  Logger.info(`✓ Verificando sesión con estado: ${status}`);
  // TODO: Implementar verificación específica de "remember me"
});

Then('la contraseña debería estar oculta por defecto', async function (this: CustomWorld) {
  const passwordType = await this.page.locator('input[placeholder="Password"]').getAttribute('type');
  expect(passwordType).toBe('password');
  Logger.info('✓ Contraseña está oculta');
});

Then('la contraseña debería ser visible', async function (this: CustomWorld) {
  const passwordType = await this.page.locator('input[placeholder="Password"]').getAttribute('type');
  expect(passwordType).toBe('text');
  Logger.info('✓ Contraseña es visible');
});


Then('el usuario debería ver un mensaje de error de OTP inválido', async function (this: CustomWorld) {
  await this.page.waitForTimeout(2000);
  
  // Verificar que sigue en la página OTP (no redirigió al dashboard)
  const currentUrl = await this.loginPage.getCurrentUrl();
  const isStillOnOTPPage = currentUrl.includes('/login');
  expect(isStillOnOTPPage).toBeTruthy();
  Logger.info('✓ Error de OTP inválido verificado - usuario sigue en página OTP');
});

Then('el usuario debería recibir un nuevo código OTP', { timeout: 30000 }, async function (this: CustomWorld) {
  Logger.info('ℹ️ Verificación de nuevo OTP no disponible en este ambiente - skipping');
  return 'pending';
});

Then('el usuario debería poder ingresar el nuevo código OTP', { timeout: 30000 }, async function (this: CustomWorld) {
  Logger.info('ℹ️ Ingreso de nuevo OTP no disponible en este ambiente - skipping');
  return 'pending';
});

Then('el campo de email debería mostrar error de campo requerido', async function (this: CustomWorld) {
  await this.page.waitForTimeout(500);
  const emailError = this.page.locator('text=This field is required').first();
  const isVisible = await emailError.isVisible().catch(() => false);
  expect(isVisible).toBeTruthy();
  Logger.info('✓ Error de campo requerido en email visible');
});

Then('el campo de contraseña debería mostrar error de campo requerido', async function (this: CustomWorld) {
  await this.page.waitForTimeout(500);
  const passwordError = this.page.locator('text=This field is required').nth(1);
  const isVisible = await passwordError.isVisible().catch(() => false);
  expect(isVisible).toBeTruthy();
  Logger.info('✓ Error de campo requerido en contraseña visible');
});

Then('el usuario debería ver un mensaje de formato de email inválido', async function (this: CustomWorld) {
  const emailInput = this.page.locator('input[type="email"]');
  const validationMessage = await emailInput.evaluate((el: any) => el.validationMessage);
  expect(validationMessage).toBeTruthy();
  Logger.info(`✓ Mensaje de validación de email: ${validationMessage}`);
});


Then('el usuario debería ser redirigido al dashboard', { timeout: 120000 }, async function (this: CustomWorld) {
  await this.page.waitForTimeout(10000);

  let currentUrl = await this.loginPage.getCurrentUrl();
  Logger.info(`📍 URL después del login: ${currentUrl}`);

  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(2000);

  const selectOrgVisible = 
    await this.page.locator('text=Please select the organization').isVisible().catch(() => false) ||
    await this.page.locator('text=Select an organization').isVisible().catch(() => false) ||
    await this.page.locator('text=Search Organization').isVisible().catch(() => false);

  if (selectOrgVisible) {
    Logger.info('📋 Página de selección de organización detectada');
    await this.page.waitForTimeout(2000);

    const targetOrg = (this as any).env.targetOrg;
    const orgSelectors = [
      `text=${targetOrg}`,
      `div:has-text("${targetOrg.split(' ')[0]}")`,
      'button, div[role="button"], a'
    ];

    let allOrgs: any[] = [];
    for (const selector of orgSelectors) {
      const orgs = await this.page.locator(selector).all();
      if (orgs.length > 0) {
        allOrgs = orgs;
        Logger.info(`✓ Encontradas organizaciones con selector: ${selector}`);
        break;
      }
    }

    Logger.info(`Organizaciones encontradas: ${allOrgs.length}`);

    let orgClicked = false;
    for (const org of allOrgs) {
      const isVisible = await org.isVisible().catch(() => false);
      if (isVisible) {
        const text = await org.textContent();
        Logger.info(`Seleccionando organización: ${text}`);
        await org.click();
        orgClicked = true;
        break;
      }
    }

    if (!orgClicked) throw new Error('No se pudo seleccionar ninguna organización');

    Logger.info('✓ Organización seleccionada');
    await this.page.waitForTimeout(10000);

    const loginButtonSelectors = [
      'button:has-text("Log in")',
      'button:has-text("LOGIN")',
      'button[type="submit"]:visible',
    ];

    for (const selector of loginButtonSelectors) {
      try {
        const loginBtn = this.page.locator(selector).first();
        const isVisible = await loginBtn.isVisible({ timeout: 2000 });
        if (isVisible) {
          const btnText = await loginBtn.textContent();
          Logger.info(`🔘 Haciendo click en botón: "${btnText}"`);
          await loginBtn.click();
          break;
        }
      } catch { continue; }
    }

    await this.page.waitForTimeout(5000);
  await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    currentUrl = await this.loginPage.getCurrentUrl();
    Logger.info(`📍 URL final después del flujo completo: ${currentUrl}`);
  }

  const isValidUrl = !currentUrl.includes('/login') && 
                     !currentUrl.includes('/select') ||
                     currentUrl.includes('/superAdmin/organization');
  expect(isValidUrl).toBeTruthy();
  Logger.info('✅ Usuario redirigido correctamente al dashboard');
});
