import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { Logger } from '../../src/utils/Logger';

When('hago clic en el botón {string}', { timeout: 30000 }, async function (this: CustomWorld, buttonText: string) {
  if (buttonText === 'New Direct Push Notification') {
    await this.directPushPage.handleUpdateModal();
    await this.directPushPage.clickNewDirectPush();
  }
});

When('ingreso el título de la push {string}', async function (this: CustomWorld, title: string) {
  await this.directPushPage.enterTitle(title);
});

When('ingreso el mensaje de la push {string}', async function (this: CustomWorld, message: string) {
  await this.directPushPage.enterMessage(message);
});

When('hago clic en el botón Send de la push', async function (this: CustomWorld) {
  await this.directPushPage.clickSend();
});

When('confirmo la publicación de la push con {string}', { timeout: 100000 }, async function (this: CustomWorld, buttonText: string) {
  if (buttonText === 'Publish now') {
    await this.directPushPage.confirmPublish();
  }
});

When('espero {int} segundos para confirmar el envío', { timeout: 30000 }, async function (this: CustomWorld, seconds: number) {
  await this.page.waitForTimeout(seconds * 1000);
  Logger.info(`✓ Esperó ${seconds} segundos`);
});

Then('la notificación push directa debería ser enviada exitosamente', async function (this: CustomWorld) {
  const isSuccess = await this.directPushPage.verifyPushSent();
  expect(isSuccess).toBeTruthy();
  Logger.info('✅ Notificación push directa enviada exitosamente');
});