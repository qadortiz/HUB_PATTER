import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { Logger } from '../../src/utils/Logger';

When('navego a la sección de contenido', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.contentPage.navigateToContent();
  Logger.info('✓ Navegó a sección de contenido');
});

When('hago clic en nuevo contenido', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.contentPage.clickNewContentItem();
  Logger.info('✓ Click en nuevo contenido');
});

When('ingreso el título del contenido {string}', { timeout: 30000 }, async function (this: CustomWorld, title: string) {
  await this.contentPage.fillTitle(title);
});

When('ingreso la descripción {string}', { timeout: 30000 }, async function (this: CustomWorld, description: string) {
  await this.contentPage.fillDescription(description);
});

When('agrego una imagen al contenido', { timeout: 60000 }, async function (this: CustomWorld) {
  await this.contentPage.addImage();
});

When('selecciono el tipo de contenido {string}', { timeout: 30000 }, async function (this: CustomWorld, tipo: string) {
  await this.contentPage.selectContentType(tipo);
});

When('hago clic en Push Notification', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.contentPage.clickPushNotification();
});

When('selecciono publicar ahora', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.contentPage.selectPublishNow();
});

When('selecciono copiar el mismo contenido', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.contentPage.selectCopySameContent();
});

When('guardo la configuración de push', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.contentPage.savePushConfiguration();
});

When('confirmo la publicación con Publish now', { timeout: 60000 }, async function (this: CustomWorld) {
  await this.contentPage.confirmPublishNow();
});

Then('el contenido con push debería ser publicado exitosamente', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.page.waitForTimeout(3000);
  const url = await this.page.url();
  Logger.info(`✓ URL actual: ${url}`);
  expect(url).not.toContain('/create');
  Logger.info('✅ Contenido con push publicado exitosamente');
});