---
name: mcp-didi
description: "Pending DiDi internal MCPs implementation (Shumeng, Apollo UI, Apollo Go)"
metadata:
  node_type: memory
  type: project
  date: 2026-07-28
  source: mcp-hub-analysis
  originSessionId: fdf7ca17-4371-4fb0-a11c-c253499a6065
---

# DiDi Internal MCPs - Pending

List of MCPs from DiDi internal Hub (https://mcphub.intra.xiaojukeji.com) awaiting implementation.

---

## Status Overview

| Category | Status | Items |
|----------|--------|-------|
| **Priority MCPs** | ⏳ **PENDING** | 3/3 |

**Note**: All public MCPs and priority skills have been implemented on 2026-07-28. Only DiDi internal MCPs remain, requiring specific access/credentials.

---

## Pending MCPs

### 1. 数梦MCP (Shumeng/Data Dream) ⏳ PENDING
Access to DiDi's data/analytics platform.

- **Access**: Via MCP Hub with `project-code` and `Authorization Bearer`
- **Why**: Internal datasets, operational metrics
- **Status**: ⏳ Awaiting access credentials
- **Blocker**: Requires internal authentication token

### 2. Apollo MCP (UI API) ⏳ PENDING
Query Apollo configurations (config center) via Cookie SSO.

- **Tools**: `query_apollo_item`, `list_apollo_enviroments`, `init`, `list_keys`, `get_config`
- **Status**: ⏳ Awaiting SSO access
- **Blocker**: Requires internal authentication cookie

### 3. Apollo MCP (Go) ⏳ PENDING
More complete version with Hive, DISF, Odin queries.

- **Install**: `npx -y --registry=http://npm.intra.xiaojukeji.com/ @didi/mcp-server@latest`
- **Extra features**:
  - `query_hive_table_schema`
  - `query_app_detail`
  - `query_disf_detail`
  - `query_disf_topology`
- **Status**: ⏳ Awaiting access to internal registry
- **Blocker**: Requires VPN + DiDi internal npm registry

---

## Implementation Checklist

- [ ] Obtain `project-code` and Bearer token for Shumeng
- [ ] Configure Cookie SSO for Apollo UI API
- [ ] Access internal npm registry (`npm.intra.xiaojukeji.com`)
- [ ] Validate connectivity via DiDi VPN
- [ ] Create corresponding skills in `.claude/skills/`

---

## History

- **2026-07-23**: Initial identification of MCPs in DiDi Hub
- **2026-07-28**: All public MCPs and skills implemented
- **2026-07-28**: File renamed from `mcp-adoption-backlog` → `mcp-didi` and moved to `incubator/backlog/`

---

## Related Files

- Original complete analysis: `temp-storage/mcp-hub-analysis-report.md`
- Implemented skills: see `MEMORY.md` or `.claude/skills/`
