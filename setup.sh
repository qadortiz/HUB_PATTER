#!/bin/bash

# Script de instalación y setup para Patter Hub Automation
# Autor: Daniel Ortiz - QA Engineer

set -e  # Exit on error

echo "================================================"
echo "  PATTER HUB AUTOMATION - SETUP SCRIPT"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js >= 18.x desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION es muy antigua${NC}"
    echo "Se requiere Node.js >= 18.x"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) encontrado${NC}"

# Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v) encontrado${NC}"

# Instalar dependencias
echo ""
echo "📥 Instalando dependencias..."
npm install

# Instalar browsers de Playwright
echo ""
echo "🌐 Instalando navegadores de Playwright..."
npx playwright install
npx playwright install-deps

# Crear directorios necesarios
echo ""
echo "📁 Creando directorios de trabajo..."
mkdir -p screenshots
mkdir -p reports
mkdir -p videos
echo -e "${GREEN}✓ Directorios creados${NC}"

# Verificar archivo .env
echo ""
echo "⚙️  Verificando configuración..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    echo "Copiando .env.example a .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Por favor edita .env con tus credenciales${NC}"
else
    echo -e "${GREEN}✓ Archivo .env encontrado${NC}"
fi

# Verificar TypeScript compilation
echo ""
echo "🔨 Verificando compilación TypeScript..."
npx tsc --noEmit
echo -e "${GREEN}✓ TypeScript compilado correctamente${NC}"

# Resumen final
echo ""
echo "================================================"
echo -e "${GREEN}✅ INSTALACIÓN COMPLETADA${NC}"
echo "================================================"
echo ""
echo "📝 Próximos pasos:"
echo "1. Editar .env con tus credenciales"
echo "2. Ejecutar tests: npm test"
echo "3. Ver tests en navegador: npm run test:headed"
echo ""
echo "📚 Comandos útiles:"
echo "  npm test              - Ejecutar todos los tests"
echo "  npm run test:admin    - Solo tests de Admin"
echo "  npm run test:smoke    - Solo tests críticos"
echo "  npm run test:headed   - Ver tests en navegador"
echo ""
echo "================================================"
