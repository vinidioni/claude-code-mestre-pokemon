#!/usr/bin/env node

/**
 * MCP Server for D-Chat Integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'child_process';
import { platform } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DWS_SCRIPT_PATH = process.env.DWS_SCRIPT_PATH || path.join(
  process.env.USERPROFILE || process.env.HOME,
  '.SmartWork', 'skills', 'smartwork-cli', 'smartwork-shared', 'assets',
  platform() === 'win32' ? 'dws-windows.ps1' : 'dws-unix.sh'
);

const isWindows = platform() === 'win32';

function execDws(args, options = {}) {
  return new Promise((resolve, reject) => {
    let cmd, cmdArgs;

    if (isWindows) {
      cmd = 'powershell';
      cmdArgs = ['-ExecutionPolicy', 'Bypass', '-File', DWS_SCRIPT_PATH, ...args];
    } else {
      cmd = 'bash';
      cmdArgs = [DWS_SCRIPT_PATH, ...args];
    }

    const env = { ...process.env, ...(options.env || {}) };
    const child = spawn(cmd, cmdArgs, {
      env,
      timeout: options.timeout || 60000,
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0 && !options.ignoreError) {
        reject(new Error(`Command failed with code ${code}: ${stderr || stdout}`));
      } else {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim(), code });
      }
    });

    child.on('error', (err) => {
      reject(new Error(`Failed to spawn process: ${err.message}`));
    });
  });
}

async function execDwsJson(args) {
  const result = await execDws(['--output', 'json', ...args]);
  try {
    return JSON.parse(result.stdout);
  } catch (e) {
    return { ok: true, data: result.stdout };
  }
}

const server = new Server(
  {
    name: 'dchat-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'send_message',
        description: 'Send a text message to a user or group chat in D-Chat.',
        inputSchema: {
          type: 'object',
          properties: {
            target_type: {
              type: 'string',
              enum: ['user', 'chat_id', 'chat_name', 'current'],
              description: 'Type of target'
            },
            target: {
              type: 'string',
              description: 'Target identifier'
            },
            message: {
              type: 'string',
              description: 'Message text to send'
            },
            dry_run: {
              type: 'boolean',
              description: 'Preview only without sending',
              default: false
            }
          },
          required: ['target_type', 'message']
        },
      },
      {
        name: 'list_chats',
        description: 'List all available chats from D-Chat.',
        inputSchema: {
          type: 'object',
          properties: {}
        },
      },
      {
        name: 'get_messages',
        description: 'Retrieve messages from a specific chat.',
        inputSchema: {
          type: 'object',
          properties: {
            target_type: {
              type: 'string',
              enum: ['user', 'chat_id', 'chat_name', 'current'],
              description: 'Type of target'
            },
            target: {
              type: 'string',
              description: 'Target identifier'
            },
            time_range: {
              type: 'string',
              enum: ['today', 'yesterday', 'last_7_days', 'latest'],
              description: 'Time range for messages'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of messages',
              default: 500
            }
          },
          required: ['target_type']
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'send_message') {
      const { target_type, target, message, dry_run = false } = args;
      let cmdArgs = ['message', 'send-text'];

      if (dry_run) cmdArgs.push('--dry-run');

      if (target_type === 'user') {
        cmdArgs.push('--by-target-user', target);
      } else if (target_type === 'chat_id') {
        cmdArgs.push('--by-chat-id', target);
      } else if (target_type === 'chat_name') {
        cmdArgs.push('--by-chat-name', target);
      } else if (target_type === 'current') {
        cmdArgs.push('--current');
      }

      cmdArgs.push(message);

      const result = await execDws(cmdArgs);

      return {
        content: [{
          type: 'text',
          text: dry_run ? `Preview:\n${result.stdout}` : `Sent:\n${result.stdout}`
        }],
      };
    }

    if (name === 'list_chats') {
      const tempFile = path.join(__dirname, `chats-${Date.now()}.json`);

      try {
        await execDws(['chat', '+dump-chats', tempFile]);
        const content = fs.readFileSync(tempFile, 'utf-8');
        const data = JSON.parse(content);
        fs.unlinkSync(tempFile);

        if (data.ok && data.data && data.data.chats) {
          const chats = data.data.chats.map(c => ({
            vid: c.vid,
            name: c.name,
            type: c.type
          }));

          return {
            content: [{
              type: 'text',
              text: `Found ${data.data.total} chats:\n${JSON.stringify(chats, null, 2)}`
            }],
          };
        }

        return { content: [{ type: 'text', text: content }] };
      } catch (e) {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        throw e;
      }
    }

    if (name === 'get_messages') {
      const { target_type, target, time_range, limit = 500 } = args;
      const tempFile = path.join(__dirname, `msgs-${Date.now()}.json`);

      let cmdArgs = ['message', '+dump-by-chat'];

      if (target_type === 'user') cmdArgs.push('--by-target-user', target);
      else if (target_type === 'chat_id') cmdArgs.push('--by-chat-id', target);
      else if (target_type === 'chat_name') cmdArgs.push('--by-chat-name', target);
      else if (target_type === 'current') cmdArgs.push('--current');

      if (time_range === 'today') cmdArgs.push('--today');
      else if (time_range === 'yesterday') cmdArgs.push('--yesterday');
      else if (time_range === 'last_7_days') cmdArgs.push('--last-7-days');
      else if (time_range === 'latest') cmdArgs.push('--latest');

      if (limit !== 500) cmdArgs.push('--limit', String(limit));
      cmdArgs.push(tempFile);

      await execDws(cmdArgs);

      const content = fs.readFileSync(tempFile, 'utf-8');
      fs.unlinkSync(tempFile);

      const data = JSON.parse(content);

      if (data.ok && data.data && data.data.messages) {
        const msgs = data.data.messages.map(m => ({
          sender: m.sender_name || m.sender_uid,
          text: m.text,
          time: m.ts ? new Date(m.ts * 1000).toISOString() : null
        }));

        return {
          content: [{
            type: 'text',
            text: `Messages (${data.data.total}):\n${JSON.stringify(msgs.slice(0, 20), null, 2)}${msgs.length > 20 ? '\n...' : ''}`
          }],
        };
      }

      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  if (!fs.existsSync(DWS_SCRIPT_PATH)) {
    console.error(`Error: DWS script not found at ${DWS_SCRIPT_PATH}`);
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('D-Chat MCP Server running on stdio');
}

main().catch(console.error);
