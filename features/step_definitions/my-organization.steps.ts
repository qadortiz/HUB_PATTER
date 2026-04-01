import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { Logger } from '../../src/utils/Logger';
import path from 'path';

const IMAGE_PATH = path.join(process.cwd(), 'Screenshot_108.png');
// =============================================================================
// WHEN Steps - Acciones
// =============================================================================

When('el usuario navega a la sección My Organization', { timeout: 30000 }, async function (this: CustomWorld) {
  // Cerrar modal de Update si aparece
  const updateModal = this.page.locator('button:has-text("Update")').first();
  const isUpdateVisible = await updateModal.isVisible().catch(() => false);
  if (isUpdateVisible) {
    await updateModal.click();
    await this.page.waitForTimeout(1000);
    Logger.info('✓ Modal de Update cerrado');
  }

  await this.page.locator('p:has-text("My Organization")').click();
  await this.page.waitForURL('**/organization', { timeout: 30000 });
  await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  Logger.info('✓ Navegado a My Organization');
});

When('el usuario hace scroll hasta el botón Add Card y hace clic', { timeout: 30000 }, async function (this: CustomWorld) {
  const addCardBtn = this.page.locator('button:has-text("Add Card")').first();
  await addCardBtn.waitFor({ state: 'visible', timeout: 20000 });
  await addCardBtn.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(500);
  await addCardBtn.click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Click en Add Card');
});

When('el usuario ingresa el título de la card {string}', { timeout: 15000 }, async function (this: CustomWorld, title: string) {
  // El input de la última card agregada
  const cardInput = this.page.locator('input[data-testid^="tabs."][data-testid$=".name"]').last();
  await cardInput.waitFor({ state: 'visible', timeout: 10000 });
  await cardInput.scrollIntoViewIfNeeded();
  await cardInput.click({ clickCount: 3 });
  await cardInput.fill(title);
  await this.page.waitForTimeout(500);
  Logger.info(`✓ Título de card ingresado: ${title}`);
});

When('el usuario hace clic en Upload Image', { timeout: 15000 }, async function (this: CustomWorld) {
  const uploadImageBtn = this.page.locator('button:has-text("Upload Image")').last();
  await uploadImageBtn.waitFor({ state: 'visible', timeout: 10000 });
  await uploadImageBtn.scrollIntoViewIfNeeded();
  await uploadImageBtn.click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Click en Upload Image');
});

When('el usuario sube la imagen desde el sistema de archivos', { timeout: 30000 }, async function (this: CustomWorld) {
  // Esperar el botón Upload dentro del modal
  const uploadBtn = this.page.locator('button:has-text("Upload")').last();
  await uploadBtn.waitFor({ state: 'visible', timeout: 10000 });

  // Interceptar el file chooser y subir la imagen
  const [fileChooser] = await Promise.all([
    this.page.waitForEvent('filechooser'),
    uploadBtn.click()
  ]);

  await fileChooser.setFiles(IMAGE_PATH);
  await this.page.waitForTimeout(2000);
  Logger.info(`✓ Imagen subida: ${IMAGE_PATH}`);
});

When('el usuario hace clic en Finish Crop', { timeout: 30000 }, async function (this: CustomWorld) {
  const finishCropBtn = this.page.locator('button:has-text("Finish Crop")').first();
  await finishCropBtn.waitFor({ state: 'visible', timeout: 20000 });
  await finishCropBtn.click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Click en Finish Crop');
});

When('el usuario hace clic en Save imagen', { timeout: 30000 }, async function (this: CustomWorld) {
  // Esperar que Finish Crop habilite el botón Save dentro del dialog
  await this.page.waitForTimeout(1000);
  const saveBtn = this.page.locator('[data-headlessui-state="open"] button:has-text("Save"), div[role="dialog"] button:has-text("Save")').first();
  await saveBtn.waitFor({ state: 'visible', timeout: 20000 });
  await saveBtn.scrollIntoViewIfNeeded();
  await saveBtn.click();
  await this.page.waitForTimeout(500);
  Logger.info('✓ Click en Save imagen');
});

When('el usuario espera que la imagen se guarde', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.page.waitForTimeout(3000);
  await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  Logger.info('✓ Imagen guardada');
});

When('el usuario hace clic en New Component', { timeout: 15000 }, async function (this: CustomWorld) {
  const newComponentBtn = this.page.locator('button:has-text("New Component")').last();
  await newComponentBtn.waitFor({ state: 'visible', timeout: 10000 });
  await newComponentBtn.scrollIntoViewIfNeeded();
  await newComponentBtn.click();
  await this.page.waitForTimeout(500);
  Logger.info('✓ Click en New Component');
});

When('el usuario selecciona Custom Text', { timeout: 15000 }, async function (this: CustomWorld) {
  const customTextOption = this.page.locator('input#simple_text').first();
  await customTextOption.waitFor({ state: 'attached', timeout: 10000 });
  await this.page.locator('p:has-text("Custom Text")').first().click();
  await this.page.waitForTimeout(500);
  Logger.info('✓ Custom Text seleccionado');
});

When('el usuario hace clic en Add Component', { timeout: 15000 }, async function (this: CustomWorld) {
  const addComponentBtn = this.page.locator('button:has-text("Add Component")').first();
  await addComponentBtn.waitFor({ state: 'visible', timeout: 10000 });
  await addComponentBtn.click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Click en Add Component');
});

When('el usuario expande el componente Custom Text', { timeout: 15000 }, async function (this: CustomWorld) {
  const customTextHeader = this.page.locator('span:has-text("Custom Text")').last();
  await customTextHeader.waitFor({ state: 'visible', timeout: 10000 });
  await customTextHeader.scrollIntoViewIfNeeded();
  await customTextHeader.click();
  await this.page.waitForTimeout(500);
  Logger.info('✓ Componente Custom Text expandido');
});

When('el usuario ingresa el título del componente {string}', { timeout: 15000 }, async function (this: CustomWorld, title: string) {
  const titleInput = this.page.locator('input[data-testid$="component_value.title"]').last();
  await titleInput.waitFor({ state: 'visible', timeout: 10000 });
  await titleInput.scrollIntoViewIfNeeded();
  await titleInput.click({ clickCount: 3 });
  await titleInput.fill(title);
  await this.page.waitForTimeout(300);
  Logger.info(`✓ Título del componente ingresado: ${title}`);
});

When('el usuario ingresa el texto del componente {string}', { timeout: 15000 }, async function (this: CustomWorld, text: string) {
  // Editor Quill — click en el área editable y escribir
  const quillEditor = this.page.locator('.ql-editor').last();
  await quillEditor.waitFor({ state: 'visible', timeout: 10000 });
  await quillEditor.scrollIntoViewIfNeeded();
  await quillEditor.click();
  await quillEditor.fill(text);
  await this.page.waitForTimeout(300);
  Logger.info(`✓ Texto del componente ingresado: ${text}`);
});

When('el usuario hace clic en Save', { timeout: 15000 }, async function (this: CustomWorld) {
  const saveBtn = this.page.locator('button:has-text("Save")').last();
  await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
  await saveBtn.scrollIntoViewIfNeeded();
  await saveBtn.click();
  await this.page.waitForTimeout(3000);
  Logger.info('✓ Click en Save');
});

// =============================================================================
// THEN Steps - Verificaciones
// =============================================================================

Then('debería aparecer el modal de éxito {string}', { timeout: 30000 }, async function (this: CustomWorld, message: string) {
  const successModal = this.page.locator(`text=${message}`).first();
  const isVisible = await successModal.isVisible({ timeout: 15000 }).catch(() => false);
  expect(isVisible).toBeTruthy();
  Logger.info(`✓ Modal de éxito visible: ${message}`);
});
