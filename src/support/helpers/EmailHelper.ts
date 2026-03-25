import { Logger } from '../../utils/Logger';

/**
 * EmailHelper - Maneja la obtención de códigos OTP desde Mailinator
 * Mailinator es un servicio gratuito de email temporal perfecto para testing
 */
export class EmailHelper {
  private static readonly OTP_WAIT_TIMEOUT = parseInt(process.env.OTP_WAIT_TIMEOUT || '60000');
  private static readonly OTP_CHECK_INTERVAL = 3000;
  private static readonly OTP_MAX_RETRIES = parseInt(process.env.OTP_MAX_RETRIES || '20');
  private static readonly MAILINATOR_API_URL = 'https://www.mailinator.com/api/v2';

  /**
   * Obtiene el código OTP del email más reciente
   */
  public static async getOTPFromEmail(
    recipientEmail: string,
    timeout: number = this.OTP_WAIT_TIMEOUT
  ): Promise<string> {
    Logger.info(`🔍 Buscando código OTP en Mailinator para: ${recipientEmail}`);
    
    const inboxName = recipientEmail.split('@')[0];
    const startTime = Date.now();
    let attempts = 0;

    while (Date.now() - startTime < timeout && attempts < this.OTP_MAX_RETRIES) {
      attempts++;
      Logger.debug(`Intento ${attempts}/${this.OTP_MAX_RETRIES}`);

      try {
        const otpCode = await this.fetchLatestOTPFromMailinator(inboxName);
        
        if (otpCode) {
          Logger.info(`✅ Código OTP encontrado: ${otpCode}`);
          return otpCode;
        }

        Logger.debug(`⏱️  Esperando ${this.OTP_CHECK_INTERVAL}ms antes del siguiente intento...`);
        await this.sleep(this.OTP_CHECK_INTERVAL);
        
      } catch (error) {
        Logger.warn(`Error en intento ${attempts}: ${error}`);
        await this.sleep(this.OTP_CHECK_INTERVAL);
      }
    }

    throw new Error(`❌ No se encontró código OTP después de ${attempts} intentos en ${timeout}ms`);
  }

  /**
   * Obtiene el último OTP desde Mailinator usando su API pública
   */
  private static async fetchLatestOTPFromMailinator(inboxName: string): Promise<string | null> {
    try {
      const inboxUrl = `${this.MAILINATOR_API_URL}/domains/public/inboxes/${inboxName}`;
      
      Logger.debug(`📧 Consultando inbox de Mailinator: ${inboxName}`);
      Logger.info(`🌐 URL completa: ${inboxUrl}`);

      const response = await fetch(inboxUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        Logger.debug(`Inbox response: ${response.status}`);
        return null;
      }

     const data: any = await response.json();
      
      Logger.info(`📬 Total de mensajes en inbox: ${data.msgs?.length || 0}`);
      
      if (!data.msgs || data.msgs.length === 0) {
        Logger.info('⚠️  No hay mensajes en el inbox');
        return null;
      }
      
      // Mostrar todos los mensajes
      for (const msg of data.msgs) {
        Logger.info(`  📧 Mensaje ID: ${msg.id}, Subject: ${msg.subject || 'N/A'}, From: ${msg.from || 'N/A'}`);
      }

      // Buscar el email más reciente de Patter
      const sortedMsgs = [...data.msgs].reverse();
        for (const msg of sortedMsgs)  {
        const messageUrl = `${this.MAILINATOR_API_URL}/domains/public/inboxes/${inboxName}/messages/${msg.id}`;
        
        const msgResponse = await fetch(messageUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (!msgResponse.ok) continue;

        const msgData: any = await msgResponse.json();
        const emailBody = msgData.parts?.[0]?.body || '';
        
        Logger.debug(`Email subject: ${msgData.subject || 'N/A'}`);
        Logger.debug(`Email from: ${msgData.from || 'N/A'}`);

        const fromEmail = msgData.from?.toLowerCase() || '';
const subject = msgData.subject?.toLowerCase() || '';

// Detectar emails de OTP de múltiples fuentes
if (fromEmail.includes('patter') || 
    fromEmail.includes('unionstrong') || 
    fromEmail.includes('support@') ||
    subject.includes('otp') || 
    subject.includes('security') || 
    subject.includes('validation') ||
    subject.includes('code')) {
          const otp = this.extractOTPFromEmailBody(emailBody);
          if (otp) {
            Logger.info(`✅ OTP encontrado en email de: ${msgData.from}`);
            return otp;
          }
        }
      }

      Logger.debug('No se encontró email con OTP de Patter');
      return null;

    } catch (error) {
      Logger.error('Error consultando Mailinator:', error);
      return null;
    }
  }

  /**
   * Extrae el código OTP de 4 dígitos del contenido del email
   */
  public static extractOTPFromEmailBody(emailBody: string): string | null {
    // PRIMERO: Intentar extraer directamente de los spans con los dígitos
    const spanPattern = /<span[^>]*>(\d)<\/span>/g;
    const digits: string[] = [];
    let match;
    
    while ((match = spanPattern.exec(emailBody)) !== null) {
      digits.push(match[1]);
      if (digits.length === 4) {
        const otp = digits.join('');
        Logger.info(`✅ OTP extraído de spans HTML: ${otp}`);
        return otp;
      }
    }
    
    // SEGUNDO: Limpiar HTML y buscar con patrones
    const cleanBody = emailBody
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    Logger.debug(`Buscando OTP en texto limpio: ${cleanBody.substring(0, 300)}...`);

    const otpPatterns = [
      /(?:code|código|verification|verificación)[:\s]*(\d{4})/i,
      /(?:OTP|otp)[:\s]*(\d{4})/i,
      /(?:security|seguridad)[:\s]+(?:code|código)[:\s]*(\d{4})/i,
      /your\s+code\s+is[:\s]*(\d{4})/i,
      /(\d)\s+(\d)\s+(\d)\s+(\d)/,  // Dígitos separados por espacios
      /\b(\d{4})\b/
    ];

    for (const pattern of otpPatterns) {
      const match = cleanBody.match(pattern);
      if (match) {
        let code;
        if (match.length === 5) {
          // Pattern con 4 grupos de captura (dígitos separados)
          code = match[1] + match[2] + match[3] + match[4];
        } else {
          code = match[1];
        }
        
        if (/^\d{4}$/.test(code)) {
          Logger.info(`✅ OTP encontrado con patrón: ${pattern}`);
          return code;
        }
      }
    }

    Logger.warn('❌ No se encontró OTP en el email');
    return null;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static validateEmailConfig(): boolean {
    Logger.info('✅ Mailinator no requiere configuración especial');
    Logger.info('💡 Solo asegúrate de usar un email @mailinator.com');
    return true;
  }

  public static generateMailinatorEmail(): string {
    const randomString = Math.random().toString(36).substring(2, 12);
    const email = `patter-test-${randomString}@mailinator.com`;
    Logger.info(`📧 Email generado: ${email}`);
    return email;
  }

  /**
   * Obtiene el link de reset password del email más reciente
   */
  public static async getResetPasswordLinkFromEmail(
    recipientEmail: string,
    timeout: number = this.OTP_WAIT_TIMEOUT
  ): Promise<string> {
    Logger.info(`🔍 Buscando link de reset password en Mailinator para: ${recipientEmail}`);
    
    const inboxName = recipientEmail.split('@')[0];
    const startTime = Date.now();
    let attempts = 0;

    while (Date.now() - startTime < timeout && attempts < this.OTP_MAX_RETRIES) {
      attempts++;
      Logger.debug(`Intento ${attempts}/${this.OTP_MAX_RETRIES}`);

      try {
        const resetLink = await this.fetchResetPasswordLinkFromMailinator(inboxName);
        
        if (resetLink) {
          Logger.info(`✅ Link de reset password encontrado`);
          return resetLink;
        }

        Logger.debug(`⏱️  Esperando ${this.OTP_CHECK_INTERVAL}ms antes del siguiente intento...`);
        await this.sleep(this.OTP_CHECK_INTERVAL);
        
      } catch (error) {
        Logger.warn(`Error en intento ${attempts}: ${error}`);
        await this.sleep(this.OTP_CHECK_INTERVAL);
      }
    }

    throw new Error(`❌ No se encontró link de reset password después de ${attempts} intentos`);
  }

  /**
   * Obtiene el link de reset desde Mailinator
   */
  private static async fetchResetPasswordLinkFromMailinator(inboxName: string): Promise<string | null> {
    try {
      const inboxUrl = `${this.MAILINATOR_API_URL}/domains/public/inboxes/${inboxName}`;
      
      const response = await fetch(inboxUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) return null;

      const data: any = await response.json();
      
      if (!data.msgs || data.msgs.length === 0) return null;

      // Buscar email de reset password
      for (const msg of data.msgs) {
        const messageUrl = `${this.MAILINATOR_API_URL}/domains/public/inboxes/${inboxName}/messages/${msg.id}`;
        
        const msgResponse = await fetch(messageUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (!msgResponse.ok) continue;

        const msgData: any = await msgResponse.json();
        const emailBody = msgData.parts?.[0]?.body || '';
        
        const subject = msgData.subject?.toLowerCase() || '';

        // Detectar emails de reset password
        if (subject.includes('reset') || subject.includes('password')) {
          const resetLink = this.extractResetLinkFromEmailBody(emailBody);
          if (resetLink) {
            Logger.info(`✅ Reset link encontrado en email`);
            return resetLink;
          }
        }
      }

      return null;

    } catch (error) {
      Logger.error('Error consultando Mailinator:', error);
      return null;
    }
  }

  /**
   * Extrae el link de reset del HTML del email
   * Busca: href="https://hub.patter.com/resetPassword/{token}"
   */
  public static extractResetLinkFromEmailBody(emailBody: string): string | null {
   const resetLinkPattern = /href="(https:\/\/hub(?:\.canada)?\.patter\.com\/resetPassword\/[^"]+)"/i;
    
    const match = emailBody.match(resetLinkPattern);
    if (match && match[1]) {
      Logger.info(`✅ Link de reset extraído`);
      return match[1];
    }

    Logger.warn('❌ No se encontró link de reset en el email');
    return null;
  }
}
