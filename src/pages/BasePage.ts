import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/Logger';

/**
 * BasePage - Clase base para todos los Page Objects
 * Contiene métodos reutilizables y buenas prácticas de Playwright
 */
export class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async navigate(path: string = ''): Promise<void> {
    const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
    Logger.info(`Navegando a: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickElement(locator: Locator, description: string = ''): Promise<void> {
    Logger.debug(`Click en: ${description || locator.toString()}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fillInput(locator: Locator, value: string, description: string = ''): Promise<void> {
    Logger.debug(`Llenando campo ${description}: ${value}`);
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async getElementText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElementToDisappear(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    Logger.info(`Screenshot guardado: ${filename}`);
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async refresh(): Promise<void> {
    Logger.debug('Refrescando página');
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async urlContains(text: string): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes(text);
  }

  async wait(milliseconds: number): Promise<void> {
    Logger.warn(`Esperando ${milliseconds}ms - considerar usar waitForElement en su lugar`);
    await this.page.waitForTimeout(milliseconds);
  }

  async verifyElementText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

 async handleUpdateModal(): Promise<void> {
  Logger.info('🔍 Buscando modal de Update...');
  try {
    const updateButton = this.page.locator('button.bg-blue-primary:has(span:has-text("Update"))').first();
    // Esperar hasta 10 segundos a que aparezca
    await updateButton.waitFor({ state: 'visible', timeout: 10000 });
    await updateButton.click();
    Logger.info('✓ Click en Update');
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState('networkidle');
  } catch {
    Logger.info('ℹ️ Modal de Update no apareció');
  }
}

  async handleDialog(accept: boolean = true): Promise<void> {
    this.page.on('dialog', async dialog => {
      Logger.info(`Dialog detectado: ${dialog.message()}`);
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
}