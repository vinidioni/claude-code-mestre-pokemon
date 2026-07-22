#!/usr/bin/env node
/**
 * MCP Server para Cooper (DiDi Documentation Platform)
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BrowserAuth } from './auth/browser-auth.js';
import { CooperClient } from './api/cooper-client.js';

class CooperMCPServer {
  constructor() {
    this.auth = new BrowserAuth();
    this.client = null;
    this.server = new Server(
      {
        name: 'cooper-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.auth.close();
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // Lista de ferramentas disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'cooper_get_document',
            description: 'Obtém o conteúdo de um documento do Cooper pelo ID ou URL',
            inputSchema: {
              type: 'object',
              properties: {
                docId: {
                  type: 'string',
                  description: 'ID do documento ou URL completa (ex: 2207291123516 ou https://cooper.didichuxing.com/docs2/document/2207291123516)',
                },
              },
              required: ['docId'],
            },
          },
          {
            name: 'cooper_search',
            description: 'Busca documentos no Cooper por palavra-chave',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Termo de busca',
                },
                limit: {
                  type: 'number',
                  description: 'Número máximo de resultados (padrão: 10)',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'cooper_list_spaces',
            description: 'Lista os espaços/workspaces disponíveis no Cooper',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'cooper_create_document',
            description: 'Cria um novo documento no Cooper',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Título do documento',
                },
                content: {
                  type: 'string',
                  description: 'Conteúdo do documento (texto ou markdown)',
                },
                spaceId: {
                  type: 'string',
                  description: 'ID do espaço/pasta (opcional)',
                },
              },
              required: ['title', 'content'],
            },
          },
        ],
      };
    });

    // Handler de execução das ferramentas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Garante que temos sessão autenticada
        const session = await this.auth.getAuthenticatedSession();

        // Cria cliente se não existir
        if (!this.client) {
          this.client = new CooperClient(session.page);
        }

        switch (name) {
          case 'cooper_get_document': {
            const doc = await this.client.getDocument(args.docId);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(doc, null, 2),
                },
              ],
            };
          }

          case 'cooper_search': {
            const results = await this.client.search(args.query, {
              limit: args.limit || 10,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'cooper_list_spaces': {
            const spaces = await this.client.listSpaces();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(spaces, null, 2),
                },
              ],
            };
          }

          case 'cooper_create_document': {
            const result = await this.client.createDocument({
              title: args.title,
              content: args.content,
              spaceId: args.spaceId,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Ferramenta desconhecida: ${name}`);
        }
      } catch (error) {
        console.error('Error executing tool:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Erro: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Cooper MCP Server rodando em stdio');
  }
}

const server = new CooperMCPServer();
server.run().catch(console.error);
