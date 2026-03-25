import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/Logger';

/**
 * DashboardPage - Page Object para el dashboard principal después del login
 */
export class DashboardPage extends BasePage {
  // Locators principales del dashboard
  private readonly userProfileMenu: Locator;
  private readonly dashboardTitle: Locator;
  private readonly logoutButton: Locator;
  private readonly sidebarMenu: Locator;
  private readonly notificationsIcon: Locator;

  constructor(page: Page, baseURL: string) {
    super(page, baseURL);
    
    // Inicializando locators (se ajustarán según la página real)
    this.userProfileMenu = page.locator('[data-testid="user-menu"], [class*="user-profile"], .user-menu');
    this.dashboardTitle = page.locator('h1, h2').first();
    this.logoutButton = page.getByText(/logout|sign out|cerrar sesión/i);
    this.sidebarMenu = page.locator('aside, nav[class*="sidebar"], [class*="navigation"]');
    this.notificationsIcon = page.locator('[data-testid="notifications"], [class*="notification"]');
  }

  /**
   * Verifica que el dashboard está cargado correctamente
   */
  async isDashboardLoaded(): Promise<boolean> {
    Logger.info('Verificando que el dashboard esté cargado');
    
    // Verificar múltiples elementos para asegurar que estamos en el dashboard
    const hasSidebar = await this.isElementVisible(this.sidebarMenu, 10000);
    const hasTitle = await this.isElementVisible(this.dashboardTitle, 10000);
    
    return hasSidebar || hasTitle;
  }

  /**
   * Obtiene el título del dashboard
   */
  async getDashboardTitle(): Promise<string> {
    return await this.getElementText(this.dashboardTitle);
  }

  /**
   * Abre el menú de perfil de usuario
   */
  async openUserProfileMenu(): Promise<void> {
    await this.clickElement(this.userProfileMenu, 'User profile menu');
  }

  /**
   * Cierra sesión
   */
  async logout(): Promise<void> {
    Logger.info('Cerrando sesión');
    await this.openUserProfileMenu();
    await this.clickElement(this.logoutButton, 'Logout button');
    await this.waitForNavigation();
  }

  /**
   * Verifica que el usuario está autenticado
   */
  async isUserLoggedIn(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return !currentUrl.includes('/login') && await this.isDashboardLoaded();
  }

  /**
   * Navega a una sección específica del dashboard
   */
  async navigateToSection(sectionName: string): Promise<void> {
    Logger.info(`Navegando a la sección: ${sectionName}`);
    const menuItem = this.page.getByText(sectionName, { exact: false });
    await this.clickElement(menuItem, `Menu item: ${sectionName}`);
    await this.waitForNavigation();
  }
}
