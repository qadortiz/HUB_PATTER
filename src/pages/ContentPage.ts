import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/Logger';

export class ContentPage extends BasePage {
  private readonly contentMenuLink: Locator;
  private readonly newContentButton: Locator;
  private readonly titleInput: Locator;
  private readonly descriptionEditor: Locator;
  private readonly browseImagesButton: Locator;
  private readonly firstImage: Locator;
  private readonly publishButton: Locator;
  private readonly pushNotificationButton: Locator;
  private readonly publishNowRadio: Locator;
  private readonly copySameContentRadio: Locator;
  private readonly savePushButton: Locator;
  private readonly publishNowConfirmButton: Locator;

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.contentMenuLink = page.locator('a[href="/content"]');
    this.newContentButton = page.locator('button:has-text("New Content Item")').first();
    this.titleInput = page.locator('[data-testid="title"]');
    this.descriptionEditor = page.locator('.ql-editor');
    this.browseImagesButton = page.locator('text=Browse Images');
    this.firstImage = page.locator('img[alt="content"]').first();
    this.publishButton = page.locator('button:has-text("Publish")').first();
    this.pushNotificationButton = page.locator('button:has-text("Push Notification")');
    this.publishNowRadio = page.locator('#publishNow-3');
    this.copySameContentRadio = page.locator('#yes-2');
    this.savePushButton = page.locator('button[type="submit"]:has-text("Save")');
    this.publishNowConfirmButton = page.locator('button:has-text("Publish now")');
  }

  // Maneja el modal de Update que aparece después del login

  async navigateToContent(): Promise<void> {
    await this.handleUpdateModal();
    await this.page.goto(`${this.baseUrl}/content`);
    await this.page.waitForLoadState('networkidle');
    Logger.info('✓ Navegó a Content');
  }

  async clickNewContentItem(): Promise<void> {
    await this.page.waitForTimeout(2000);
    await this.newContentButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.newContentButton.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info('✓ Click en New Content Item');
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.fillInput(this.titleInput, title, 'Title');
    Logger.info(`✓ Título: ${title}`);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionEditor.waitFor({ state: 'visible', timeout: 20000 });
    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(description);
    Logger.info('✓ Descripción ingresada');
  }

 async addImage(): Promise<void> {
  // 1. Click en "Add an Image or video."
  const addImageButton = this.page.getByRole('button', { name: 'Add an Image or video.' });
  await addImageButton.waitFor({ state: 'visible', timeout: 20000 });
  await addImageButton.click();
  await this.page.waitForTimeout(1000);

  // 2. Esperar que el modal esté visible
  await this.page.waitForSelector('text=Add Images/Video', { timeout: 10000 });

  // 3. Click en "Browse Images"
  await this.page.getByRole('button', { name: 'Browse Images' }).click();
  await this.page.waitForTimeout(10000);

  // 4. Esperar imágenes dentro del portal - selector específico
  await this.page.waitForSelector(
    '#headlessui-portal-root button.h-48',
    { state: 'visible', timeout: 15000 }
  );

  // 5. Click en primera imagen
  await this.page.locator('#headlessui-portal-root button.h-48').first().click();
  await this.page.waitForTimeout(1000);

  // 6. Esperar confirmación y click en Save
  await this.page.waitForSelector('text=1 image uploaded', { timeout: 10000 });
    await this.page.locator('button[type="submit"]:has-text("Save"):not([disabled])').last().click();
  Logger.info('✓ Imagen agregada');

  // 7. Esperar que cierre el modal
  await this.page.waitForSelector('text=Add Images/Video', { state: 'hidden', timeout: 10000 });
  await this.page.waitForTimeout(2000);
}

async selectContentType(tipo: string): Promise<void> {
  // Abrir dropdown Content Type — usar aria-haspopup más robusto que ID dinámico
  const dropdown = this.page.locator('button[aria-haspopup="listbox"]').first();
  await dropdown.waitFor({ state: 'visible', timeout: 10000 });
  await dropdown.click();
  await this.page.waitForTimeout(1000);

  // Seleccionar la opción
  const option = this.page.locator(`[role="option"]:has-text("${tipo}")`);
  await option.waitFor({ state: 'visible', timeout: 5000 });
  await option.click();
  Logger.info(`✓ Content Type seleccionado: ${tipo}`);
  await this.page.waitForTimeout(1000);
}

  async clickPushNotification(): Promise<void> {
    await this.pushNotificationButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.pushNotificationButton.click();
    await this.page.waitForTimeout(2000);
    Logger.info('✓ Click en Push Notification');
  }

  async selectPublishNow(): Promise<void> {
    await this.publishNowRadio.waitFor({ state: 'visible', timeout: 20000 });
    await this.publishNowRadio.click();
    await this.page.waitForTimeout(1000);
    Logger.info('✓ Publish Now seleccionado');
  }

  async selectCopySameContent(): Promise<void> {
    await this.copySameContentRadio.waitFor({ state: 'visible', timeout: 20000 });
    await this.copySameContentRadio.click();
    await this.page.waitForTimeout(1000);
    Logger.info('✓ Copy same content seleccionado');
  }

  async savePushConfiguration(): Promise<void> {
    await this.savePushButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.savePushButton.click();
    await this.page.waitForTimeout(2000);
    Logger.info('✓ Configuración de push guardada');
  }

async confirmPublishNow(): Promise<void> {
  // 1. Scroll y click en botón "Publish" de la barra inferior
  const publishBtn = this.page.getByRole('button', { name: 'Publish', exact: true });
  await publishBtn.scrollIntoViewIfNeeded();
  await publishBtn.waitFor({ state: 'visible', timeout: 10000 });
  await publishBtn.waitFor({ state: 'attached', timeout: 10000 });
  await this.page.waitForTimeout(2000);
  await publishBtn.click();
  Logger.info('✓ Click en Publish');

  // 2. Esperar modal de confirmación
  await this.page.waitForSelector('text=Confirm Content Publication', { timeout: 15000 });
  Logger.info('✓ Modal de confirmación visible');

  // 3. Scroll y click en "Publish now" dentro del modal
  const publishNowBtn = this.page.getByRole('button', { name: 'Publish now', exact: true });
  await publishNowBtn.scrollIntoViewIfNeeded();
  await publishNowBtn.waitFor({ state: 'visible', timeout: 10000 });
  await publishNowBtn.click();
  Logger.info('✓ Click en Publish now');

  // 4. Esperar redirección con timeout mayor y fallback
  try {
    await this.page.waitForURL('**/content', { timeout: 60000 });
    Logger.info('✓ Contenido publicado - redirigido a /content');
  } catch {
    const currentUrl = this.page.url();
    Logger.warn(`⚠️ waitForURL timeout - URL actual: ${currentUrl}`);
    if (!currentUrl.includes('/content')) {
      throw new Error(`No se redirigió a /content después del publish. URL actual: ${currentUrl}`);
    }
    Logger.info('✓ Contenido publicado correctamente');
  }
}
  
  async isContentPageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.newContentButton);
  }
}