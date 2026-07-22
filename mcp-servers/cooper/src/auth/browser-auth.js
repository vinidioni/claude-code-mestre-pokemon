/**
 * Autenticação via navegador visível
 * Abre o Chrome para o usuário fazer login manualmente
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COOKIES_PATH = path.join(__dirname, '../../.cookies.json');
const STORAGE_PATH = path.join(__dirname, '../../.storage-state.json');

export class BrowserAuth {
  constructor() {
    this.context = null;
    this.browser = null;
    this.page = null;
  }

  /**
   * Verifica se tem cookies válidos salvos
   */
  hasValidSession() {
    if (!fs.existsSync(STORAGE_PATH)) {
      return false;
    }
    try {
      const stats = fs.statSync(STORAGE_PATH);
      const ageMs = Date.now() - stats.mtime.getTime();
      const ageHours = ageMs / (1000 * 60 * 60);
      // Considera válido se tiver menos de 24 horas
      return ageHours < 24;
    } catch {
      return false;
    }
  }

  /**
   * Carrega storage state se existir
   */
  async loadSession() {
    if (fs.existsSync(STORAGE_PATH)) {
      try {
        return JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Salva storage state
   */
  async saveSession() {
    if (this.context) {
      const storage = await this.context.storageState();
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(storage, null, 2));
    }
  }

  /**
   * Abre navegador visível para login manual
   */
  async authenticate() {
    console.log('🌐 Abrindo navegador para autenticação...');
    console.log('   Por favor, faça login na sua conta Didi.');
    console.log('   O sistema detectará quando você estiver logado.\n');

    this.browser = await chromium.launch({
      headless: false,
      args: ['--window-size=1280,900']
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 900 }
    });

    this.page = await this.context.newPage();

    // Navega para o Cooper - vai redirecionar para login
    await this.page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda o usuário fazer login
    // Detecta quando saiu da página de login
    console.log('⏳ Aguardando login... (timeout: 5 minutos)');

    try {
      // Aguarda até que a URL mude para algo que não seja a página de login
      await this.page.waitForFunction(() => {
        const url = window.location.href;
        return !url.includes('login') &&
               !url.includes('stargate-auth') &&
               !url.includes('me.xiaojukeji.com');
      }, { timeout: 300000 }); // 5 minutos

      console.log('✅ Login detectado!');

      // Aguarda mais um pouco para a página carregar completamente
      await this.page.waitForLoadState('networkidle');
      await new Promise(r => setTimeout(r, 3000));

      // Salva a sessão
      await this.saveSession();
      console.log('💾 Sessão salva para reutilização\n');

      return {
        browser: this.browser,
        context: this.context,
        page: this.page,
        isNewAuth: true
      };
    } catch (error) {
      await this.browser.close();
      throw new Error('Timeout aguardando login. Por favor, tente novamente.');
    }
  }

  /**
   * Obtém sessão autenticada (existente ou nova)
   */
  async getAuthenticatedSession() {
    // Tenta usar sessão existente
    if (this.hasValidSession()) {
      console.log('🔄 Usando sessão existente...');

      this.browser = await chromium.launch({
        headless: true // Pode usar headless se já tem sessão
      });

      const storageState = await this.loadSession();
      this.context = await this.browser.newContext({ storageState });
      this.page = await this.context.newPage();

      // Verifica se a sessão ainda é válida
      await this.page.goto('https://cooper.didichuxing.com', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      const currentUrl = this.page.url();
      if (currentUrl.includes('login') || currentUrl.includes('stargate-auth')) {
        console.log('⚠️  Sessão expirada. Autenticando novamente...\n');
        await this.browser.close();
        return this.authenticate();
      }

      console.log('✅ Sessão válida!\n');
      return {
        browser: this.browser,
        context: this.context,
        page: this.page,
        isNewAuth: false
      };
    }

    // Faz autenticação nova
    return this.authenticate();
  }

  /**
   * Fecha o navegador
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }
}
