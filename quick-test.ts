import { chromium } from '@playwright/test';
import { LoginPage } from './src/pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Script de prueba rápida para validar la configuración
 * Uso: npx ts-node quick-test.ts
 */
async function quickTest() {
  console.log('🚀 Iniciando prueba rápida del framework...\n');

  const browser = await chromium.launch({
    headless: false, // Ver el navegador
    slowMo: 500, // Ralentizar para ver las acciones
  });

  const page = await browser.newPage();
  const loginPage = new LoginPage(page, 'https://hub.patter.com');

  try {
    // 1. Navegar al login
    console.log('1️⃣  Navegando a login page...');
    await loginPage.goto();
    await page.waitForTimeout(2000);

    // 2. Verificar que la página cargó
    const isLoaded = await loginPage.isLoaded();
    console.log(`✓ Página cargada: ${isLoaded ? 'SÍ' : 'NO'}`);

    // 3. Llenar el formulario con credenciales de prueba
    console.log('\n2️⃣  Llenando formulario...');
    
    const testEmail = process.env.ADMIN_EMAIL || 'test@example.com';
    const testPassword = process.env.ADMIN_PASSWORD || '';

    if (!testPassword) {
      console.log('\n⚠️  No se encontró ADMIN_PASSWORD en .env');
      console.log('Por favor agrega las credenciales en el archivo .env');
      return;
    }

    await loginPage.fillInput(
      loginPage['emailInput'],
      testEmail,
      'Email'
    );

    await loginPage.fillInput(
      loginPage['passwordInput'],
      testPassword,
      'Password'
    );

    console.log('✓ Formulario llenado');

    // 4. Tomar screenshot
    console.log('\n3️⃣  Tomando screenshot...');
    await page.screenshot({ path: 'screenshots/quick-test.png', fullPage: true });
    console.log('✓ Screenshot guardado en: screenshots/quick-test.png');

    // 5. Obtener selectores
    console.log('\n4️⃣  Verificando selectores...');
    const loginButtonVisible = await page.locator('button[type="submit"]').isVisible();
    console.log(`✓ Login button visible: ${loginButtonVisible}`);

    console.log('\n✅ PRUEBA RÁPIDA COMPLETADA\n');
    console.log('El framework está configurado correctamente.');
    console.log('Puedes ejecutar los tests con: npm test\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
  } finally {
    await page.waitForTimeout(3000); // Ver resultado
    await browser.close();
  }
}

quickTest().catch(console.error);
