import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';

/**
 * Hooks de Cucumber - ORDEN CORREGIDO
 */

BeforeAll(async function () {
  Logger.info('='.repeat(80));
  Logger.info('INICIANDO SUITE DE PRUEBAS - PATTER HUB AUTOMATION');
  Logger.info('='.repeat(80));
  
  const dirs = ['screenshots', 'reports', 'videos'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      Logger.info(`Directorio creado: ${dir}`);
    }
  });
});

// CRÍTICO: Este hook DEBE ir PRIMERO (sin tags)
// Se ejecuta para TODOS los escenarios antes que los hooks específicos
Before(async function (this: CustomWorld, { pickle }) {
  console.log('🔵 HOOK Before ejecutándose...');
  console.log('🔵 this:', this);
  console.log('🔵 this.init:', this.init);
  
  Logger.info('-'.repeat(80));
  Logger.info(`ESCENARIO: ${pickle.name}`);
  Logger.info(`Tags: ${pickle.tags.map(tag => tag.name).join(', ')}`);
  Logger.info('-'.repeat(80));
  
  if (typeof this.init === 'function') {
    console.log('✅ this.init es una función, llamándola...');
    await this.init();
  } else {
    console.log('❌ ERROR: this.init NO es una función');
    console.log('❌ Tipo de this.init:', typeof this.init);
  }
});

// Hooks específicos van DESPUÉS (se ejecutan DESPUÉS de la inicialización)
Before({ tags: '@smoke' }, async function (this: CustomWorld) {
  Logger.info('🔥 Ejecutando Smoke Test');
});

Before({ tags: '@wip' }, async function (this: CustomWorld) {
  Logger.warn('⚠️  Ejecutando Work In Progress - Puede ser inestable');
});

After(async function (this: CustomWorld, { pickle, result }) {
  const scenarioName = pickle.name.replace(/\s+/g, '_').replace(/[:"]/g, '');
  
  if (result && result.status === Status.FAILED) {
    Logger.error(`ESCENARIO FALLIDO: ${pickle.name}`);
    
    const screenshotName = `FAILED_${scenarioName}`;
    const screenshot = await this.captureScreenshot(screenshotName);
    
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
    
    if (result.message) {
      this.attach(`Error: ${result.message}`, 'text/plain');
    }
  } else if (result && result.status === Status.PASSED) {
    Logger.info(`✓ ESCENARIO EXITOSO: ${pickle.name}`);
  }
  
  await this.destroy();
  Logger.info('-'.repeat(80));
});

After({ tags: '@cleanup' }, async function (this: CustomWorld) {
  Logger.info('🧹 Ejecutando cleanup de datos del test');
});

AfterAll(async function () {
  Logger.info('='.repeat(80));
  Logger.info('SUITE DE PRUEBAS FINALIZADA');
  Logger.info('='.repeat(80));
});