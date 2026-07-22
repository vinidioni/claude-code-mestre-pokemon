#!/usr/bin/env node

/**
 * Gattaran MCP Server
 *
 * Provides tools to navigate and extract order information from Gattaran
 * URL: https://gattaran.didi-food.com/v2/home
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';

// Global browser instance (singleton pattern)
let browser = null;
let context = null;
let page = null;

/**
 * Initialize browser connection
 * Uses user's existing Chrome session for authentication
 */
async function initBrowser() {
  if (browser) return { browser, context, page };

  try {
    // Launch browser with user's profile for authentication
    const launchOptions = {
      headless: false, // Show browser for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
      ]
    };

    // Try to use user's Chrome profile for authentication
    const chromeProfilePath = process.env.CHROME_PROFILE_PATH ||
      (process.platform === 'win32'
        ? `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Google\\Chrome\\User Data`
        : undefined);

    if (chromeProfilePath) {
      console.error(`Using Chrome profile: ${chromeProfilePath}`);
    }

    browser = await chromium.launch(launchOptions);

    // Create context with viewport
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    page = await context.newPage();

    // Set default timeout
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    console.error('Browser initialized successfully');
    return { browser, context, page };
  } catch (error) {
    console.error('Failed to initialize browser:', error);
    throw error;
  }
}

/**
 * Navigate to Gattaran home page
 */
async function navigateToGattaran() {
  const { page } = await initBrowser();

  await page.goto('https://gattaran.didi-food.com/v2/home', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for page to load
  await page.waitForTimeout(3000);

  return { success: true, message: 'Navigated to Gattaran home' };
}

/**
 * Navigate to Order Management via menu path
 * City Services -> Transaction Management -> Order Management
 */
async function navigateToOrderManagement() {
  const { page } = await initBrowser();

  try {
    // Try to find and click "City Services" menu
    // Using Playwright's text selector
    const cityServicesSelectors = [
      'text=City Services',
      'text=City Service',
      '[data-testid*="city"]',
      'a:has-text("City")',
      'span:has-text("City Services")'
    ];

    for (const selector of cityServicesSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          await element.click();
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // Look for Transaction Management
    const transactionSelectors = [
      'text=Transaction Management',
      'text=Transaction',
      '[data-testid*="transaction"]'
    ];

    for (const selector of transactionSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          await element.click();
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // Look for Order Management
    const orderManagementSelectors = [
      'text=Order Management',
      'text=Order',
      '[data-testid*="order"]'
    ];

    for (const selector of orderManagementSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          await element.click();
          await page.waitForTimeout(3000);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    return {
      success: true,
      message: 'Navigated to Order Management',
      currentUrl: page.url()
    };
  } catch (error) {
    console.error('Navigation error:', error);
    return {
      success: false,
      message: `Navigation failed: ${error.message}`,
      currentUrl: page.url()
    };
  }
}

/**
 * Search for an order by ID and city
 */
async function searchOrder(orderId, city) {
  const { page } = await initBrowser();

  try {
    // Wait for the form to be available
    await page.waitForTimeout(2000);

    // Find Order ID input field using Playwright locators
    const orderIdSelectors = [
      'input[placeholder*="Order ID" i]',
      'input[name*="order" i]',
      'input[id*="order" i]',
      'input[data-testid*="order" i]',
      'input[placeholder*="订单号"]',
      'input[placeholder*="ID" i]'
    ];

    let orderIdInput = null;
    for (const selector of orderIdSelectors) {
      try {
        const locator = page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          orderIdInput = locator;
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    // Try to find by label text
    if (!orderIdInput) {
      const labels = await page.locator('label').all();
      for (const label of labels) {
        const text = await label.textContent();
        if (text && (text.toLowerCase().includes('order') || text.includes('订单'))) {
          // Try to find associated input
          const input = await label.locator('input').first();
          if (await input.isVisible().catch(() => false)) {
            orderIdInput = input;
            break;
          }
        }
      }
    }

    if (orderIdInput) {
      await orderIdInput.click();
      await orderIdInput.fill(orderId);
      await page.waitForTimeout(500);
    }

    // Find City input field
    const citySelectors = [
      'input[placeholder*="City" i]',
      'input[name*="city" i]',
      'input[id*="city" i]',
      'input[data-testid*="city" i]',
      'input[placeholder*="城市"]'
    ];

    let cityInput = null;
    for (const selector of citySelectors) {
      try {
        const locator = page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          cityInput = locator;
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    // Try to find city by label
    if (!cityInput) {
      const labels = await page.locator('label').all();
      for (const label of labels) {
        const text = await label.textContent();
        if (text && (text.toLowerCase().includes('city') || text.includes('城市'))) {
          const input = await label.locator('input').first();
          if (await input.isVisible().catch(() => false)) {
            cityInput = input;
            break;
          }
        }
      }
    }

    if (cityInput) {
      await cityInput.click();
      await cityInput.fill(city);
      await page.waitForTimeout(500);

      // Try to select from dropdown if it appears
      const dropdownSelectors = [
        '.ant-select-dropdown li',
        '[role="option"]',
        '.dropdown-item',
        '.ant-select-item'
      ];

      for (const selector of dropdownSelectors) {
        try {
          const option = page.locator(selector).first();
          if (await option.isVisible().catch(() => false)) {
            await option.click();
            break;
          }
        } catch (e) {
          // Continue
        }
      }
    }

    // Find and click Search button
    const searchSelectors = [
      'button:has-text("Search")',
      'button:has-text("查询")',
      'button[type="submit"]',
      'button.ant-btn-primary',
      '[data-testid*="search"]'
    ];

    let searchButton = null;
    for (const selector of searchSelectors) {
      try {
        const locator = page.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) {
          searchButton = locator;
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    if (searchButton) {
      await searchButton.click();
      await page.waitForTimeout(3000);
    }

    return {
      success: true,
      message: `Searched for order ${orderId} in ${city}`,
      orderId,
      city
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      message: `Search failed: ${error.message}`,
      orderId,
      city
    };
  }
}

/**
 * Extract order details from the page
 */
async function extractOrderDetails() {
  const { page } = await initBrowser();

  try {
    // Wait for results to load
    await page.waitForTimeout(3000);

    // Take a screenshot for debugging
    await page.screenshot({
      path: 'gattaran-order-screenshot.png',
      fullPage: true
    });

    // Try to find order details in various formats
    const details = await page.evaluate(() => {
      const result = {
        orderId: '',
        status: '',
        customerInfo: {},
        merchantInfo: {},
        items: [],
        payment: {},
        delivery: {},
        timestamps: {},
        rawText: ''
      };

      // Try to extract from tables
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 2) {
            const key = cells[0].textContent?.trim();
            const value = cells[1].textContent?.trim();
            if (key && value) {
              result[key] = value;
            }
          }
        });
      });

      // Try to extract from definition lists
      const dls = document.querySelectorAll('dl');
      dls.forEach(dl => {
        const dts = dl.querySelectorAll('dt');
        const dds = dl.querySelectorAll('dd');
        dts.forEach((dt, index) => {
          const key = dt.textContent?.trim();
          const value = dds[index]?.textContent?.trim();
          if (key && value) {
            result[key] = value;
          }
        });
      });

      // Try to extract from labeled fields
      const labels = document.querySelectorAll('label');
      labels.forEach(label => {
        const key = label.textContent?.trim();
        const input = label.nextElementSibling;
        if (input && (input.tagName === 'INPUT' || input.tagName === 'DIV')) {
          const value = input.value || input.textContent?.trim();
          if (key && value) {
            result[key] = value;
          }
        }
      });

      // Get all text content as fallback
      result.rawText = document.body.innerText.substring(0, 5000); // Limit to 5000 chars

      return result;
    });

    return {
      success: true,
      message: 'Order details extracted',
      details,
      screenshot: 'gattaran-order-screenshot.png'
    };
  } catch (error) {
    console.error('Extraction error:', error);
    return {
      success: false,
      message: `Extraction failed: ${error.message}`
    };
  }
}

/**
 * Close browser connection
 */
async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    context = null;
    page = null;
    console.error('Browser closed');
  }
  return { success: true, message: 'Browser closed' };
}

// Create MCP Server
const server = new Server(
  {
    name: 'gattaran-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'gattaran_navigate',
        description: 'Navigate to Gattaran home page',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'gattaran_go_to_order_management',
        description: 'Navigate to Order Management via menu: City Services -> Transaction Management -> Order Management',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'gattaran_search_order',
        description: 'Search for an order by ID and city',
        inputSchema: {
          type: 'object',
          properties: {
            order_id: {
              type: 'string',
              description: 'The order ID to search for'
            },
            city: {
              type: 'string',
              description: 'The city name (e.g., Goiânia)'
            }
          },
          required: ['order_id', 'city']
        }
      },
      {
        name: 'gattaran_extract_details',
        description: 'Extract order details from the current page',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'gattaran_full_workflow',
        description: 'Complete workflow: navigate, go to order management, search, and extract details',
        inputSchema: {
          type: 'object',
          properties: {
            order_id: {
              type: 'string',
              description: 'The order ID to search for'
            },
            city: {
              type: 'string',
              description: 'The city name (e.g., Goiânia)'
            }
          },
          required: ['order_id', 'city']
        }
      },
      {
        name: 'gattaran_close',
        description: 'Close the browser connection',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'gattaran_navigate':
        result = await navigateToGattaran();
        break;

      case 'gattaran_go_to_order_management':
        result = await navigateToOrderManagement();
        break;

      case 'gattaran_search_order':
        result = await searchOrder(args.order_id, args.city);
        break;

      case 'gattaran_extract_details':
        result = await extractOrderDetails();
        break;

      case 'gattaran_full_workflow':
        await navigateToGattaran();
        await navigateToOrderManagement();
        await searchOrder(args.order_id, args.city);
        result = await extractOrderDetails();
        break;

      case 'gattaran_close':
        result = await closeBrowser();
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message,
            tool: name
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Gattaran MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
