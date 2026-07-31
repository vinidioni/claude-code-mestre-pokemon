# Gattaran Automation Plan - Batch Processing

## Current Problem
- Browser automation requires manual login at each execution
- Does not scale for order volume
- Depends on UI that may change

## Proposed Solution: API-First Approach

### Phase 1: API Reverse Engineering (Immediate)
Instead of automating the browser, let's discover and use the REST APIs that Gattaran uses internally.

**How to do it:**
1. Open Gattaran in Chrome DevTools (F12)
2. Go to Network tab
3. Log in and search for an order
4. Capture the endpoints and payloads
5. Replicate the calls with fetch/axios

**Advantages:**
- ✅ Much faster (ms vs seconds)
- ✅ Does not depend on UI
- ✅ Easy to parallelize (process N orders simultaneously)
- ✅ Authentication via token (can be renewed automatically)

### Phase 2: Persistent Session System
```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Manual Login   │────▶│  Save JWT    │────▶│  Reuse          │
│  (1x per day)   │     │  / Cookies   │     │  until expires  │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

**Implementation:**
- Save tokens in local file (`.gattaran-session.json`)
- Check validity before each execution
- Automatic refresh if necessary

### Phase 3: Batch Processing Architecture
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  CSV/JSON    │────▶│  Queue       │────▶│  Workers     │────▶│  Results     │
│  with Orders │     │  (batches)   │     │  (parallel)  │     │  JSON/CSV    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Features:**
- Input: CSV with columns `order_id`, `city`
- Parallel processing (configurable: 5, 10, 20 concurrent)
- Automatic retry on error
- Rate limiting to not overload the API
- Export: JSON/CSV with all details

## Technical Options (choose one)

### Option A: API Reverse Engineering (Recommended)
**Time:** 2-4 hours to discover endpoints  
**Result:** Robust and fast system

**Steps:**
1. Capture network traffic in DevTools
2. Identify authentication and search endpoints
3. Create HTTP client with axios/fetch
4. Implement token system

### Option B: Playwright with Persistent State
**Time:** 1-2 hours  
**Result:** More fragile (depends on UI) but works

**How:**
- Save browser state (cookies, localStorage)
- Reuse in subsequent executions
- Only re-login when expired

### Option C: Chrome DevTools Protocol (CDP)
**Time:** 3-4 hours  
**Result:** Connect to already open and logged-in Chrome

**How:**
- Connect to `chrome://inspect`
- Use Puppeteer/Playwright with `connectOverCDP`
- Control already logged-in tab

## My Recommendation

Let's go with **Option A (API Reverse Engineering)**. It's the most professional and scalable path.

### Immediate Next Steps

1. **You do:**
   - Open Gattaran in Chrome
   - DevTools → Network tab
   - Log in
   - Search for an order (ex: 5764678584400678506)
   - Export as HAR or show me the captured endpoints

2. **I build:**
   - API client based on endpoints
   - Persistent authentication system
   - Batch processor with parallelism

### Final System Structure

```
gattaran/
├── src/
│   ├── api-client.js       # HTTP Client for Gattaran APIs
│   ├── auth-manager.js     # Token/session management
│   ├── batch-processor.js  # Batch processing
│   └── cli.js              # Command line interface
├── sessions/
│   └── .gattaran-token.json # Persisted token (gitignored)
├── input/
│   └── orders.csv          # CSV with orders to process
├── output/
│   └── results-YYYY-MM-DD.json
└── package.json
```

### Final Usage

```bash
# Single login (saves token)
npx gattaran-cli login

# Process one order
gattaran-cli search 5764678584400678506 "São Paulo"

# Process batch
gattaran-cli batch --input orders.csv --output results.json --concurrency 10

# Check session status
gattaran-cli status
```

---

**Which of the 3 options do you prefer?** I recommend A, but I can implement B or C if you find it more suitable.

**If you want to proceed with Option A**, please open DevTools in Gattaran, do an order search, and send me the endpoints that appear in the Network tab (can be a screenshot or exported as HAR).
