import * as dotenv from 'dotenv';

dotenv.config();

export interface Environment {
  baseUrl: string;
  adminEmail: string;
  adminPassword: string;
  superAdminEmail: string;
  superAdminPassword: string;
  timeout: number;
  targetOrg: string;
}

export const environments: Record<string, Environment> = {
  production: {
    baseUrl: process.env.BASE_URL || 'https://hub.patter.com',
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    superAdminEmail: process.env.SUPERADMIN_EMAIL || '',
    superAdminPassword: process.env.SUPERADMIN_PASSWORD || '',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    targetOrg: process.env.TARGET_ORG || 'Giving Hope Foundation',
  },
  staging: {
    baseUrl: process.env.STAGING_URL || 'https://staging-hub.patter.com',
    adminEmail: process.env.STAGING_ADMIN_EMAIL || '',
    adminPassword: process.env.STAGING_ADMIN_PASSWORD || '',
    superAdminEmail: process.env.STAGING_SUPERADMIN_EMAIL || '',
    superAdminPassword: process.env.STAGING_SUPERADMIN_PASSWORD || '',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    targetOrg: process.env.TARGET_ORG || 'Giving Hope Foundation',
  },
  uat: {
    baseUrl: process.env.UAT_URL || 'https://uat-hub.patter.com',
    adminEmail: process.env.UAT_ADMIN_EMAIL || '',
    adminPassword: process.env.UAT_ADMIN_PASSWORD || '',
    superAdminEmail: process.env.UAT_SUPERADMIN_EMAIL || '',
    superAdminPassword: process.env.UAT_SUPERADMIN_PASSWORD || '',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    targetOrg: process.env.TARGET_ORG || 'Giving Hope Foundation',
  },
  canada: {
    baseUrl: process.env.CANADA_URL || 'https://hub.canada.patter.com',
    adminEmail: process.env.CANADA_ADMIN_EMAIL || '',
    adminPassword: process.env.CANADA_ADMIN_PASSWORD || '',
    superAdminEmail: process.env.CANADA_SUPERADMIN_EMAIL || '',
    superAdminPassword: process.env.CANADA_SUPERADMIN_PASSWORD || '',
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    targetOrg: process.env.CANADA_TARGET_ORG || 'BCTF Strong - DEMO',
  },
};

export const getEnvironment = (): Environment => {
  const env = process.env.NODE_ENV || 'production';
  return environments[env] || environments.production;
};

export const config = {
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    imapHost: process.env.EMAIL_IMAP_HOST || 'imap.gmail.com',
    imapPort: parseInt(process.env.EMAIL_IMAP_PORT || '993', 10),
    tls: process.env.EMAIL_TLS !== 'false',
  },
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID || '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
  },
  otp: {
    sender: process.env.OTP_SENDER || 'noreply@patter.com',
    subject: process.env.OTP_SUBJECT || 'Security validation',
    waitTimeout: parseInt(process.env.OTP_WAIT_TIMEOUT || '60000', 10),
    maxRetries: parseInt(process.env.OTP_MAX_RETRIES || '5', 10),
  },
  screenshots: {
    enabled: process.env.SCREENSHOT_ON_FAILURE === 'true',
    path: process.env.SCREENSHOT_PATH || './screenshots',
  },
  retry: {
    count: parseInt(process.env.RETRY_COUNT || '2', 10),
  },
};