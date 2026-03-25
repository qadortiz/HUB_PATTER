import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { Logger } from '../../src/utils/Logger';

Given('el usuario tiene credenciales de {string}', async function (this: CustomWorld, userType: string) {
  const credentials = this.getCredentials(userType as 'admin' | 'superadmin');
  expect(credentials.email).toBeTruthy();
  expect(credentials.password).toBeTruthy();
  Logger.info(`✓ Credenciales de ${userType} obtenidas correctamente`);
});
// =============================================================================
// WHEN Steps - Acciones
// =============================================================================

When('el usuario navega a la sección My People', { timeout: 30000 }, async function (this: CustomWorld) {
  // Cerrar modal de Update si aparece
  const updateModal = this.page.locator('button:has-text("Update")').first();
  const isUpdateVisible = await updateModal.isVisible().catch(() => false);
  if (isUpdateVisible) {
    await updateModal.click();
    await this.page.waitForTimeout(1000);
    Logger.info('✓ Modal de Update cerrado');
  }

  await this.page.locator('a[href="/people"]').click();
  Logger.info('✓ Click en My People');
});

When('el usuario espera que My People cargue correctamente', { timeout: 60000 }, async function (this: CustomWorld) {
  await this.page.waitForURL('**/people', { timeout: 30000 });
  await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  await this.page.waitForSelector('button:has-text("Filter")', { timeout: 30000 });
  Logger.info('✓ My People cargado correctamente');
});

When('el usuario hace clic en el botón Filter', async function (this: CustomWorld) {
  const filterBtn = this.page.locator('button:has-text("Filter")').first();
  await filterBtn.waitFor({ state: 'visible', timeout: 10000 });
  await filterBtn.click();
  await this.page.waitForTimeout(1000);
  Logger.info('✓ Click en botón Filter');
});

When('el usuario abre el menú de Properties', async function (this: CustomWorld) {
  const propertiesBtn = this.page.locator('button[id^="headlessui-listbox-button"]:has-text("Properties")').first();
  await propertiesBtn.waitFor({ state: 'visible', timeout: 10000 });
  await propertiesBtn.click();
  await this.page.waitForTimeout(500);
  Logger.info('✓ Menú de Properties abierto');
});

When('el usuario selecciona la propiedad {string}', async function (this: CustomWorld, property: string) {
  const option = this.page.locator(`li[role="option"]:has-text("${property}")`).first();
  await option.waitFor({ state: 'visible', timeout: 10000 });
  await option.click();
  await this.page.waitForTimeout(500);
  Logger.info(`✓ Propiedad seleccionada: ${property}`);
});

When('el usuario abre el menú de Operator', async function (this: CustomWorld) {
  const operatorBtn = this.page.locator('button[id^="headlessui-listbox-button"]:has-text("Operator")').first();
  await operatorBtn.waitFor({ state: 'visible', timeout: 10000 });
  await operatorBtn.click();
  await this.page.waitForTimeout(500);
  Logger.info('✓ Menú de Operator abierto');
});

When('el usuario selecciona el operador {string}', async function (this: CustomWorld, operator: string) {
  const option = this.page.locator(`span:has-text("${operator}")`).first();
  await option.waitFor({ state: 'visible', timeout: 10000 });
  await option.scrollIntoViewIfNeeded();
  await option.click();
  await this.page.waitForTimeout(500);
  Logger.info(`✓ Operador seleccionado: ${operator}`);
});

When('el usuario ingresa el valor de filtro {string}', async function (this: CustomWorld, value: string) {
  const input = this.page.locator('input[data-testid="title"]').first();
  await input.waitFor({ state: 'visible', timeout: 10000 });
  await input.fill(value);
  await this.page.waitForTimeout(500);
  Logger.info(`✓ Valor de filtro ingresado: ${value}`);
});

When('el usuario hace clic en View Results', async function (this: CustomWorld) {
  const viewResultsBtn = this.page.locator('button[type="submit"]:has-text("View Results")').first();
  await viewResultsBtn.waitFor({ state: 'visible', timeout: 10000 });
  await viewResultsBtn.click();
  Logger.info('✓ Click en View Results');
});

// =============================================================================
// THEN Steps - Verificaciones
// =============================================================================

Then('la tabla de resultados debería mostrar miembros', async function (this: CustomWorld) {
  // Esperar que la tabla cargue con resultados
  await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  await this.page.waitForTimeout(3000);

  // Verificar que existen filas en la tabla (excluyendo el header)
  const rows = this.page.locator('table tbody tr, tr:has(td)');
  const rowCount = await rows.count();

  Logger.info(`📊 Filas encontradas en tabla: ${rowCount}`);
  expect(rowCount).toBeGreaterThan(0);
  Logger.info('✓ Tabla de resultados con miembros visible');
});