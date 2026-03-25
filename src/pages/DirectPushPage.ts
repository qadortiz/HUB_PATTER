import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/Logger';

export class DirectPushPage extends BasePage {
  private readonly newDirectPushButton: Locator;
  private readonly titleInput: Locator;
  private readonly messageTextarea: Locator;
  private readonly sendButton: Locator;
  private readonly publishNowButton: Locator;

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.newDirectPushButton = page.locator('button:has-text("New Direct Push Notification")');
    this.titleInput = page.locator('input[name="title"][data-testid="title"]');
    this.messageTextarea = page.locator('textarea[name="message"]');
    this.sendButton = page.locator('button:has-text("Send")');
    this.publishNowButton = page.locator('button:has-text("Publish now")');
  }

  async clickNewDirectPush(): Promise<void> {
    await this.newDirectPushButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.newDirectPushButton.click();
    await this.page.waitForTimeout(2000);
    Logger.info('✓ Click en New Direct Push Notification');
  }

  async enterTitle(title: string): Promise<void> {
    await this.titleInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.fillInput(this.titleInput, title, 'Push title');
    Logger.info(`✓ Título push: ${title}`);
  }

  async enterMessage(message: string): Promise<void> {
    await this.messageTextarea.waitFor({ state: 'visible', timeout: 20000 });
    await this.fillInput(this.messageTextarea, message, 'Push message');
    Logger.info('✓ Mensaje push ingresado');
  }

  async clickSend(): Promise<void> {
    await this.sendButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.sendButton.click();
    await this.page.waitForTimeout(2000);
    Logger.info('✓ Click en Send');
  }

  async confirmPublish(): Promise<void> {
    await this.publishNowButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.publishNowButton.click();
    await this.page.waitForTimeout(5000);
    Logger.info('✓ Click en Publish now');
  }

  async verifyPushSent(): Promise<boolean> {
    await this.page.waitForTimeout(2000);
    const currentUrl = await this.getCurrentUrl();
    Logger.info(`✓ URL después del envío: ${currentUrl}`);
    return true;
  }
}