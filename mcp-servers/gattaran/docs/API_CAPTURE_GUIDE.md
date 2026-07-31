# API Capture Guide - Gattaran

## Objective
Capture the REST endpoints that Gattaran uses to search orders and display details.

---

## Step by Step

### 1. Open DevTools

```
┌─────────────────────────────────────────────────────────────┐
│  Chrome - Gattaran                                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │   Press F12 or Ctrl+Shift+I                           │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Actions:**
- With Gattaran open, press `F12` (or `Ctrl+Shift+I`)
- DevTools will open (usually at the bottom or side)

---

### 2. Configure DevTools

```
┌─────────────────────────────────────────────────────────────┐
│  DevTools                                                   │
│  ┌──────────┬──────────┬──────────┬──────────┬────────────┐ │
│  │ Elements │ Console  │► Network │ Sources  │ ...        │ │
│  └──────────┴──────────┴──────────┴──────────┴────────────┘ │
│                                                             │
│  ☑️ Preserve log  [CHECK THIS BOX]                          │
│  ☑️ Disable cache [CHECK THIS BOX]                          │
│                                                             │
│  Filter: [ All  XHR  JS  CSS  Img  Media  Font  Doc  WS ]  │
│                    ▲                                        │
│                    │                                        │
│            CLICK ON "XHR" (shows only API calls)            │
└─────────────────────────────────────────────────────────────┘
```

**Actions:**
1. Click on the **Network** tab
2. Check the **"Preserve log"** box (circle at the top)
3. Check the **"Disable cache"** box
4. Click on the **"XHR"** or **"Fetch/XHR"** filter (isolates only API calls)

---

### 3. Clear Previous Logs

```
┌─────────────────────────────────────────────────────────┐
│  Network                                                │
│                                                         │
│  [ 🚫 Clear ]  [ ⏯️ ]  [ 🔴 Recording ]                │
│     ▲                                                   │
│     │                                                   │
│  CLICK THE "🚫" TO CLEAR OLD LOGS                      │
│                                                         │
│  Name          Status    Type      Size    Time         │
│  ────────────────────────────────────────────────       │
│  (empty list or with old calls)                         │
└─────────────────────────────────────────────────────────┘
```

**Actions:**
- Click the **🚫 Clear** button (circle with a line) to clear old logs

---

### 4. Navigate to Order Management

```
┌─────────────────────────────────────────────────────────┐
│  Gattaran                                               │
│                                                         │
│  [Side Menu]          [Main Content]                   │
│                                                         │
│  ▶ City Services          (work area)                  │
│    ▶ Transaction Management                             │
│      ▶ Order Management  ← CLICK HERE                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Actions:**
- Navigate: **City Services → Transaction Management → Order Management**
- Wait for the page to load completely

---

### 5. Search for the Order

```
┌─────────────────────────────────────────────────────────┐
│  Order Management                                       │
│                                                         │
│  Order ID:   [________________]                         │
│                  ▲                                      │
│                  5764678584400678506                    │
│                                                         │
│  Current City: [________________]                       │
│                  ▲                                      │
│                  São Paulo                              │
│                                                         │
│           [ 🔍 Search ]  ← CLICK                        │
│                 ▲                                       │
│    (BEFORE CLICKING, MAKE SURE DEVTOOLS                 │
│     IS OPEN AND ON THE NETWORK TAB)                     │
└─────────────────────────────────────────────────────────┘
```

**Actions:**
1. Fill in **Order ID**: `5764678584400678506`
2. Fill in **Current City**: `São Paulo`
3. **STOP!** Make sure DevTools is open on the Network tab
4. Click **Search**

---

### 6. Capture Search Endpoint

```
┌─────────────────────────────────────────────────────────┐
│  DevTools - Network                                     │
│                                                         │
│  Name              Status   Type     Size    Time       │
│  ─────────────────────────────────────────────────      │
│  ▶ searchOrders    200      xhr      2.3KB   450ms     │
│  ▶ getCityList     200      xhr      890B    120ms     │
│  ▶ ...                                         ▲        │
│                                                │        │
│         LOOK FOR SOMETHING LIKE:               │        │
│         - "searchOrders"                       │        │
│         - "orderSearch"                        │        │
│         - "queryOrder"                         │        │
│         - URL with "order" in the path         │        │
└─────────────────────────────────────────────────────────┘
```

**Actions:**
- Look at the call list
- Look for a call related to search (likely with "search", "query", "list" in the name)
- Click on the call to see details

---

### 7. View Search Endpoint Details

```
┌─────────────────────────────────────────────────────────────┐
│  Call Details (below the list)                              │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │ Headers  │ Payload  │ Preview  │ Response │              │
│  └──────────┴──────────┴──────────┴──────────┘              │
│                                                             │
│  ## Headers Tab:                                            │
│  Request URL: https://gattaran.didi-food.com/api/...        │
│  Request Method: POST (or GET)                              │
│                                                             │
│  ## Payload Tab (if POST):                                  │
│  {                                                          │
│    "orderId": "5764678584400678506",                        │
│    "city": "São Paulo"                                      │
│    ...                                                      │
│  }                                                          │
│                                                             │
│  ## Response Tab:                                           │
│  {                                                          │
│    "code": 0,                                               │
│    "data": {                                                │
│      "orders": [...]                                        │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

**Actions:**
1. Click on the search call
2. Go to **Headers** tab - copy:
   - `Request URL`
   - `Request Method` (GET/POST)
3. Go to **Payload** tab (if POST) or **Query String Parameters** (if GET)
4. Go to **Response** tab - see the return format

---

### 8. Click on the Order Link

```
┌─────────────────────────────────────────────────────────┐
│  Search Result                                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Order ID          │ Status  │ ...               │    │
│  ├───────────────────┼─────────┼───────────────────┤    │
│  │ 57646785844006... │ Active  │ ...               │    │
│  │       ▲           │         │                   │    │
│  │   [CLICKABLE LINK]│         │                   │    │
│  │       │           │         │                   │    │
│  │   CLICK HERE      │         │                   │    │
│  └───────┼───────────────────────────────────────────┘    │
│          │                                                │
│          ▼                                                │
│  (will open details in new tab or modal)                  │
└─────────────────────────────────────────────────────────┘
```

**Actions:**
1. Click on the **Order ID hyperlink** in the results table
2. Wait for the details tab/modal to open

---

### 9. Capture Details Endpoint

```
┌─────────────────────────────────────────────────────────┐
│  DevTools - Network (new calls will appear)             │
│                                                         │
│  Name              Status   Type     Size    Time       │
│  ─────────────────────────────────────────────────      │
│  ▶ searchOrders    200      xhr      2.3KB   450ms     │
│  ▶ getOrderDetail  200      xhr      5.1KB   320ms  ◄── NEW!
│  ▶ getMerchantInfo 200      xhr      1.2KB   180ms  ◄── NEW!
│  ▶ ...                                                  │
│                                                         │
│  LOOK FOR:                                              │
│  - "detail"                                             │
│  - "getOrder"                                           │
│  - "orderInfo"                                          │
│  - "view"                                               │
└─────────────────────────────────────────────────────────┘
```

**Actions:**
- New calls will appear in the list
- Look for calls related to details
- Click to see the details of each one

---

### 10. Export to Me

**Option A: Screenshots of calls**
- Take screenshots of the Headers + Payload + Response tabs of the main calls

**Option B: Export as HAR**
```
┌─────────────────────────────────────────────────────────┐
│  DevTools                                               │
│                                                         │
│  Right-click on the call list →                         │
│  "Save all as HAR with content"                         │
│                                                         │
│  Save as: gattaran-api-capture.har                      │
└─────────────────────────────────────────────────────────┘
```

---

## Checklist - What I need

Send me information about these calls:

### Call 1: Order Search
- [ ] Complete URL
- [ ] Method (GET/POST)
- [ ] Headers (especially `Authorization` if present)
- [ ] Payload/Parameters
- [ ] Response example

### Call 2: Order Details
- [ ] Complete URL
- [ ] Method (GET/POST)
- [ ] Headers
- [ ] Payload/Parameters
- [ ] Response example

---

## Format to Send

You can send:
1. **Screenshots** of the Headers/Payload/Response tabs
2. **HAR file** (exported from DevTools)
3. **Curl** (right-click on call → Copy → Copy as cURL)

**Example of how to copy as cURL:**
```
Right-click on call → Copy → Copy as cURL (bash)
```

This gives me everything I need in a single command!

---

## Questions?

If you have any questions during the process, call me!
