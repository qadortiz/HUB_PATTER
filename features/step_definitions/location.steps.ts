import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { Logger } from '../../src/utils/Logger';

// =============================================================================
// WHEN Steps - Acciones
// =============================================================================

When('el usuario navega a la sección Location', { timeout: 30000 }, async function (this: CustomWorld) {
  // Cerrar modal de Update si aparece
  const updateModal = this.page.locator('button:has-text("Update")').first();
  const isUpdateVisible = await updateModal.isVisible().catch(() => false);
  if (isUpdateVisible) {
    await updateModal.click();
    await this.page.waitForTimeout(1000);
    Logger.info('✓ Modal de Update cerrado');
  }

  await this.page.locator('a[href="/location"]').click();
  await this.page.waitForURL('**/location', { timeout: 30000 });
  await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  Logger.info('✓ Navegado a Location');
});

When('el usuario hace clic en New Location', { timeout: 30000 }, async function (this: CustomWorld) {
  const newLocationBtn = this.page.locator('a[href="/location/create"], button:has-text("New Location")').first();
  await newLocationBtn.waitFor({ state: 'visible', timeout: 20000 });
  await newLocationBtn.click();
  await this.page.waitForURL('**/location/create', { timeout: 30000 });
  await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  Logger.info('✓ Click en New Location');
});

When('el usuario hace clic en Add an Image or video', { timeout: 15000 }, async function (this: CustomWorld) {
  const addMediaBtn = this.page.locator('p:has-text("Add an Image or video.")').first();
  await addMediaBtn.waitFor({ state: 'visible', timeout: 10000 });
  await addMediaBtn.click();
  await this.page.waitForTimeout(500);
  Logger.info('✓ Click en Add an Image or video');
});

When('el usuario hace clic en Browse Images', { timeout: 15000 }, async function (this: CustomWorld) {
  const browseBtn = this.page.locator('button:has-text("Browse Images")').first();
  await browseBtn.waitFor({ state: 'visible', timeout: 10000 });
  await browseBtn.click();
  Logger.info('✓ Click en Browse Images');
});

When('el usuario espera que la librería cargue', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.page.waitForTimeout(3000);
  await this.page.waitForSelector('#headlessui-portal-root button.h-48', { state: 'visible', timeout: 15000 });
  Logger.info('✓ Librería de imágenes cargada');
});

When('el usuario selecciona la primera imagen de la librería', { timeout: 15000 }, async function (this: CustomWorld) {
  await this.page.locator('#headlessui-portal-root button.h-48').first().click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Primera imagen seleccionada');
});

When('el usuario hace clic en Save imagen de location', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.page.waitForSelector('text=1 image uploaded', { timeout: 10000 });
  await this.page.locator('button[type="submit"]:has-text("Save"):not([disabled])').last().click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Click en Save imagen de location');
});

When('el usuario ingresa el nombre de la location {string}', { timeout: 15000 }, async function (this: CustomWorld, name: string) {
  const nameInput = this.page.locator('input[data-testid="title"][placeholder="Name"]').first();
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });
  await nameInput.click({ clickCount: 3 });
  await nameInput.fill(name);
  await this.page.waitForTimeout(300);
  Logger.info(`✓ Nombre de location ingresado: ${name}`);
});

When('el usuario ingresa la dirección {string}', { timeout: 15000 }, async function (this: CustomWorld, address: string) {
  const addressInput = this.page.locator('input[placeholder="Begin typing address"]').first();
  await addressInput.waitFor({ state: 'visible', timeout: 10000 });
  await addressInput.click();
  await addressInput.fill(address);
  await this.page.waitForTimeout(2000); // Esperar sugerencias de Google
  Logger.info(`✓ Dirección ingresada: ${address}`);
});

When('el usuario selecciona la primera sugerencia de dirección', { timeout: 15000 }, async function (this: CustomWorld) {
  // Esperar que aparezcan las sugerencias del autocomplete de Google
  const firstSuggestion = this.page.locator('.pac-item').first();
  await firstSuggestion.waitFor({ state: 'visible', timeout: 10000 });
  await firstSuggestion.click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Primera sugerencia de dirección seleccionada');
});

When('el usuario ingresa la descripción de la location {string}', { timeout: 15000 }, async function (this: CustomWorld, description: string) {
  const quillEditor = this.page.locator('.ql-editor').first();
  await quillEditor.waitFor({ state: 'visible', timeout: 10000 });
  await quillEditor.click();
  await quillEditor.fill(description);
  await this.page.waitForTimeout(300);
  Logger.info(`✓ Descripción ingresada: ${description}`);
});

When('el usuario hace clic en Publish location', { timeout: 30000 }, async function (this: CustomWorld) {
  const publishBtn = this.page.locator('button:has-text("Publish location")').first();
  await publishBtn.waitFor({ state: 'visible', timeout: 10000 });
  await publishBtn.scrollIntoViewIfNeeded();
  await publishBtn.click();
  await this.page.waitForTimeout(5000); // Esperar que el servidor procese
  Logger.info('✓ Click en Publish location');
});

// =============================================================================
// THEN Steps - Verificaciones
// =============================================================================

Then('debería aparecer el modal de éxito de location', { timeout: 30000 }, async function (this: CustomWorld) {
  try {
    await this.page.waitForSelector('text=Location Created', { timeout: 10000 });
    Logger.info('✓ Modal de éxito de location visible: Location Created');
  } catch {
    try {
      await this.page.waitForSelector('text=Success', { timeout: 10000 });
      Logger.info('✓ Modal de éxito de location visible: Success');
    } catch {
      // El modal puede haber aparecido y cerrado — verificar redirección
      const currentUrl = this.page.url();
      Logger.info(`📍 URL actual: ${currentUrl}`);
      expect(currentUrl).not.toContain('/create');
      Logger.info('✓ Location creada exitosamente — redirigido fuera de /create');
    }
  }
});