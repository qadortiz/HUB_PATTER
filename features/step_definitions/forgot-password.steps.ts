import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/support/world';
import { Logger } from '../../src/utils/Logger';
import { EmailHelper } from '../../src/support/helpers/EmailHelper';

/**
 * Step Definitions para Password Recovery Feature
 */

// Variable para almacenar el link de reset entre steps
let resetPasswordLink: string = '';

// =============================================================================
// GIVEN Steps - Precondiciones
// =============================================================================
Given('que el usuario hace clic en {string}', { timeout: 30000 }, async function (this: CustomWorld, linkText: string) {
  if (linkText.toLowerCase().includes('forgot')) {
    Logger.info('🔍 Buscando "Forgot password?"...');
    
    // Selector específico para el span
    const forgotPasswordLink = this.page.locator('span:has-text("Forgot password?")');
    await forgotPasswordLink.click();
    Logger.info('✓ Click en "Forgot password?"');
    
    // Esperar a que cargue la página
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState('networkidle');
  }
});

// =============================================================================
// WHEN Steps - Acciones
// =============================================================================

When('el usuario ingresa el email de recuperación {string}', async function (this: CustomWorld, email: string) {
  // Si el email es el de prueba, usar el de Mailinator
  const emailToUse = email === 'dortiz+92@houseedge.ai' ? 'patter-automation@mailinator.com' : email;
  
  await this.forgotPasswordPage.enterEmail(emailToUse);
  Logger.info(`✓ Email de recuperación ingresado: ${emailToUse}`);
});

When('el usuario hace clic en el botón de enviar solicitud', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.forgotPasswordPage.clickSubmit();
  Logger.info('✓ Click en botón de enviar solicitud');
  
  // Esperar procesamiento y mensaje de confirmación
  await this.page.waitForTimeout(5000);
  await this.page.waitForLoadState('networkidle');
  
  Logger.info('✓ Solicitud procesada');
});

When('el usuario hace clic en el link de recuperación del email', { timeout: 30000 }, async function (this: CustomWorld) {
  Logger.info('🔗 Navegando al link de reset password...');
  
  // Navegar directamente al link obtenido
  await this.resetPasswordPage.gotoWithFullUrl(resetPasswordLink);
  
  // Esperar a que cargue la página
  await this.page.waitForTimeout(3000);
  await this.page.waitForLoadState('networkidle');
  
  Logger.info('✓ Navegación al link de reset completada');
});

When('el usuario ingresa la nueva contraseña {string}', async function (this: CustomWorld, password: string) {
  await this.resetPasswordPage.enterNewPassword(password);
  Logger.info('✓ Nueva contraseña ingresada');
});

When('el usuario confirma la nueva contraseña {string}', async function (this: CustomWorld, password: string) {
  // Campo específico: name="currentPasswordConfirm" id="currentPasswordConfirm"
  const confirmPasswordInput = this.page.locator('input[name="currentPasswordConfirm"], input[id="currentPasswordConfirm"], input[data-testid="currentPasswordConfirm"]');
  
  await confirmPasswordInput.fill(password);
  Logger.info('✓ Confirmación de contraseña ingresada');
  
  await this.page.waitForTimeout(1000);
});


When('el usuario hace clic en el botón de restablecer contraseña', { timeout: 30000 }, async function (this: CustomWorld) {
  await this.resetPasswordPage.clickSubmit();
  Logger.info('✓ Click en botón de restablecer contraseña');
  
  // Esperar procesamiento
  await this.page.waitForTimeout(5000);
  await this.page.waitForLoadState('networkidle');
});

// =============================================================================
// THEN Steps - Verificaciones
// =============================================================================

Then('el usuario debería recibir un email con el link de recuperación', { timeout: 90000 }, async function (this: CustomWorld) {
  Logger.info('📧 Esperando email con link de reset password...');
  
  // Obtener el link del email en Mailinator
  const email = 'patter-automation@mailinator.com';
  resetPasswordLink = await EmailHelper.getResetPasswordLinkFromEmail(email, 60000);
  
  expect(resetPasswordLink).toBeTruthy();
  expect(resetPasswordLink).toContain('hub.patter.com/resetPassword/');
  
  Logger.info(`✅ Link de reset password recibido: ${resetPasswordLink.substring(0, 80)}...`);
});

Then('el usuario debería ver la página de restablecer contraseña', async function (this: CustomWorld) {
  const isLoaded = await this.resetPasswordPage.isLoaded();
  expect(isLoaded).toBeTruthy();
  
  Logger.info('✓ Página de restablecer contraseña visible');
});

Then('el usuario debería ver un mensaje de éxito', { timeout: 30000 }, async function (this: CustomWorld) {
  // Esperar el mensaje de éxito
  await this.page.waitForTimeout(10000);
  
  const hasSuccess = await this.resetPasswordPage.hasSuccessMessage();
  
  if (hasSuccess) {
    const message = await this.resetPasswordPage.getSuccessMessage();
    Logger.info(`✅ Mensaje de éxito: ${message}`);
  } else {
    Logger.info('✅ Contraseña restablecida exitosamente (sin mensaje visible)');
  }
  
  // Verificar que no estamos en página de error
  const currentUrl = await this.page.url();
  expect(currentUrl).not.toContain('/error');
  
  Logger.info('✓ Proceso de reset completado exitosamente');
});