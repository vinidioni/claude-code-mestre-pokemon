#!/usr/bin/env node

/**
 * Test suite for D-Chat MCP Server v2
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test helper
function sendRequest(request) {
  return new Promise((resolve, reject) => {
    const server = spawn('node', [path.join(__dirname, 'index.js')], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    server.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    server.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    server.on('close', (code) => {
      // Parse all JSON-RPC responses
      const responses = stdout.trim().split('\n').map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(Boolean);

      resolve({ responses, stderr, code });
    });

    server.on('error', reject);

    // Send request
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();
  });
}

// Tests
async function runTests() {
  console.log('🧪 Testing D-Chat MCP Server v2.0\n');

  // Test 1: List Tools
  console.log('Test 1: List Tools');
  const listTools = await sendRequest({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  });

  const toolsResponse = listTools.responses.find(r => r.id === 1);
  if (toolsResponse?.result?.tools) {
    console.log(`✅ Found ${toolsResponse.result.tools.length} tools`);
    console.log('Tools:', toolsResponse.result.tools.map(t => t.name).join(', '));
  } else {
    console.log('❌ Failed to list tools');
    console.log('Response:', toolsResponse);
  }

  // Test 2: Rate Limit Status
  console.log('\nTest 2: Get Rate Limit Status');
  const rateLimit = await sendRequest({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_rate_limit_status',
      arguments: {}
    }
  });

  const rateResponse = rateLimit.responses.find(r => r.id === 2);
  if (rateResponse?.result?.content) {
    console.log('✅ Rate limit status retrieved');
    console.log('Content:', rateResponse.result.content[0].text);
  } else {
    console.log('❌ Failed to get rate limit');
  }

  // Test 3: Send Message (Dry Run)
  console.log('\nTest 3: Send Message (Dry Run)');
  const sendMsg = await sendRequest({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'send_message',
      arguments: {
        target_type: 'user',
        target: 'testuser',
        message: 'Test message',
        dry_run: true,
        output_format: 'json'
      }
    }
  });

  const sendResponse = sendMsg.responses.find(r => r.id === 3);
  if (sendResponse?.result?.content) {
    console.log('✅ Dry-run message test passed');
    const content = JSON.parse(sendResponse.result.content[0].text);
    console.log('Dry run result:', content.ok ? 'OK' : 'Failed');
  } else {
    console.log('❌ Failed dry-run test');
  }

  // Test 4: Clear Cache
  console.log('\nTest 4: Clear Cache');
  const clearCache = await sendRequest({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'clear_cache',
      arguments: {
        cache_type: 'all'
      }
    }
  });

  const cacheResponse = clearCache.responses.find(r => r.id === 4);
  if (cacheResponse?.result?.content) {
    console.log('✅ Cache cleared successfully');
  } else {
    console.log('❌ Failed to clear cache');
  }

  console.log('\n✨ All tests completed!');
}

runTests().catch(console.error);
