# Detailed Guide - DevTools Network Tab

## Where is "Preserve Log"

DevTools can appear in different positions. See how to find it in each case:

---

## Layout 1: DevTools at the Bottom (default)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Chrome - Gattaran                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │                    SITE CONTENT                                 │   │
│  │                                                                 │   │
│  │                                                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  DevTools                                                    ▲  │   │
│  │  ┌──────────────────────────────────────────────────────────┐ │   │
│  │  │ Elements Console Sources Network ► Performance ...       │ │   │
│  │  │                               ▲                          │ │   │
│  │  │                     CLICK HERE (Network tab)             │ │   │
│  │  └──────────────────────────────────────────────────────────┘ │   │
│  │                                                                │   │
│  │  [🔴 Recording] [🚫 Clear] [Filter] [Preserve log ☐] [Disable │   │
│  │                                               ▲                │   │
│  │                     CHECKBOX "Preserve log" IS HERE           │   │
│  │                     (may be written in full or be             │   │
│  │                      just a circle icon)                      │   │
│  │                                                                │   │
│  │  Name          Status    Type      Size    Time               │   │
│  │  ────────────────────────────────────────────────              │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Layout 2: Network Toolbar

```
┌─────────────────────────────────────────────────────────────────────────┐
│  NETWORK TAB TOP TOOLBAR                                                │
│                                                                          │
│  ┌─────┬─────┬─────────────────┬──────────────────┬─────────────────┐   │
│  │ 🔴  │ 🚫  │ Filter: [ All ▼ ]│ [ Preserve log ] │ [ Disable cache]│   │
│  │Rec  │Clear│                  │       ☐         │       ☐         │   │
│  └─────┴─────┴─────────────────┴──────────────────┴─────────────────┘   │
│     ▲    ▲                              ▲                   ▲          │
│     │    │                              │                   │          │
│     │    │                              │                   └── CHECK  │
│     │    │                              │                              │
│     │    │                              └── CHECK THIS BOX             │
│     │    │                                                              │
│     │    └── Clears old logs                                            │
│     │                                                                    │
│     └── Indicates recording (red = recording)                            │
│                                                                          │
│  ☑️ = Checkbox checked                                                   │
│  ☐ = Checkbox unchecked ← (click to check)                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Exact Location of Elements

### Step 1: Open DevTools and go to Network

```
┌──────────────────────────────────────────────────────────┐
│  Shortcut keys:                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │    F12      │  │ Ctrl+Shift+I│  │  Cmd+Option+I   │  │
│  │  (Windows)  │  │  (Windows)  │  │     (Mac)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                          │
│  After opening, click on the tab: "Network"             │
│                                                          │
│  ┌────────┬────────┬──────────┬────────┬─────────┐      │
│  │Elements│Console │► Network │ Sources│ ...     │      │
│  └────────┴────────┴──────────┴────────┴─────────┘      │
│                           ▲                              │
│                     CLICK HERE                           │
└──────────────────────────────────────────────────────────┘
```

### Step 2: Find "Preserve log"

**Option A - Full text:**
```
In the Network toolbar, look for:

☐ Preserve log

Click the box to make it: ☑️ Preserve log
```

**Option B - Icon only (if screen is small):**
```
Hover over the icons in the toolbar until you find one that shows
the tooltip "Preserve log" when hovering.

It can be a circle icon or a page with a symbol.
```

**Option C - 3 dots menu (⋮):**
```
If you can't find it in the main toolbar:

┌────────────────────────────────────────┐
│  Network                           [⋮] │  ← CLICK THE 3 DOTS
│  ┌──────────────────────────────────┐  │
│  │  ☐ Preserve log                  │  │
│  │  ☐ Disable cache                 │  │
│  │  ☐ Offline                       │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## Different Chrome Versions

### Old Chrome (before 2020):
```
The toolbar looks like this:

[🔴] [🚫] [Filter] [☐ Preserve Log] [☐ Disable Cache] [Offline ▼]
                                        ▲
                                   IT'S HERE
```

### New Chrome (2021+):
```
It may be in a dropdown menu:

┌───────────────────────────────────────┐
│  [🔴] [🚫] [Filter ▼] [More ▼]       │
│                            ▲          │
│                     CLICK HERE        │
│                                       │
│  Menu that opens:                     │
│  ├── ☐ Preserve log                   │
│  ├── ☐ Disable cache                  │
│  └── ...                              │
└───────────────────────────────────────┘
```

---

## Visual Checklist

After configuring, it should look like this:

```
┌──────────────────────────────────────────────────────────┐
│  Network                                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔴 Recording   🚫 Clear   Filter   ☑️ Preserve log │  │
│  │                                    ☑️ Disable cache│  │
│  └────────────────────────────────────────────────────┘  │
│                         ▲        ▲                       │
│                         │        │                       │
│                    CHECKED    CHECKED                    │
│                                                          │
│  [ All  XHR  JS  CSS  Img  Media  Font  Doc  WS  Other] │
│         ▲                                                │
│   CLICK ON "XHR" (or "Fetch/XHR")                        │
│                                                          │
│  Name              Status   Type     Size    Time        │
│  ─────────────────────────────────────────────────       │
│  (call list will appear here)                            │
└──────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### "I can't see the toolbar"
```
Press Ctrl + + (zoom in) in DevTools to increase the size,
or drag the DevTools border up to increase the height.
```

### "There are no checkboxes, only icons"
```
Hover over each icon and wait for the tooltip (explanatory text) to appear.
Look for:
- "Preserve log"
- "Persist logs"
- "Do not clear log on page reload"
```

### "I still can't find it"
```
Alternative: YOU DON'T NEED to check Preserve log if you do everything
in a quick sequence without reloading the page:

1. Open DevTools → Network
2. CLEAR the log (click on 🚫)
3. DO the order search
4. CLICK on the order link
5. The logs will be there (don't close DevTools)
```

---

## Action Summary

| Order | Action | Where |
|-------|--------|-------|
| 1 | Open DevTools | `F12` or `Ctrl+Shift+I` |
| 2 | Go to Network | "Network" tab at the top |
| 3 | Clear logs | 🚫 button (circle with a line) |
| 4 | Filter XHR | Click on "XHR" or "Fetch/XHR" |
| 5 | Preserve logs | ☑️ "Preserve log" (if you find it) |
| 6 | Do the search | In Gattaran normally |
| 7 | Capture calls | See the list that appears |

---

## Send me this

If you still have difficulty, send me:
1. A **screenshot** of your DevTools on the Network tab (I can identify where it is)

Or simply:
2. **Don't use Preserve log** - just clear the log before searching and don't close DevTools until you copy the calls.
