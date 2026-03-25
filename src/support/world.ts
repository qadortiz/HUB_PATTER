import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ContentPage } from '../pages/ContentPage';
import { DirectPushPage } from '../pages/DirectPushPage';
import { getEnvironment } from '../config/environments';
import { Logger } from '../utils/Logger';

/**
 * CustomWorld - Contexto compartido entre steps de Cucumber
 * Contiene el browser, page y todos los Page Objects
 */
export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  
  // Page Objects
  public loginPage!: LoginPage;
  public dashboardPage!: DashboardPage;
  public forgotPasswordPage!: ForgotPasswordPage;
  public resetPasswordPage!: ResetPasswordPage;
  public contentPage!: ContentPage;
public directPushPage!: DirectPushPage;



  // Environment config
  private readonly env = getEnvironment();
  
  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Inicializa el browser y el contexto
   */
  async init(): Promise<void> {
    Logger.info('Inicializando navegador...');
    
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADED !== 'true';
    
    // Seleccionar navegador
    switch (browserType.toLowerCase()) {
      case 'firefox':
        this.browser = await firefox.launch({ headless });
        break;
      case 'webkit':
      case 'safari':
        this.browser = await webkit.launch({ headless });
        break;
      default:
        this.browser = await chromium.launch({
          headless,
          args: ['--disable-blink-features=AutomationControlled'],
        });
    }

    // Crear contexto con configuración
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      acceptDownloads: true,
      recordVideo: process.env.CI ? { dir: 'videos/' } : undefined,
      ignoreHTTPSErrors: true,
    });

    // Crear página
    this.page = await this.context.newPage();
    
    // Inicializar Page Objects
    this.loginPage = new LoginPage(this.page, this.env.baseUrl);
    this.dashboardPage = new DashboardPage(this.page, this.env.baseUrl);
    this.forgotPasswordPage = new ForgotPasswordPage(this.page, this.env.baseUrl);
    this.resetPasswordPage = new ResetPasswordPage(this.page, this.env.baseUrl);
    this.contentPage = new ContentPage(this.page, this.env.baseUrl);
    this.directPushPage = new DirectPushPage(this.page, this.env.baseUrl);
    
    Logger.info(`Navegador ${browserType} inicializado correctamente`);
  }

  /**
   * Cierra el browser y libera recursos
   */
  async destroy(): Promise<void> {
    Logger.info('Cerrando navegador...');
    
    if (this.page) {
      await this.page.close();
    }
    
    if (this.context) {
      await this.context.close();
    }
    
    if (this.browser) {
      await this.browser.close();
    }
    
    Logger.info('Navegador cerrado correctamente');
  }

  /**
   * Captura screenshot en caso de error
   */
  async captureScreenshot(name: string): Promise<Buffer | undefined> {
    if (this.page) {
      const screenshot = await this.page.screenshot({
        path: `screenshots/${name}-${Date.now()}.png`,
        fullPage: true,
      });
      return screenshot;
    }
    return undefined;
  }

  /**
   * Obtiene las credenciales según el tipo de usuario
   */
  getCredentials(userType: 'admin' | 'superadmin'): { email: string; password: string } {
    if (userType === 'admin') {
      return {
        email: this.env.adminEmail,
        password: this.env.adminPassword,
      };
    } else {
      return {
        email: this.env.superAdminEmail,
        password: this.env.superAdminPassword,
      };
    }
  }
}

// Registrar CustomWorld
setWorldConstructor(CustomWorld);
