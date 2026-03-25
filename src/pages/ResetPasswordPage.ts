import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/Logger';

/**
 * Page Object para Reset Password
 * URL: https://hub.patter.com/resetPassword/{token}
 */
export class ResetPasswordPage extends BasePage {
  // Locator basado en el video: data-testid="password", placeholder="Type a New password"
// Locator basado en el video: data-testid="password", placeholder="Type a New password"
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly expiredMessage: Locator;

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    
    // Input del video: name="password" id="password" data-testid="password"
    this.passwordInput = page.locator('input[data-testid="password"], input[name="password"], input[id="password"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Change")');
    this.successMessage = page.locator('.success, text=/password.*changed|password.*updated/i');
    this.errorMessage = page.locator('.error, .text-red');
    this.expiredMessage = page.locator('text=/link.*expired|token.*expired/i');
  }

  async gotoWithFullUrl(resetUrl: string): Promise<void> {
    Logger.info(`Navegando a link de reset: ${resetUrl.substring(0, 80)}...`);
    await this.page.goto(resetUrl);
await this.page.waitForLoadState('networkidle');    Logger.info('✓ Página de reset password cargada');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      Logger.info('✓ Página de reset password detectada');
      return true;
    } catch {
      return false;
    }
  }

  async isLinkExpired(): Promise<boolean> {
    try {
      await this.expiredMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async enterNewPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password, 'Nueva contraseña');
    Logger.info('✓ Nueva contraseña ingresada');
  }

  async clickSubmit(): Promise<void> {
    await this.clickElement(this.submitButton, 'Submit reset password');
    await this.wait(2000);
    Logger.info('✓ Click en restablecer contraseña');
  }

  async hasSuccessMessage(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
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