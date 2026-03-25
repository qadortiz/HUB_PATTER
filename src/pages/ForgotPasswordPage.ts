import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/Logger';

/**
 * Page Object para la página de Forgot Password
 */
export class ForgotPasswordPage extends BasePage {
  // Locators
 // Locators
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    
    this.emailInput = page.locator('input[id="emailRecoverYourPassword"], input[placeholder*="verified email" i]'); 
    this.submitButton = page.locator('button[id="saveRecoverYourPassword"], button:has-text("Save")'); 
    this.successMessage = page.locator('[data-testid="success-message"], .success, text=/email.*sent/i');
    this.errorMessage = page.locator('[data-testid="error-message"], .error, .text-red');
  }

    async goto(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/forgot-password`);
    await this.page.waitForLoadState('networkidle');
    Logger.info('✓ Página de forgot password cargada');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async enterEmail(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email, 'Email de recuperación');
    Logger.info(`Email ingresado: ${email}`);
  }

  async clickSubmit(): Promise<void> {
    await this.clickElement(this.submitButton, 'Submit forgot password');
    Logger.info('✓ Click en enviar solicitud');
  }

  async hasSuccessMessage(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasErrorMessage(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}