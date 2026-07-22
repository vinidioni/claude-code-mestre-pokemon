/**
 * Cliente para interagir com a plataforma Cooper
 * Usa Playwright para fazer scraping das páginas
 */
export class CooperClient {
  constructor(page) {
    this.page = page;
  }

  /**
   * Obtém conteúdo de um documento pelo ID/URL
   */
  async getDocument(docIdOrUrl) {
    // Extrai ID da URL se necessário
    const docId = this.extractDocId(docIdOrUrl);
    const url = `https://cooper.didichuxing.com/docs2/document/${docId}`;

    console.log(`📄 Acessando documento: ${docId}`);

    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda carregamento
    console.log('   ⏳ Aguardando carregamento...');
    await new Promise(r => setTimeout(r, 5000));

    // Verifica se há redirecionamento e aguarda estabilizar
    let lastUrl = this.page.url();
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const currentUrl = this.page.url();
      if (currentUrl === lastUrl) break;
      lastUrl = currentUrl;
    }

    // Aguarda o loading desaparecer
    try {
      await this.page.waitForSelector('.doc-loading', { state: 'hidden', timeout: 20000 });
    } catch {
      // Continua
    }

    await new Promise(r => setTimeout(r, 5000));
    console.log('   ✓ Carregado!');

    // Tenta acessar iframe se houver (Shimo/Cooper carrega em iframe)
    let iframeContent = '';
    try {
      const iframes = await this.page.locator('iframe').count();
      if (iframes > 0) {
        console.log(`   🖼️  Detectado ${iframes} iframe(s), tentando acessar...`);
        // Aguarda iframe carregar
        await new Promise(r => setTimeout(r, 10000));

        // Usa frameLocator para acessar o iframe
        const frame = this.page.frameLocator('iframe').first();
        try {
          iframeContent = await frame.locator('body').innerText({ timeout: 10000 });
          if (iframeContent.length > 100) {
            console.log(`   ✓ Conteúdo do iframe: ${iframeContent.length} caracteres`);
          }
        } catch (frameError) {
          // Tenta método alternativo via evaluate
          iframeContent = await this.page.evaluate(() => {
            try {
              const iframe = document.querySelector('iframe');
              if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
                return iframe.contentDocument.body.innerText || '';
              }
            } catch (e) {
              // Cross-origin restriction
            }
            return '';
          });
          if (iframeContent.length > 100) {
            console.log(`   ✓ Conteúdo via evaluate: ${iframeContent.length} caracteres`);
          } else {
            console.log('   ⚠️ Iframe com restrição de cross-origin');
          }
        }
      }
    } catch (e) {
      console.log('   ⚠️ Não foi possível acessar iframe:', e.message);
    }

    // Extrai conteúdo
    const doc = await this.page.evaluate((iframeContentFromParent) => {
      // Título - tenta vários seletores
      const titleEl = document.querySelector('.docs-title') ||
                     document.querySelector('h1') ||
                     document.querySelector('[class*="title"]');
      const title = titleEl?.innerText?.trim() || document.title || 'Sem título';

      // Conteúdo - prioriza iframe se disponível
      let content = iframeContentFromParent;

      // Se não tem iframe, tenta extrair da página
      if (!content || content.length < 200) {
        const contentSelectors = [
          '#content',
          '.doc-content',
          '.document-body',
          '.editor-content',
          '[class*="viewer"]',
          'article',
          'main'
        ];

        let contentEl = null;
        for (const selector of contentSelectors) {
          const el = document.querySelector(selector);
          if (el && el.innerText.length > 200) {
            contentEl = el;
            break;
          }
        }
        content = contentEl ? contentEl.innerText : document.body.innerText;
      }

      // Metadados
      const author = document.querySelector('[class*="author"], .doc-author')?.innerText?.trim();
      const date = document.querySelector('[class*="date"], .doc-date, time')?.innerText?.trim();

      // Extrai headings para estrutura
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.innerText.trim()
        }))
        .filter(h => h.text);

      return {
        title,
        content: content.substring(0, 50000), // Limita tamanho
        headings,
        author,
        date,
        url: window.location.href,
        contentSource: iframeContentFromParent ? 'iframe' : 'page'
      };
    }, iframeContent);

    return {
      id: docId,
      ...doc
    };
  }

  /**
   * Busca documentos por palavra-chave
   * Usa a interface de busca da página inicial
   */
  async search(query, options = {}) {
    const { limit = 10 } = options;

    console.log(`🔍 Buscando: "${query}"`);

    // Vai para a homepage
    await this.page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda carregamento
    await new Promise(r => setTimeout(r, 5000));

    // Clica no botão de busca
    try {
      // Tenta encontrar e clicar na busca
      const searchBtn = await this.page.locator('.global-search-wrap, .search-icon-btn, [class*="search"]').first();
      if (await searchBtn.count() > 0) {
        await searchBtn.click();
        await new Promise(r => setTimeout(r, 1000));
      }

      // Preenche o campo de busca
      const searchInput = await this.page.locator('input[type="text"], input[placeholder*="search"], .search-input').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill(query);
        await searchInput.press('Enter');
        await new Promise(r => setTimeout(r, 5000));
      }
    } catch (e) {
      console.log('   ⚠️ Não foi possível usar busca interativa:', e.message);
    }

    // Extrai resultados
    const results = await this.page.evaluate((maxResults) => {
      // Tenta diferentes seletores de resultado
      const resultSelectors = [
        '.search-result-item',
        '.result-item',
        '.doc-item',
        '[class*="result"]',
        '.knowledge-item'
      ];

      let items = [];
      for (const selector of resultSelectors) {
        items = Array.from(document.querySelectorAll(selector));
        if (items.length > 0) break;
      }

      // Se não encontrou, tenta extrair da lista de docs
      if (items.length === 0) {
        items = Array.from(document.querySelectorAll('a[href*="/docs2/"], a[href*="/knowledge/"]'))
          .filter(a => a.innerText && a.innerText.length > 5);
      }

      return items.slice(0, maxResults).map(item => {
        const link = item.querySelector('a') || item;
        const titleEl = item.querySelector('h3, h4, .title, [class*="title"]') || link;
        const snippetEl = item.querySelector('.snippet, .desc, .description, [class*="desc"], .summary');

        return {
          title: titleEl.innerText?.trim() || 'Sem título',
          url: link.href || link.getAttribute('href'),
          snippet: snippetEl?.innerText?.trim()?.substring(0, 200) || ''
        };
      });
    }, limit);

    return {
      query,
      count: results.length,
      results
    };
  }

  /**
   * Cria um novo documento
   * @param {Object} options
   * @param {string} options.title - Título do documento
   * @param {string} options.content - Conteúdo do documento (markdown ou texto simples)
   * @param {string} options.spaceId - ID do espaço (opcional)
   * @param {boolean} options.interactive - Se true, mantém navegador aberto para usuário salvar
   */
  async createDocument(options) {
    const { title, content, spaceId, interactive = true } = options;

    console.log(`📝 Criando documento: "${title}"`);

    // Navega para a página de criação
    const createUrl = spaceId
      ? `https://cooper.didichuxing.com/docs2/create?space=${spaceId}`
      : 'https://cooper.didichuxing.com/docs2/create';

    await this.page.goto(createUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda carregamento
    console.log('   ⏳ Aguardando página carregar...');
    await new Promise(r => setTimeout(r, 10000));

    // Tenta encontrar e preencher o título
    try {
      // Procura campo de título - espera ele aparecer
      const titleSelectors = [
        'input[placeholder*="标题"]',  // Chinês
        'input[placeholder*="title"]', // Inglês
        'input[placeholder*="Title"]', // Inglês maiúsculo
        '.doc-title-input',
        '[class*="title"] input',
        '.c-editor-title input',
        'input[type="text"]'
      ];

      let titleInput = null;
      for (const selector of titleSelectors) {
        const input = this.page.locator(selector).first();
        const count = await input.count();
        if (count > 0) {
          titleInput = input;
          break;
        }
      }

      if (titleInput) {
        await titleInput.fill(title);
        console.log('   ✓ Título preenchido');
      } else {
        console.log('   ⚠️ Campo de título não encontrado');
      }
    } catch (e) {
      console.log('   ⚠️ Não foi possível preencher título:', e.message);
    }

    // Tenta preencher o conteúdo (no iframe do editor)
    try {
      console.log('   ⏳ Aguardando editor carregar...');
      await new Promise(r => setTimeout(r, 5000));

      // Acessa o iframe do editor
      const frame = this.page.frameLocator('iframe').first();
      const editor = frame.locator('[contenteditable="true"], .editor, [role="textbox"], .ql-editor').first();

      const editorCount = await editor.count();
      if (editorCount > 0) {
        await editor.fill(content);
        console.log('   ✓ Conteúdo preenchido');
      } else {
        // Tenta via evaluate
        console.log('   🔄 Tentando preencher via JavaScript...');
        await this.page.evaluate((docContent) => {
          const iframe = document.querySelector('iframe');
          if (iframe && iframe.contentDocument) {
            const editable = iframe.contentDocument.querySelector('[contenteditable="true"]');
            if (editable) {
              editable.innerText = docContent;
              return true;
            }
          }
          return false;
        }, content);
        console.log('   ✓ Conteúdo preenchido (via evaluate)');
      }
    } catch (e) {
      console.log('   ⚠️ Não foi possível preencher conteúdo:', e.message);
    }

    // Aguarda para usuário revisar
    if (interactive) {
      console.log('\n' + '='.repeat(60));
      console.log('✏️  DOCUMENTO PRONTO PARA REVISÃO');
      console.log('='.repeat(60));
      console.log(`Título: ${title}`);
      console.log(`Conteúdo: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
      console.log('\n📋 O navegador está aberto. Por favor:');
      console.log('   1. Revise o conteúdo');
      console.log('   2. Ajuste se necessário');
      console.log('   3. Salve o documento no Cooper');
      console.log('='.repeat(60) + '\n');

      // Mantém aberto por tempo suficiente para usuário salvar
      await new Promise(r => setTimeout(r, 30000));
    } else {
      await new Promise(r => setTimeout(r, 3000));
    }

    // Retorna URL atual
    const currentUrl = this.page.url();

    return {
      success: true,
      title,
      url: currentUrl,
      message: interactive
        ? 'Documento preenchido. Verifique no navegador e salve manualmente.'
        : 'Documento criado'
    };
  }

  /**
   * Atualiza um documento existente
   * @param {Object} options
   * @param {string} options.docId - ID do documento
   * @param {string} options.content - Novo conteúdo (substitui o existente)
   * @param {string} options.append - Conteúdo para adicionar ao final
   */
  async updateDocument(options) {
    const { docId, content, append } = options;

    console.log(`✏️  Atualizando documento: ${docId}`);

    // Primeiro obtém o documento atual
    const currentDoc = await this.getDocument(docId);
    const editUrl = currentDoc.url.replace('/docs2/document/', '/docs2/edit/');

    // Navega para edição
    await this.page.goto(editUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguarda carregamento
    await new Promise(r => setTimeout(r, 5000));

    try {
      // Acessa o iframe do editor
      await new Promise(r => setTimeout(r, 3000));
      const frame = this.page.frameLocator('iframe').first();
      const editor = frame.locator('[contenteditable="true"], .editor, [role="textbox"]').first();

      if (await editor.count() > 0) {
        if (content) {
          // Substitui conteúdo
          await editor.fill(content);
          console.log('   ✓ Conteúdo substituído');
        } else if (append) {
          // Adiciona ao final
          const currentContent = await editor.innerText();
          await editor.fill(currentContent + '\n\n' + append);
          console.log('   ✓ Conteúdo adicionado');
        }
      }
    } catch (e) {
      console.log('   ⚠️ Não foi possível atualizar:', e.message);
    }

    await new Promise(r => setTimeout(r, 2000));

    return {
      success: true,
      docId,
      url: this.page.url(),
      message: 'Documento atualizado (verifique no navegador)'
    };
  }

  /**
   * Lista espaços/pastas disponíveis
   */
  async listSpaces() {
    console.log('📁 Listando espaços...');

    await this.page.goto('https://cooper.didichuxing.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await this.page.waitForLoadState('networkidle');
    await new Promise(r => setTimeout(r, 3000));

    const spaces = await this.page.evaluate(() => {
      // Tenta encontrar lista de espaços
      const spaceSelectors = [
        '.space-item',
        '.workspace-item',
        '.folder-item',
        '[class*="space"]',
        '.nav-item'
      ];

      let items = [];
      for (const selector of spaceSelectors) {
        items = Array.from(document.querySelectorAll(selector));
        if (items.length > 0) break;
      }

      return items.map(item => {
        const link = item.querySelector('a') || item;
        return {
          name: item.innerText?.trim() || 'Sem nome',
          url: link.href || link.getAttribute('href')
        };
      }).filter(s => s.name && s.name !== 'Sem nome');
    });

    return spaces;
  }

  /**
   * Extrai ID do documento de uma URL ou retorna o próprio ID
   */
  extractDocId(input) {
    if (!input) return null;

    // Se for URL, extrai o ID
    const urlMatch = input.match(/\/docs2\/document\/(\d+)/) ||
                    input.match(/\/knowledge\/(\d+)/) ||
                    input.match(/(\d{10,})/);

    if (urlMatch) {
      return urlMatch[1];
    }

    // Assume que é o próprio ID
    return input;
  }
}
