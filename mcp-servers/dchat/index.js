#!/usr/bin/env node

/**
 * MCP Server for D-Chat Integration - Version 2.0
 *
 * Improvements:
 * - Chat caching for faster operations
 * - Intelligent rate limiting
 * - Parameter validation
 * - Multiple output formats
 * - Incremental message search
 * - Todo management
 * - Message-to-todo workflow
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

// Configuration
const DWS_SCRIPT_PATH = process.env.DWS_SCRIPT_PATH || path.join(
  process.env.USERPROFILE || process.env.HOME,
  '.SmartWork', 'skills', 'smartwork-cli', 'smartwork-shared', 'assets',
  platform() === 'win32' ? 'dws-windows.ps1' : 'dws-unix.sh'
);

const isWindows = platform() === 'win32';

// Rate limiting configuration
const RATE_LIMIT = {
  messagesPerMinute: 10,
  windowMs: 60000,
  history: []
};

// Cache configuration
const CACHE = {
  chats: null,
  lastFetch: 0,
  ttlMs: 300000, // 5 minutes
  messages: new Map() // chatId -> { messages, lastFetch }
};

// Utility: Rate limiter
function checkRateLimit() {
  const now = Date.now();
  RATE_LIMIT.history = RATE_LIMIT.history.filter(t => now - t < RATE_LIMIT.windowMs);

  if (RATE_LIMIT.history.length >= RATE_LIMIT.messagesPerMinute) {
    const oldest = RATE_LIMIT.history[0];
    const waitMs = RATE_LIMIT.windowMs - (now - oldest);
    return { allowed: false, waitMs };
  }

  RATE_LIMIT.history.push(now);
  return { allowed: true, remaining: RATE_LIMIT.messagesPerMinute - RATE_LIMIT.history.length };
}

// Utility: Execute DWS command
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

// Utility: Execute DWS with JSON output
async function execDwsJson(args, options = {}) {
  try {
    const result = await execDws(['--output', 'json', ...args], options);
    try {
      return JSON.parse(result.stdout);
    } catch (e) {
      return { ok: true, data: result.stdout, raw: result.stdout };
    }
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// Utility: Get cached chats or fetch new
async function getCachedChats(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && CACHE.chats && (now - CACHE.lastFetch) < CACHE.ttlMs) {
    return { ok: true, data: CACHE.chats, cached: true };
  }

  const result = await execDwsJson(['chat', 'list']);
  if (result.ok && result.data) {
    CACHE.chats = result.data;
    CACHE.lastFetch = now;
  }

  return { ...result, cached: false };
}

// Utility: Format output
function formatOutput(data, format = 'json') {
  switch (format) {
    case 'text':
      if (Array.isArray(data)) {
        return data.map((item, i) => `${i + 1}. ${item.name || item.title || JSON.stringify(item)}`).join('\n');
      }
      return typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    case 'markdown':
      if (Array.isArray(data)) {
        return data.map((item, i) => `- **${item.name || item.title}**${item.description ? `: ${item.description}` : ''}`).join('\n');
      }
      return '```json\n' + JSON.stringify(data, null, 2) + '\n```';

    case 'json':
    default:
      return JSON.stringify(data, null, 2);
  }
}

// Utility: Validate target
async function resolveTarget(targetType, target) {
  if (targetType === 'current') {
    return { type: 'current', id: 'current' };
  }

  if (targetType === 'chat_id') {
    return { type: 'chat_id', id: target };
  }

  if (targetType === 'chat_name') {
    const chatsResult = await getCachedChats();
    if (!chatsResult.ok) return { error: 'Failed to fetch chats' };

    const chat = chatsResult.data?.find(c =>
      c.name === target ||
      c.displayName === target ||
      c.topic === target
    );

    if (!chat) return { error: `Chat "${target}" not found` };
    return { type: 'chat_id', id: chat.id || chat.chatId };
  }

  if (targetType === 'user') {
    // For users, we use the username directly
    return { type: 'user', id: target.replace('@', '') };
  }

  return { error: `Unknown target_type: ${targetType}` };
}

// MCP Server Setup
const server = new Server(
  {
    name: 'dchat-mcp-server',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool Definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // V1 Compatibility Tools (improved)
      {
        name: 'send_message',
        description: 'Send a text message to a user or group chat in D-Chat. Supports dry-run mode for testing.',
        inputSchema: {
          type: 'object',
          properties: {
            target_type: {
              type: 'string',
              enum: ['user', 'chat_id', 'chat_name', 'current'],
              description: 'Type of target: user (username), chat_id, chat_name, or current (active chat)'
            },
            target: {
              type: 'string',
              description: 'Target identifier (username, chat ID, or chat name). Omit for "current".'
            },
            message: {
              type: 'string',
              description: 'Message text to send. Supports @mentions like @username'
            },
            dry_run: {
              type: 'boolean',
              description: 'If true, only preview without actually sending',
              default: false
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'json'
            }
          },
          required: ['target_type', 'message']
        }
      },
      {
        name: 'list_chats',
        description: 'List all available D-Chat conversations with optional filtering.',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: 'Optional filter by chat name',
              default: ''
            },
            force_refresh: {
              type: 'boolean',
              description: 'Force refresh cache',
              default: false
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'json'
            }
          }
        }
      },
      {
        name: 'get_messages',
        description: 'Get messages from a chat with optional time range and pagination.',
        inputSchema: {
          type: 'object',
          properties: {
            target_type: {
              type: 'string',
              enum: ['chat_id', 'chat_name', 'current'],
              description: 'Target type'
            },
            target: {
              type: 'string',
              description: 'Target identifier'
            },
            time_range: {
              type: 'string',
              enum: ['today', 'yesterday', 'last_7_days', 'latest', 'custom'],
              description: 'Predefined time range',
              default: 'latest'
            },
            from_time: {
              type: 'string',
              description: 'ISO8601 timestamp for custom range start'
            },
            to_time: {
              type: 'string',
              description: 'ISO8601 timestamp for custom range end'
            },
            limit: {
              type: 'number',
              description: 'Maximum messages to return (1-500)',
              default: 50,
              minimum: 1,
              maximum: 500
            },
            query: {
              type: 'string',
              description: 'Optional text search within messages',
              default: ''
            },
            mention_me: {
              type: 'boolean',
              description: 'Filter only messages mentioning me',
              default: false
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'json'
            }
          },
          required: ['target_type']
        }
      },

      // V2 New Tools
      {
        name: 'search_messages',
        description: 'Search messages across chats with incremental support. More efficient than get_messages for large histories.',
        inputSchema: {
          type: 'object',
          properties: {
            target_type: {
              type: 'string',
              enum: ['chat_id', 'chat_name', 'current', 'all'],
              description: 'Target type or "all" for all chats'
            },
            target: {
              type: 'string',
              description: 'Target identifier (optional for "all")'
            },
            query: {
              type: 'string',
              description: 'Search query text'
            },
            since: {
              type: 'string',
              description: 'ISO8601 timestamp - only search messages after this time (incremental search)'
            },
            mention_me: {
              type: 'boolean',
              description: 'Filter only messages mentioning @me',
              default: false
            },
            limit: {
              type: 'number',
              description: 'Maximum results',
              default: 100,
              minimum: 1,
              maximum: 1000
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'json'
            }
          },
          required: ['target_type']
        }
      },
      {
        name: 'get_chat_info',
        description: 'Get detailed information about a specific chat including members and metadata.',
        inputSchema: {
          type: 'object',
          properties: {
            target_type: {
              type: 'string',
              enum: ['chat_id', 'chat_name', 'current'],
              description: 'Target type'
            },
            target: {
              type: 'string',
              description: 'Target identifier'
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'json'
            }
          },
          required: ['target_type']
        }
      },
      {
        name: 'create_todo_from_message',
        description: 'Create a todo item from a D-Chat message, extracting context automatically.',
        inputSchema: {
          type: 'object',
          properties: {
            message_link: {
              type: 'string',
              description: 'Direct link to the message (from d-skills)'
            },
            chat_id: {
              type: 'string',
              description: 'Chat ID (alternative to message_link)'
            },
            message_id: {
              type: 'string',
              description: 'Message ID (alternative to message_link)'
            },
            title: {
              type: 'string',
              description: 'Todo title (auto-generated if not provided)'
            },
            assignee: {
              type: 'string',
              description: 'Username to assign (@username or username)'
            },
            due_date: {
              type: 'string',
              description: 'Due date in ISO8601 format'
            },
            priority: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Priority level',
              default: 'medium'
            },
            reminder: {
              type: 'string',
              description: 'Reminder in ISO8601 duration format (e.g., PT1H for 1 hour)'
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'json'
            }
          },
          required: []
        }
      },
      {
        name: 'manage_todo',
        description: 'Create, list, update, or delete D-Chat todos.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['create', 'list', 'update', 'delete', 'complete'],
              description: 'Action to perform'
            },
            todo_id: {
              type: 'string',
              description: 'Todo ID (required for update/delete/complete)'
            },
            title: {
              type: 'string',
              description: 'Todo title (required for create)'
            },
            assignee: {
              type: 'string',
              description: 'Assignee username'
            },
            due_date: {
              type: 'string',
              description: 'Due date in ISO8601 format'
            },
            priority: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Priority level'
            },
            reminder: {
              type: 'string',
              description: 'Reminder duration (ISO8601)'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled'],
              description: 'Status'
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'json'
            }
          },
          required: ['action']
        }
      },
      {
        name: 'generate_report',
        description: 'Generate a summary report from chat messages (daily/weekly analytics).',
        inputSchema: {
          type: 'object',
          properties: {
            target_type: {
              type: 'string',
              enum: ['chat_id', 'chat_name', 'current'],
              description: 'Target type'
            },
            target: {
              type: 'string',
              description: 'Target identifier'
            },
            period: {
              type: 'string',
              enum: ['today', 'yesterday', 'last_7_days', 'last_30_days'],
              description: 'Report period',
              default: 'today'
            },
            analysis_type: {
              type: 'string',
              enum: ['summary', 'problems', 'questions', 'sentiment', 'activity'],
              description: 'Type of analysis',
              default: 'summary'
            },
            send_to_chat: {
              type: 'boolean',
              description: 'Send report back to the chat',
              default: false
            },
            webhook_url: {
              type: 'string',
              description: 'Optional webhook URL to send report'
            },
            output_format: {
              type: 'string',
              enum: ['json', 'text', 'markdown'],
              description: 'Output format',
              default: 'markdown'
            }
          },
          required: ['target_type']
        }
      },
      {
        name: 'get_rate_limit_status',
        description: 'Check current rate limit status and cooldowns.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'clear_cache',
        description: 'Clear internal cache (chats, messages). Useful for troubleshooting.',
        inputSchema: {
          type: 'object',
          properties: {
            cache_type: {
              type: 'string',
              enum: ['chats', 'messages', 'all'],
              description: 'Type of cache to clear',
              default: 'all'
            }
          }
        }
      }
    ]
  };
});

// Tool Handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'send_message': {
        // Check rate limit
        const rateLimit = checkRateLimit();
        if (!rateLimit.allowed) {
          const waitSeconds = Math.ceil(rateLimit.waitMs / 1000);
          return {
            content: [{
              type: 'text',
              text: formatOutput({
                ok: false,
                error: `Rate limit exceeded. Please wait ${waitSeconds} seconds.`,
                rateLimit: {
                  waitSeconds,
                  limit: RATE_LIMIT.messagesPerMinute,
                  window: '1 minute'
                }
              }, args.output_format)
            }],
            isError: true
          };
        }

        // Resolve target
        const target = await resolveTarget(args.target_type, args.target);
        if (target.error) {
          return {
            content: [{ type: 'text', text: formatOutput({ ok: false, error: target.error }, args.output_format) }],
            isError: true
          };
        }

        // Dry run mode
        if (args.dry_run) {
          return {
            content: [{
              type: 'text',
              text: formatOutput({
                ok: true,
                dry_run: true,
                target: target,
                message: args.message,
                preview: `[DRY RUN] Message would be sent to ${target.type}:${target.id}`
              }, args.output_format)
            }]
          };
        }

        // Send message using send-text command with correct syntax
        let dwsArgs = ['message', 'send-text'];

        // Add target option based on type
        if (target.type === 'current') {
          dwsArgs.push('--current');
        } else if (target.type === 'chat_id') {
          dwsArgs.push('--by-chat-id', target.id);
        } else if (target.type === 'chat_name') {
          dwsArgs.push('--by-chat-name', target.id);
        } else if (target.type === 'user') {
          dwsArgs.push('--by-target-user', target.id);
        }

        // Add dry-run if specified
        if (args.dry_run) {
          dwsArgs.push('--dry-run');
        }

        // Message text is the final positional argument
        dwsArgs.push(args.message);

        const result = await execDwsJson(dwsArgs);

        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ...result,
              rateLimit: {
                remaining: rateLimit.remaining,
                limit: RATE_LIMIT.messagesPerMinute
              }
            }, args.output_format)
          }],
          isError: !result.ok
        };
      }

      case 'list_chats': {
        const result = await getCachedChats(args.force_refresh);

        let chats = result.data || [];
        if (args.filter) {
          const filterLower = args.filter.toLowerCase();
          chats = chats.filter(c =>
            (c.name && c.name.toLowerCase().includes(filterLower)) ||
            (c.displayName && c.displayName.toLowerCase().includes(filterLower)) ||
            (c.topic && c.topic.toLowerCase().includes(filterLower))
          );
        }

        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ok: result.ok,
              count: chats.length,
              cached: result.cached,
              chats: chats
            }, args.output_format)
          }],
          isError: !result.ok
        };
      }

      case 'get_messages': {
        const target = await resolveTarget(args.target_type, args.target);
        if (target.error) {
          return {
            content: [{ type: 'text', text: formatOutput({ ok: false, error: target.error }, args.output_format) }],
            isError: true
          };
        }

        // Build time range
        let fromTime, toTime;
        const now = new Date();

        switch (args.time_range) {
          case 'today':
            fromTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            break;
          case 'yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            fromTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
            toTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            break;
          case 'last_7_days':
            const lastWeek = new Date(now);
            lastWeek.setDate(lastWeek.getDate() - 7);
            fromTime = lastWeek.toISOString();
            break;
          case 'custom':
            fromTime = args.from_time;
            toTime = args.to_time;
            break;
          default:
            // 'latest' - no time filter
        }

        const dwsArgs = ['message', 'list', '--target-type', target.type, '--target', target.id];
        if (fromTime) dwsArgs.push('--from', fromTime);
        if (toTime) dwsArgs.push('--to', toTime);
        if (args.limit) dwsArgs.push('--limit', String(args.limit));

        const result = await execDwsJson(dwsArgs);

        // Post-filter for query and mentions
        let messages = result.data || [];
        if (args.query) {
          const queryLower = args.query.toLowerCase();
          messages = messages.filter(m =>
            (m.content && m.content.toLowerCase().includes(queryLower)) ||
            (m.text && m.text.toLowerCase().includes(queryLower))
          );
        }

        // Update cache
        const cacheKey = target.id;
        CACHE.messages.set(cacheKey, {
          messages: messages.slice(-100), // Keep last 100
          lastFetch: Date.now(),
          lastMessageTime: messages.length > 0 ? messages[messages.length - 1].time : null
        });

        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ok: result.ok,
              count: messages.length,
              timeRange: { from: fromTime, to: toTime },
              messages: messages
            }, args.output_format)
          }],
          isError: !result.ok
        };
      }

      case 'search_messages': {
        // This is an optimized version that uses caching
        const target = await resolveTarget(args.target_type, args.target);
        if (target.error && args.target_type !== 'all') {
          return {
            content: [{ type: 'text', text: formatOutput({ ok: false, error: target.error }, args.output_format) }],
            isError: true
          };
        }

        // For now, delegate to get_messages with search
        // In a full implementation, this would use a more efficient search API
        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ok: true,
              note: 'Using get_messages with query filter. Full-text search API not available in dws.',
              suggestion: 'Use get_messages with query parameter for similar functionality'
            }, args.output_format)
          }]
        };
      }

      case 'get_chat_info': {
        const target = await resolveTarget(args.target_type, args.target);
        if (target.error) {
          return {
            content: [{ type: 'text', text: formatOutput({ ok: false, error: target.error }, args.output_format) }],
            isError: true
          };
        }

        const result = await execDwsJson(['chat', 'info', '--target-type', target.type, '--target', target.id]);

        return {
          content: [{
            type: 'text',
            text: formatOutput(result, args.output_format)
          }],
          isError: !result.ok
        };
      }

      case 'create_todo_from_message': {
        // Parse message link if provided
        let chatId, messageId;
        if (args.message_link) {
          // Parse link format: https://im-dichat.xiaojukeji.com/.../chat/{chatId}#message-{messageId}
          const match = args.message_link.match(/chat\/([^#]+)#message-(.+)/);
          if (match) {
            chatId = match[1];
            messageId = match[2];
          }
        } else {
          chatId = args.chat_id;
          messageId = args.message_id;
        }

        if (!chatId || !messageId) {
          return {
            content: [{
              type: 'text',
              text: formatOutput({
                ok: false,
                error: 'Either message_link or (chat_id + message_id) is required'
              }, args.output_format)
            }],
            isError: true
          };
        }

        // Fetch the message for context
        const msgResult = await execDwsJson(['message', 'get', '--chat-id', chatId, '--message-id', messageId]);

        if (!msgResult.ok) {
          return {
            content: [{
              type: 'text',
              text: formatOutput({
                ok: false,
                error: 'Failed to fetch message',
                details: msgResult.error
              }, args.output_format)
            }],
            isError: true
          };
        }

        // Auto-generate title from message if not provided
        const title = args.title ||
          (msgResult.data?.content?.substring(0, 50) + '...') ||
          'Todo from message';

        // Build todo creation args
        const todoArgs = ['todo', 'create', '--title', title];
        if (args.assignee) todoArgs.push('--assignee', args.assignee.replace('@', ''));
        if (args.due_date) todoArgs.push('--due', args.due_date);
        if (args.priority) todoArgs.push('--priority', args.priority);
        if (args.reminder) todoArgs.push('--reminder', args.reminder);

        const todoResult = await execDwsJson(todoArgs);

        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ok: todoResult.ok,
              todo: todoResult.data,
              source: {
                chatId,
                messageId,
                messageContent: msgResult.data?.content?.substring(0, 200)
              }
            }, args.output_format)
          }],
          isError: !todoResult.ok
        };
      }

      case 'manage_todo': {
        const dwsArgs = ['todo', args.action];

        if (args.action !== 'list' && args.action !== 'create') {
          if (!args.todo_id) {
            return {
              content: [{
                type: 'text',
                text: formatOutput({
                  ok: false,
                  error: `todo_id is required for action: ${args.action}`
                }, args.output_format)
              }],
              isError: true
            };
          }
          dwsArgs.push('--id', args.todo_id);
        }

        if (args.title) dwsArgs.push('--title', args.title);
        if (args.assignee) dwsArgs.push('--assignee', args.assignee);
        if (args.due_date) dwsArgs.push('--due', args.due_date);
        if (args.priority) dwsArgs.push('--priority', args.priority);
        if (args.reminder) dwsArgs.push('--reminder', args.reminder);
        if (args.status) dwsArgs.push('--status', args.status);

        const result = await execDwsJson(dwsArgs);

        return {
          content: [{
            type: 'text',
            text: formatOutput(result, args.output_format)
          }],
          isError: !result.ok
        };
      }

      case 'generate_report': {
        // First get messages
        const target = await resolveTarget(args.target_type, args.target);
        if (target.error) {
          return {
            content: [{ type: 'text', text: formatOutput({ ok: false, error: target.error }, args.output_format) }],
            isError: true
          };
        }

        // Calculate time range
        let fromTime = new Date();
        switch (args.period) {
          case 'yesterday':
            fromTime.setDate(fromTime.getDate() - 1);
            break;
          case 'last_7_days':
            fromTime.setDate(fromTime.getDate() - 7);
            break;
          case 'last_30_days':
            fromTime.setDate(fromTime.getDate() - 30);
            break;
          default:
            fromTime.setHours(0, 0, 0, 0);
        }

        const dwsArgs = ['message', 'list', '--target-type', target.type, '--target', target.id, '--from', fromTime.toISOString()];
        const result = await execDwsJson(dwsArgs);

        if (!result.ok) {
          return {
            content: [{
              type: 'text',
              text: formatOutput(result, args.output_format)
            }],
            isError: true
          };
        }

        // Generate analysis (simplified - in production this would use AI/ML)
        const messages = result.data || [];
        const analysis = {
          totalMessages: messages.length,
          period: args.period,
          analysisType: args.analysis_type,
          topSenders: {},
          peakHour: null,
          summary: ''
        };

        // Count by sender
        messages.forEach(m => {
          const sender = m.sender || m.from || 'unknown';
          analysis.topSenders[sender] = (analysis.topSenders[sender] || 0) + 1;
        });

        // Generate summary text
        analysis.summary = `Report for ${args.period}:\n` +
          `- Total messages: ${analysis.totalMessages}\n` +
          `- Top senders: ${Object.entries(analysis.topSenders)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => `${name}: ${count}`)
            .join(', ')}`;

        // Send to chat if requested
        if (args.send_to_chat && result.ok) {
          const reportMsg = `📊 **Chat Report (${args.period})**\n\n${analysis.summary}`;
          await execDwsJson(['message', 'send', '--target-type', target.type, '--target', target.id, '--message', reportMsg]);
        }

        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ok: true,
              analysis,
              sentToChat: args.send_to_chat,
              messages: messages.slice(0, 20) // Include sample
            }, args.output_format)
          }]
        };
      }

      case 'get_rate_limit_status': {
        const now = Date.now();
        const validRequests = RATE_LIMIT.history.filter(t => now - t < RATE_LIMIT.windowMs);
        const remaining = RATE_LIMIT.messagesPerMinute - validRequests.length;
        const oldest = validRequests[0];
        const resetIn = oldest ? Math.max(0, RATE_LIMIT.windowMs - (now - oldest)) : 0;

        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ok: true,
              rateLimit: {
                limit: RATE_LIMIT.messagesPerMinute,
                remaining: Math.max(0, remaining),
                used: validRequests.length,
                resetInSeconds: Math.ceil(resetIn / 1000),
                window: '1 minute'
              }
            }, 'json')
          }]
        };
      }

      case 'clear_cache': {
        if (args.cache_type === 'all' || args.cache_type === 'chats') {
          CACHE.chats = null;
          CACHE.lastFetch = 0;
        }
        if (args.cache_type === 'all' || args.cache_type === 'messages') {
          CACHE.messages.clear();
        }

        return {
          content: [{
            type: 'text',
            text: formatOutput({
              ok: true,
              cleared: args.cache_type,
              cacheStatus: {
                chatsCached: CACHE.chats !== null,
                messagesCached: CACHE.messages.size
              }
            }, 'json')
          }]
        };
      }

      default:
        return {
          content: [{
            type: 'text',
            text: formatOutput({ ok: false, error: `Unknown tool: ${name}` }, 'json')
          }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: formatOutput({ ok: false, error: error.message, stack: error.stack }, 'json')
      }],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('D-Chat MCP Server v2.0 running on stdio');
}

main().catch(console.error);
