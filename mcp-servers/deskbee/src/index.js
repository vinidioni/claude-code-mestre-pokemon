#!/usr/bin/env node

/**
 * DeskBee MCP Server
 *
 * Provides tools to automate room booking in DeskBee
 * URL: https://99app.deskbee.app/app/home
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';

// Global browser instance
let browser = null;
let context = null;
let page = null;

const BASE_URL = 'https://99app.deskbee.app';

/**
 * Initialize browser connection
 */
async function initBrowser() {
  if (browser) return { browser, context, page };

  try {
    const launchOptions = {
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
      ]
    };

    browser = await chromium.launch(launchOptions);

    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    page = await context.newPage();
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
 * Navigate to DeskBee home
 */
async function navigateToDeskBee() {
  const { page } = await initBrowser();

  await page.goto(`${BASE_URL}/app/home`, {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForTimeout(3000);

  return { success: true, message: 'Navigated to DeskBee home', url: page.url() };
}

/**
 * Navigate to room booking page
 */
async function navigateToRoomBooking() {
  const { page } = await initBrowser();

  try {
    // Try to find and click "RESERVA SALA" button
    const selectors = [
      'text=RESERVA SALA',
      'text=Reserva Sala',
      'text=Reserva de Sala',
      'button:has-text("RESERVA")',
      'a:has-text("RESERVA")',
      '[data-testid*="reserva"]',
      '[data-testid*="booking"]'
    ];

    for (const selector of selectors) {
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

    // Wait for navigation to booking page
    await page.waitForURL('**/booking/meetingroom', { timeout: 10000 }).catch(() => {
      // If URL didn't change, maybe already on booking page
    });

    return {
      success: true,
      message: 'Navigated to room booking',
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
 * List my bookings
 */
async function listMyBookings() {
  const { page } = await initBrowser();

  try {
    // Navigate to my bookings page
    await page.goto(`${BASE_URL}/app/booking/my`, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait for page to settle (login may redirect)
    await page.waitForTimeout(5000);

    // Check current URL and handle redirects
    let currentUrl = page.url();

    // If redirected to Google or other SSO, wait and try to navigate back
    if (currentUrl.includes('google.com') || currentUrl.includes('accounts.google')) {
      console.error('Detected Google SSO redirect, waiting for login completion...');
      await page.waitForTimeout(10000); // Wait for SSO completion

      // Try to navigate to bookings page again
      await page.goto(`${BASE_URL}/app/booking/my`, {
        waitUntil: 'networkidle',
        timeout: 60000
      });
      await page.waitForTimeout(3000);
      currentUrl = page.url();
    }

    // Check if we're still on login page
    if (currentUrl.includes('login') || currentUrl.includes('sso') || currentUrl.includes('auth')) {
      return {
        success: false,
        message: 'Authentication required. Please login to DeskBee in the opened browser window, then call this function again.',
        currentUrl: currentUrl,
        actionRequired: 'manual_login'
      };
    }

    // Extract bookings from page
    const bookings = await page.evaluate(() => {
      const results = [];

      // Try multiple selectors for booking cards
      const selectors = [
        '.booking-card',
        '.reservation-item',
        '.reservation-card',
        '[data-testid*="booking"]',
        '[data-testid*="reservation"]',
        '.my-booking-item'
      ];

      for (const selector of selectors) {
        const cards = document.querySelectorAll(selector);
        if (cards.length > 0) {
          cards.forEach(card => {
            const booking = {
              title: card.querySelector('.title, [class*="title"], h3, h4')?.innerText?.trim() || '',
              date: card.querySelector('.date, [class*="date"], [data-testid*="date"]')?.innerText?.trim() || '',
              time: card.querySelector('.time, [class*="time"], [data-testid*="time"]')?.innerText?.trim() || '',
              room: card.querySelector('.room-name, [class*="room"], [data-testid*="room"]')?.innerText?.trim() || '',
              status: card.querySelector('.status, [class*="status"], [data-testid*="status"]')?.innerText?.trim() || '',
              location: card.querySelector('.location, [class*="location"], [class*="floor"]')?.innerText?.trim() || ''
            };

            // Only add if has meaningful data
            if (booking.title || booking.room) {
              results.push(booking);
            }
          });

          if (results.length > 0) break;
        }
      }

      // Fallback: extract from table rows
      if (results.length === 0) {
        const rows = document.querySelectorAll('table tr, .table-row');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td, .cell');
          if (cells.length >= 3) {
            results.push({
              title: cells[0]?.innerText?.trim() || '',
              date: cells[1]?.innerText?.trim() || '',
              time: cells[2]?.innerText?.trim() || '',
              room: cells[3]?.innerText?.trim() || '',
              status: cells[4]?.innerText?.trim() || ''
            });
          }
        });
      }

      return results;
    });

    return {
      success: true,
      message: `Found ${bookings.length} bookings`,
      bookings: bookings,
      count: bookings.length
    };
  } catch (error) {
    console.error('List bookings error:', error);
    return {
      success: false,
      message: `Failed to list bookings: ${error.message}`,
      bookings: []
    };
  }
}

/**
 * Check room availability
 */
async function checkAvailability(data, horaInicio, horaFim, pessoas = null, andar = null, propriedades = []) {
  const { page } = await initBrowser();

  try {
    // Navigate to booking page
    await navigateToDeskBee();
    await navigateToRoomBooking();

    // Fill date and time
    await fillDateTime(page, data, horaInicio, horaFim);

    // Apply filters if provided
    if (pessoas || andar || propriedades.length > 0) {
      await applyFilters(page, pessoas, andar, propriedades);
    }

    // Wait for results
    await page.waitForTimeout(3000);

    // Extract available rooms
    const rooms = await extractRooms(page);

    return {
      success: true,
      message: `Found ${rooms.length} available rooms`,
      data: data,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      rooms: rooms,
      count: rooms.length
    };
  } catch (error) {
    console.error('Check availability error:', error);
    return {
      success: false,
      message: `Failed to check availability: ${error.message}`,
      rooms: []
    };
  }
}

/**
 * Book a room
 */
async function bookRoom(titulo, data, horaInicio, horaFim, pessoas = null, andar = null, propriedades = []) {
  const { page } = await initBrowser();

  try {
    // Navigate and set parameters
    await navigateToDeskBee();
    await navigateToRoomBooking();
    await fillDateTime(page, data, horaInicio, horaFim);

    if (pessoas || andar || propriedades.length > 0) {
      await applyFilters(page, pessoas, andar, propriedades);
    }

    await page.waitForTimeout(3000);

    // Select first available room
    const selected = await selectFirstAvailableRoom(page);
    if (!selected) {
      return {
        success: false,
        message: 'No available rooms found for the specified criteria'
      };
    }

    // Fill booking form
    await fillBookingForm(page, titulo, pessoas);

    // Confirm booking
    const confirmed = await confirmBooking(page);

    if (confirmed) {
      return {
        success: true,
        message: 'Room booked successfully',
        titulo: titulo,
        data: data,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        room: selected.name,
        floor: selected.floor
      };
    } else {
      return {
        success: false,
        message: 'Failed to confirm booking'
      };
    }
  } catch (error) {
    console.error('Book room error:', error);
    return {
      success: false,
      message: `Failed to book room: ${error.message}`
    };
  }
}

/**
 * Book recurrent room
 */
async function bookRecurrent(titulo, dataInicial, horaInicio, horaFim, recorrencia, ocorrencias, pessoas = null, andar = null) {
  const { page } = await initBrowser();

  try {
    await navigateToDeskBee();
    await navigateToRoomBooking();
    await fillDateTime(page, dataInicial, horaInicio, horaFim);

    // Set recurrence
    await setRecurrence(page, recorrencia, ocorrencias);

    if (pessoas || andar) {
      await applyFilters(page, pessoas, andar, []);
    }

    await page.waitForTimeout(3000);

    const selected = await selectFirstAvailableRoom(page);
    if (!selected) {
      return {
        success: false,
        message: 'No available rooms found for the specified criteria'
      };
    }

    await fillBookingForm(page, titulo, pessoas);
    const confirmed = await confirmBooking(page);

    if (confirmed) {
      return {
        success: true,
        message: 'Recurrent booking created successfully',
        titulo: titulo,
        data_inicial: dataInicial,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        recorrencia: recorrencia,
        ocorrencias: ocorrencias,
        room: selected.name,
        floor: selected.floor
      };
    } else {
      return {
        success: false,
        message: 'Failed to confirm recurrent booking'
      };
    }
  } catch (error) {
    console.error('Book recurrent error:', error);
    return {
      success: false,
      message: `Failed to create recurrent booking: ${error.message}`
    };
  }
}

/**
 * Generate full report of rooms and bookings
 */
async function generateReport(data, horaInicio, horaFim) {
  const { page } = await initBrowser();

  try {
    // First, get all rooms with their availability
    await navigateToDeskBee();
    await navigateToRoomBooking();
    await fillDateTime(page, data, horaInicio, horaFim);

    // Clear any filters to see all rooms
    await clearFilters(page);
    await page.waitForTimeout(3000);

    // Extract all rooms
    const allRooms = await extractAllRoomsWithStatus(page);

    // Try to get booking information for each room
    const roomsWithBookings = await Promise.all(
      allRooms.map(async (room) => {
        if (!room.available && room.bookedBy) {
          return room;
        }
        return room;
      })
    );

    // Group by floor
    const byFloor = {};
    roomsWithBookings.forEach(room => {
      const floor = room.floor || 'Unknown';
      if (!byFloor[floor]) {
        byFloor[floor] = [];
      }
      byFloor[floor].push(room);
    });

    // Summary statistics
    const summary = {
      total: roomsWithBookings.length,
      available: roomsWithBookings.filter(r => r.available).length,
      booked: roomsWithBookings.filter(r => !r.available).length,
      by_floor: Object.keys(byFloor).reduce((acc, floor) => {
        acc[floor] = {
          total: byFloor[floor].length,
          available: byFloor[floor].filter(r => r.available).length,
          booked: byFloor[floor].filter(r => !r.available).length
        };
        return acc;
      }, {})
    };

    return {
      success: true,
      message: `Report generated for ${data} ${horaInicio}-${horaFim}`,
      data: data,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      summary: summary,
      rooms: roomsWithBookings,
      by_floor: byFloor
    };
  } catch (error) {
    console.error('Generate report error:', error);
    return {
      success: false,
      message: `Failed to generate report: ${error.message}`
    };
  }
}

// Helper functions

async function fillDateTime(page, data, horaInicio, horaFim) {
  // Fill date - try to find and click date field
  try {
    const dateSelectors = [
      'input[placeholder*="Data" i]',
      'input[placeholder*="Date" i]',
      'input[name*="data" i]',
      'input[name*="date" i]',
      '[data-testid*="date"] input'
    ];

    for (const selector of dateSelectors) {
      const input = await page.locator(selector).first();
      if (await input.isVisible().catch(() => false)) {
        await input.click();
        await input.fill(data);
        await input.press('Enter');
        break;
      }
    }
  } catch (e) {
    console.error('Date fill error:', e);
  }

  // Fill time using execCommand approach
  await page.evaluate((start, end) => {
    const fillTimeInput = (placeholder, value) => {
      const inputs = document.querySelectorAll('input');
      for (const input of inputs) {
        const ph = input.placeholder?.toLowerCase() || '';
        if (ph.includes(placeholder.toLowerCase()) || ph.includes('início') || ph.includes('start')) {
          input.focus();
          input.click();
          document.execCommand('selectAll', false, null);
          document.execCommand('insertText', false, value);
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
          break;
        }
      }
    };

    fillTimeInput('início', start);
    setTimeout(() => fillTimeInput('fim', end), 500);
  }, horaInicio, horaFim);

  await page.waitForTimeout(1000);
}

async function applyFilters(page, pessoas, andar, propriedades) {
  try {
    // Apply people filter
    if (pessoas) {
      const peopleSelectors = [
        'input[placeholder*="pessoas" i]',
        'input[placeholder*="people" i]',
        'input[name*="pessoas" i]',
        'input[name*="capacity" i]'
      ];

      for (const selector of peopleSelectors) {
        const input = await page.locator(selector).first();
        if (await input.isVisible().catch(() => false)) {
          await input.fill(pessoas.toString());
          break;
        }
      }
    }

    // Apply floor filter
    if (andar) {
      const floorSelectors = [
        'input[placeholder*="andar" i]',
        'input[placeholder*="floor" i]',
        'select[name*="andar" i]',
        'select[name*="floor" i]'
      ];

      for (const selector of floorSelectors) {
        const element = await page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          await element.click();
          await element.fill(andar);
          break;
        }
      }
    }

    // Click filter button
    const filterButtonSelectors = [
      'button:has-text("FILTRAR")',
      'button:has-text("Filter")',
      'button:has-text("Aplicar")',
      'button[type="submit"]'
    ];

    for (const selector of filterButtonSelectors) {
      const button = await page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        break;
      }
    }

    await page.waitForTimeout(2000);
  } catch (e) {
    console.error('Filter error:', e);
  }
}

async function clearFilters(page) {
  try {
    const clearSelectors = [
      'button:has-text("LIMPAR")',
      'button:has-text("Clear")',
      'button:has-text("Reset")',
      'a:has-text("Limpar")'
    ];

    for (const selector of clearSelectors) {
      const button = await page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
  } catch (e) {
    console.error('Clear filters error:', e);
  }
}

async function extractRooms(page) {
  return await page.evaluate(() => {
    const rooms = [];

    const cardSelectors = [
      '.room-card',
      '.meeting-room-card',
      '[data-testid*="room"]',
      '.room-item'
    ];

    for (const selector of cardSelectors) {
      const cards = document.querySelectorAll(selector);
      if (cards.length > 0) {
        cards.forEach(card => {
          const room = {
            name: card.querySelector('.room-name, [class*="name"], h3, h4')?.innerText?.trim() || '',
            floor: card.querySelector('.floor, [class*="floor"], [class*="andar"]')?.innerText?.trim() || '',
            capacity: card.querySelector('.capacity, [class*="capacity"], [class*="pessoas"]')?.innerText?.trim() || '',
            properties: Array.from(card.querySelectorAll('.property, [class*="property"], .tag')).map(p => p.innerText?.trim()).filter(Boolean),
            available: !card.classList.contains('unavailable') && !card.querySelector('.unavailable'),
            image: card.querySelector('img')?.src || null
          };

          if (room.name) {
            rooms.push(room);
          }
        });

        if (rooms.length > 0) break;
      }
    }

    return rooms;
  });
}

async function extractAllRoomsWithStatus(page) {
  return await page.evaluate(() => {
    const rooms = [];

    const cardSelectors = [
      '.room-card',
      '.meeting-room-card',
      '[data-testid*="room"]',
      '.room-item'
    ];

    for (const selector of cardSelectors) {
      const cards = document.querySelectorAll(selector);
      if (cards.length > 0) {
        cards.forEach(card => {
          const isUnavailable = card.classList.contains('unavailable') ||
                               card.querySelector('.unavailable, .booked, [class*="indisponível"]');

          const room = {
            name: card.querySelector('.room-name, [class*="name"], h3, h4')?.innerText?.trim() || '',
            floor: card.querySelector('.floor, [class*="floor"], [class*="andar"]')?.innerText?.trim() || '',
            capacity: card.querySelector('.capacity, [class*="capacity"], [class*="pessoas"]')?.innerText?.trim() || '',
            properties: Array.from(card.querySelectorAll('.property, [class*="property"], .tag')).map(p => p.innerText?.trim()).filter(Boolean),
            available: !isUnavailable,
            bookedBy: isUnavailable ? card.querySelector('.booked-by, [class*="reservado"], [class*="booked"]')?.innerText?.trim() || 'Unknown' : null,
            nextAvailable: card.querySelector('.next-available, [class*="próximo"]')?.innerText?.trim() || null
          };

          if (room.name) {
            rooms.push(room);
          }
        });

        if (rooms.length > 0) break;
      }
    }

    return rooms;
  });
}

async function selectFirstAvailableRoom(page) {
  return await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
      if (button.innerText.includes('SELECIONAR') || button.innerText.includes('Select')) {
        // Check if parent card is not unavailable
        let parent = button.parentElement;
        let attempts = 0;
        while (parent && attempts < 5) {
          if (parent.classList.contains('unavailable') || parent.querySelector('.unavailable')) {
            break;
          }
          if (parent.classList.contains('room-card') || parent.classList.contains('meeting-room-card')) {
            const name = parent.querySelector('.room-name, [class*="name"]')?.innerText?.trim() || '';
            const floor = parent.querySelector('.floor, [class*="floor"]')?.innerText?.trim() || '';
            button.click();
            return { name, floor, selected: true };
          }
          parent = parent.parentElement;
          attempts++;
        }
      }
    }
    return null;
  });
}

async function fillBookingForm(page, titulo, pessoas) {
  await page.evaluate((title, people) => {
    // Fill title
    const titleInput = document.querySelector('input[name="titulo"], input[placeholder*="título" i], input[placeholder*="title" i]');
    if (titleInput) {
      titleInput.focus();
      titleInput.click();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, title);
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Fill people count if field exists
    if (people) {
      const peopleInput = document.querySelector('input[name="pessoas"], input[placeholder*="pessoas" i], input[placeholder*="people" i]');
      if (peopleInput) {
        peopleInput.focus();
        peopleInput.click();
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, people.toString());
        peopleInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, titulo, pessoas);

  await page.waitForTimeout(1000);
}

async function setRecurrence(page, recorrencia, ocorrencias) {
  await page.evaluate((rec, occ) => {
    // Find recurrence dropdown
    const select = document.querySelector('select[name="recorrencia"], select[name="recurrence"]');
    if (select) {
      select.value = rec;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Find occurrences input
    const occInput = document.querySelector('input[name="ocorrencias"], input[name="occurrences"]');
    if (occInput) {
      occInput.value = occ;
      occInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, recorrencia, ocorrencias);

  await page.waitForTimeout(1000);
}

async function confirmBooking(page) {
  try {
    // Click finalize button
    const finalizeSelectors = [
      'button:has-text("Finalizar")',
      'button:has-text("Confirmar")',
      'button:has-text("Reservar")',
      'button[type="submit"]'
    ];

    for (const selector of finalizeSelectors) {
      const button = await page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForTimeout(2000);
        break;
      }
    }

    // Check for terms confirmation
    const termsSelectors = [
      'input[type="checkbox"]',
      'button:has-text("CONFIRMO")',
      'button:has-text("Li e estou de acordo")'
    ];

    for (const selector of termsSelectors) {
      const element = await page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        await element.click();
        await page.waitForTimeout(1000);
      }
    }

    // Check for success message
    const success = await page.evaluate(() => {
      const pageText = document.body.innerText;
      return pageText.includes('sucesso') ||
             pageText.includes('success') ||
             pageText.includes('confirmada') ||
             pageText.includes('confirmed');
    });

    return success;
  } catch (e) {
    console.error('Confirm booking error:', e);
    return false;
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
    name: 'deskbee-server',
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
        name: 'deskbee_navigate',
        description: 'Navigate to DeskBee home page',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'deskbee_list_my_bookings',
        description: 'List all my active bookings',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'deskbee_check_availability',
        description: 'Check available rooms for a specific date and time',
        inputSchema: {
          type: 'object',
          properties: {
            data: {
              type: 'string',
              description: 'Date in DD/MM/YYYY format'
            },
            hora_inicio: {
              type: 'string',
              description: 'Start time in HH:MM format (09:00-20:00)'
            },
            hora_fim: {
              type: 'string',
              description: 'End time in HH:MM format (09:00-20:00)'
            },
            pessoas: {
              type: 'number',
              description: 'Number of people (optional)'
            },
            andar: {
              type: 'string',
              description: 'Preferred floor (optional)'
            },
            propriedades: {
              type: 'array',
              items: { type: 'string' },
              description: 'Room properties like TV, Videoconferência (optional)'
            }
          },
          required: ['data', 'hora_inicio', 'hora_fim']
        }
      },
      {
        name: 'deskbee_book_room',
        description: 'Book a room for a meeting',
        inputSchema: {
          type: 'object',
          properties: {
            titulo: {
              type: 'string',
              description: 'Meeting title'
            },
            data: {
              type: 'string',
              description: 'Date in DD/MM/YYYY format'
            },
            hora_inicio: {
              type: 'string',
              description: 'Start time in HH:MM format'
            },
            hora_fim: {
              type: 'string',
              description: 'End time in HH:MM format'
            },
            pessoas: {
              type: 'number',
              description: 'Number of people (optional)'
            },
            andar: {
              type: 'string',
              description: 'Preferred floor (optional)'
            },
            propriedades: {
              type: 'array',
              items: { type: 'string' },
              description: 'Room properties (optional)'
            }
          },
          required: ['titulo', 'data', 'hora_inicio', 'hora_fim']
        }
      },
      {
        name: 'deskbee_book_recurrent',
        description: 'Create a recurrent room booking (daily or weekly)',
        inputSchema: {
          type: 'object',
          properties: {
            titulo: {
              type: 'string',
              description: 'Meeting title'
            },
            data_inicial: {
              type: 'string',
              description: 'Start date in DD/MM/YYYY format'
            },
            hora_inicio: {
              type: 'string',
              description: 'Start time in HH:MM format'
            },
            hora_fim: {
              type: 'string',
              description: 'End time in HH:MM format'
            },
            recorrencia: {
              type: 'string',
              description: 'Recurrence type: Diariamente or Semanalmente'
            },
            ocorrencias: {
              type: 'number',
              description: 'Number of occurrences (max 4)'
            },
            pessoas: {
              type: 'number',
              description: 'Number of people (optional)'
            },
            andar: {
              type: 'string',
              description: 'Preferred floor (optional)'
            }
          },
          required: ['titulo', 'data_inicial', 'hora_inicio', 'hora_fim', 'recorrencia', 'ocorrencias']
        }
      },
      {
        name: 'deskbee_generate_report',
        description: 'Generate a full report of all rooms and their bookings for a specific time period',
        inputSchema: {
          type: 'object',
          properties: {
            data: {
              type: 'string',
              description: 'Date in DD/MM/YYYY format'
            },
            hora_inicio: {
              type: 'string',
              description: 'Start time in HH:MM format'
            },
            hora_fim: {
              type: 'string',
              description: 'End time in HH:MM format'
            }
          },
          required: ['data', 'hora_inicio', 'hora_fim']
        }
      },
      {
        name: 'deskbee_close',
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
      case 'deskbee_navigate':
        result = await navigateToDeskBee();
        break;

      case 'deskbee_list_my_bookings':
        result = await listMyBookings();
        break;

      case 'deskbee_check_availability':
        result = await checkAvailability(
          args.data,
          args.hora_inicio,
          args.hora_fim,
          args.pessoas,
          args.andar,
          args.propriedades || []
        );
        break;

      case 'deskbee_book_room':
        result = await bookRoom(
          args.titulo,
          args.data,
          args.hora_inicio,
          args.hora_fim,
          args.pessoas,
          args.andar,
          args.propriedades || []
        );
        break;

      case 'deskbee_book_recurrent':
        result = await bookRecurrent(
          args.titulo,
          args.data_inicial,
          args.hora_inicio,
          args.hora_fim,
          args.recorrencia,
          args.ocorrencias,
          args.pessoas,
          args.andar
        );
        break;

      case 'deskbee_generate_report':
        result = await generateReport(
          args.data,
          args.hora_inicio,
          args.hora_fim
        );
        break;

      case 'deskbee_close':
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
  console.error('DeskBee MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
