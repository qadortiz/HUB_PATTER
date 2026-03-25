# Patter Hub - Test Automation Framework

🚀 Framework de automatización E2E para Patter Hub usando **Playwright** + **Cucumber** + **TypeScript**

## 📋 Tabla de Contenido

- [Características](#características)
- [Pre-requisitos](#pre-requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejecución de Tests](#ejecución-de-tests)
- [Reportes](#reportes)
- [CI/CD](#cicd)
- [Mejores Prácticas](#mejores-prácticas)

## ✨ Características

- ✅ **Page Object Model (POM)** - Arquitectura escalable y mantenible
- ✅ **Cucumber/Gherkin** - Tests legibles en lenguaje natural (español)
- ✅ **TypeScript** - Type-safe con mejor autocompletado
- ✅ **Multi-browser** - Chromium, Firefox, WebKit
- ✅ **OTP Support** - Manejo automático de códigos OTP por email
- ✅ **Screenshots/Videos** - Captura automática en fallos
- ✅ **Logging** - Sistema de logs con Winston
- ✅ **CI/CD Ready** - Configurado para integración continua
- ✅ **Parallel Execution** - Ejecución paralela de tests

## 🔧 Pre-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- Acceso a cuenta de email para OTP (Gmail recomendado)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd patter-hub-automation

# Instalar dependencias
npm install

# Instalar browsers de Playwright
npx playwright install

# Verificar instalación
npx playwright --version
```

## ⚙️ Configuración

### 1. Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# ==========================================
# ADMIN - Login Simple (SIN OTP)
# ==========================================
ADMIN_EMAIL=admin@patter.com
ADMIN_PASSWORD=TuPasswordAdmin123!

# ==========================================
# SUPER ADMIN - Login con OTP (4 dígitos)
# ==========================================
SUPERADMIN_EMAIL=superadmin@patter.com
SUPERADMIN_PASSWORD=TuPasswordSuperAdmin123!

# Configuración Email para OTP (solo Super Admin)
EMAIL_SERVICE=gmail
EMAIL_USER=superadmin@patter.com
EMAIL_PASSWORD=tu-app-specific-password

# O usar Mock OTP para testing:
MOCK_OTP=1234
```

**IMPORTANTE**: 
- **Admin** = Login tradicional (email + password)
- **Super Admin** = Login + código OTP de 4 dígitos por email

📖 **Lee `AUTHENTICATION_FLOWS.md` para entender los dos flujos completos**

### 2. Configuración de Gmail para OTP

Para Super Admin, necesitas configurar Gmail para obtener códigos OTP automáticamente.

**📖 Lee `GMAIL_SETUP.md` para instrucciones paso a paso**

Resumen rápido:

1. **Habilitar 2FA en Gmail**:
   - https://myaccount.google.com/security

2. **Crear App Password**:
   - https://myaccount.google.com/apppasswords
   - Seleccionar "Correo" > "Otro (nombre personalizado)"
   - Copiar código de 16 caracteres

3. **Actualizar .env**:
   ```env
   EMAIL_PASSWORD=abcdefghijklmnop  # Sin espacios
   ```

4. **Probar configuración**:
   ```bash
   npm run test:email
   ```

**IMPORTANTE**: 
- Admin **NO** requiere configuración de email (funciona de inmediato)
- Super Admin **SÍ** requiere configuración de email (para obtener OTP)

📖 **Lee `AUTHENTICATION_FLOWS.md` para entender los dos flujos completos**

## 📁 Estructura del Proyecto

```
patter-hub-automation/
├── src/
│   ├── pages/                    # Page Object Models
│   │   ├── BasePage.ts           # Clase base con métodos reutilizables
│   │   ├── LoginPage.ts          # POM para login
│   │   └── DashboardPage.ts      # POM para dashboard
│   ├── support/                  
│   │   ├── hooks.ts              # Cucumber hooks (Before/After)
│   │   ├── world.ts              # CustomWorld - contexto compartido
│   │   └── helpers/
│   │       └── EmailHelper.ts    # Helper para obtener OTP
│   ├── config/
│   │   └── environments.ts       # Configuración de ambientes
│   └── utils/
│       └── Logger.ts             # Sistema de logging
├── features/                     # Archivos Gherkin
│   ├── login.feature             # Feature de Login
│   └── step_definitions/
│       └── login.steps.ts        # Implementación de steps
├── reports/                      # Reportes generados
├── screenshots/                  # Screenshots de fallos
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Template de variables
├── cucumber.js                   # Configuración de Cucumber
├── playwright.config.ts          # Configuración de Playwright
└── package.json
```

## 🚀 Ejecución de Tests

### Todos los tests

```bash
npm test
```

### Tests específicos por tags

```bash
# Solo tests de Admin
npm run test:admin

# Solo tests de Super Admin
npm run test:superadmin

# Solo Smoke tests
npm run test:smoke

# Tests en modo headed (visible)
npm run test:headed
```

### Tests específicos por escenario

```bash
# Ejecutar un feature específico
npx cucumber-js features/login.feature

# Ejecutar con un tag específico
npx cucumber-js --tags "@PT-LOGIN-001"
```

### Ejecutar en CI/CD

```bash
npm run test:ci
```

## 📊 Reportes

Los reportes se generan automáticamente en `reports/`:

- **HTML Report**: `reports/cucumber-report.html`
- **JSON Report**: `reports/cucumber-report.json`
- **JUnit XML**: `reports/cucumber-report.xml`

### Ver reporte HTML

```bash
# Abrir reporte en el navegador
open reports/cucumber-report.html  # macOS
xdg-open reports/cucumber-report.html  # Linux
start reports/cucumber-report.html  # Windows
```

## 🔄 CI/CD

### GitHub Actions

Ejemplo de workflow (`.github/workflows/tests.yml`):

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run tests
        run: npm run test:ci
        env:
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
          
      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            reports/
            screenshots/
```

## 📝 Mejores Prácticas

### 1. Escribir Tests Mantenibles

```gherkin
# ✅ BIEN - Descriptivo y legible
Escenario: Login exitoso como Admin
  Dado que el usuario tiene credenciales de "admin"
  Cuando el usuario ingresa sus credenciales de admin
  Entonces el usuario debería ser redirigido al dashboard

# ❌ MAL - Demasiado técnico
Escenario: Test 001
  Dado que voy a "/login"
  Cuando lleno "#email" con "admin@test.com"
```

### 2. Usar Tags Apropiadamente

```gherkin
@smoke @critical @PT-LOGIN-001
Escenario: Login exitoso como Admin
```

- `@smoke`: Tests críticos que deben pasar siempre
- `@critical`: Funcionalidad crítica del negocio
- `@wip`: Work in progress (tests en desarrollo)
- `@PT-XXX-YYY`: ID del ticket en Jira

### 3. Page Object Pattern

```typescript
// ✅ BIEN - Usar Page Objects
await this.loginPage.loginAsAdmin(email, password);

// ❌ MAL - Acceso directo a elementos
await this.page.locator('#email').fill(email);
```

### 4. Esperas Inteligentes

```typescript
// ✅ BIEN - Esperar elemento
await this.waitForElement(this.loginButton);

// ❌ MAL - Esperas fijas
await this.wait(5000);
```

## 🐛 Debugging

### Ver tests en modo headed

```bash
HEADED=true npm test
```

### Ver paso a paso (slow-mo)

Editar `playwright.config.ts`:

```typescript
use: {
  launchOptions: {
    slowMo: 1000  // 1 segundo entre acciones
  }
}
```

### Screenshots y videos

Los screenshots se guardan automáticamente en fallos.
Para habilitar videos en todos los tests:

```typescript
use: {
  video: 'on'  // 'on' | 'off' | 'retain-on-failure'
}
```

## 🤝 Contribuir

1. Crear branch: `git checkout -b feature/PT-XXX-nueva-funcionalidad`
2. Hacer commits: `git commit -m "feat: agregar tests para PT-XXX"`
3. Push: `git push origin feature/PT-XXX-nueva-funcionalidad`
4. Crear Pull Request

## 📞 Soporte

- **QA Lead**: Daniel Ortiz
- **Email**: dortiz@houseedge.ai
- **Jira**: [Link al proyecto]

## 📄 Licencia

Propiedad de House Edge AI - Uso interno

---

**Creado por**: Daniel Ortiz - Senior QA Engineer  
**Última actualización**: Febrero 2026
