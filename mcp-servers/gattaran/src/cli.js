#!/usr/bin/env node

/**
 * Gattaran CLI - Interface de linha de comando para busca de orders
 */

import { createClient } from './api-client.js';
import fs from 'fs/promises';
import path from 'path';

const COMMANDS = {
  search: 'Buscar uma order específica',
  batch: 'Processar múltiplas orders de um arquivo',
  login: 'Fazer login e salvar sessão',
  status: 'Verificar status da sessão'
};

function printUsage() {
  console.log(`
🚀 Gattaran CLI - Automação de Orders

Uso: node cli.js <comando> [opções]

Comandos:
  search <orderId> [cityId]     Buscar uma order
  batch <arquivo.csv>           Processar lote de orders
  login                         Fazer login manual
  status                        Verificar sessão

Opções:
  --headless                    Executar sem abrir browser (padrão: true)
  --no-headless                 Abrir browser visível
  --output <arquivo>            Salvar resultado em arquivo JSON/CSV

Exemplos:
  node cli.js search 5764678584400678506
  node cli.js search 5764678584400678506 55000199 --no-headless
  node cli.js batch orders.csv --output resultados.json
  node cli.js login --no-headless
`);
}

async function searchCommand(args) {
  const orderId = args[0];
  const cityId = args[1] || '55000199'; // São Paulo

  if (!orderId) {
    console.error('❌ Erro: orderId é obrigatório');
    console.log('Uso: node cli.js search <orderId> [cityId]');
    process.exit(1);
  }

  const headless = !args.includes('--no-headless');
  const outputIndex = args.indexOf('--output');
  const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null;

  console.log(`🔍 Buscando order ${orderId}...`);

  const client = await createClient({ headless });

  try {
    const result = await client.searchOrder(orderId, cityId);

    if (result) {
      console.log('\n📋 Resultado:');
      console.log(JSON.stringify(result, null, 2));

      if (outputFile) {
        await fs.writeFile(outputFile, JSON.stringify(result, null, 2));
        console.log(`\n💾 Salvo em: ${outputFile}`);
      }
    } else {
      console.log('⚠️  Order não encontrada');
    }
  } finally {
    await client.close();
  }
}

async function batchCommand(args) {
  const filePath = args[0];

  if (!filePath) {
    console.error('❌ Erro: arquivo é obrigatório');
    console.log('Uso: node cli.js batch <arquivo.csv|json>');
    process.exit(1);
  }

  const headless = !args.includes('--no-headless');
  const outputIndex = args.indexOf('--output');
  const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : `resultados-${Date.now()}.json`;

  // Ler arquivo de input
  let orders = [];
  const ext = path.extname(filePath).toLowerCase();

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    if (ext === '.csv') {
      // Parse CSV simples
      const lines = content.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const order = {};
        headers.forEach((h, idx) => {
          order[h] = values[idx]?.trim();
        });
        orders.push(order);
      }
    } else if (ext === '.json') {
      orders = JSON.parse(content);
    } else {
      // Arquivo simples com um orderId por linha
      orders = content.split('\n').filter(l => l.trim()).map(id => ({ orderId: id.trim() }));
    }
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo: ${error.message}`);
    process.exit(1);
  }

  console.log(`📦 ${orders.length} orders para processar`);

  const client = await createClient({ headless });

  try {
    const { results, errors } = await client.batchSearch(orders, {
      concurrency: 5,
      delay: 1000
    });

    // Salvar resultados
    const output = {
      timestamp: new Date().toISOString(),
      total: orders.length,
      success: results.length,
      errors: errors.length,
      results,
      errors
    };

    await fs.writeFile(outputFile, JSON.stringify(output, null, 2));
    console.log(`\n💾 Resultados salvos em: ${outputFile}`);

    // Resumo
    if (errors.length > 0) {
      console.log('\n⚠️  Erros:');
      errors.forEach(e => console.log(`  - ${e.orderId}: ${e.error}`));
    }
  } finally {
    await client.close();
  }
}

async function loginCommand(args) {
  const headless = !args.includes('--no-headless');

  if (headless) {
    console.log('⚠️  Login requer browser visível. Usando --no-headless');
  }

  console.log('🔐 Iniciando login...');

  const client = await createClient({ headless: false });

  // O login é feito automaticamente no init se necessário
  console.log('✅ Login concluído e sessão salva');
  await client.close();
}

async function statusCommand() {
  try {
    const sessionFile = '.gattaran-session.json';
    const data = await fs.readFile(sessionFile, 'utf-8');
    const session = JSON.parse(data);

    console.log('📊 Status da Sessão');
    console.log('===================');
    console.log(`Arquivo: ${sessionFile}`);
    console.log(`Origins: ${session.origins?.length || 0}`);
    console.log(`Cookies: ${session.cookies?.length || 0}`);

    if (session.cookies?.length > 0) {
      console.log('\nCookies principais:');
      session.cookies.forEach(c => {
        console.log(`  - ${c.name}: ${c.value.substring(0, 50)}...`);
      });
    }
  } catch {
    console.log('❌ Nenhuma sessão salva encontrada');
    console.log('Execute: node cli.js login');
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printUsage();
    process.exit(0);
  }

  try {
    switch (command) {
      case 'search':
        await searchCommand(args.slice(1));
        break;
      case 'batch':
        await batchCommand(args.slice(1));
        break;
      case 'login':
        await loginCommand(args.slice(1));
        break;
      case 'status':
        await statusCommand();
        break;
      default:
        console.error(`❌ Comando desconhecido: ${command}`);
        printUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Erro: ${error.message}`);
    process.exit(1);
  }
}

main();
