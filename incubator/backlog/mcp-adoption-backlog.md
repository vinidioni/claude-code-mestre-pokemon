# Backlog: MCP Adoption from DiDi MCP Hub

> Creation Date: 2026-07-23  
> Source: MCP Hub Analysis (https://mcphub.intra.xiaojukeji.com)  
> Priority: Medium  
> Status: 📋 Backlog

---

## Overview

This backlog contains MCPs identified in the internal DiDi MCP Hub that should be adopted/added to our DCC ecosystem to expand automation, integration, and productivity capabilities.

---

## 📦 Skills to Adopt (from Skillshub)

### S1. cooper + cooper-mcp-helper + cooper-image-read (Bundle)
| Field | Details |
|-------|---------|
| **Category** | Knowledge Management / DiDi Internal |
| **What it does** | Complete Cooper integration with helper utilities and image reading |
| **Components** | |
| | • **cooper**: 10 sub-skills (team spaces, knowledge bases, documents, spreadsheets, files, search, tags, comments, collaborators, recent resources) |
| | • **cooper-mcp-helper**: Parse Cooper/Shimo links, extract resourceId/knowledgeId/spaceId automatically |
| | • **cooper-image-read**: Extract and analyze images from Cooper documents (4-step pipeline: read → extract URLs → download → analyze) |
| **Installation** | `d-skills add cooper` + `d-skills add cooper-mcp-helper` + `d-skills add cooper-image-read` |
| **Motivation** | Enhance our current Cooper MCP with: high-level workflows, automatic ID extraction from links, image reading capability |
| **Status** | 🔴 High Priority |

**Implementation Notes:**
- Our current `cooper` MCP only does low-level API calls
- DiDi's `cooper` skill adds: hierarchical sub-skills, automatic routing, workflows
- `cooper-image-read` solves the problem that Cooper's readContent only returns text (images become URLs)
- **Action**: Study implementations, integrate features into our skill rather than using directly (DiDi internal)

---

### S2. smartwork-cli
| Field | Details |
|-------|---------|
| **Category** | Productivity / Collaboration |
| **What it does** | SmartWork workspace integration: D-Chat messages, Cooper, Calendar, Todo, Approvals |
| **Latest Features** | Download chat files, export chat lists, meeting transcripts, knowledge download, @ service accounts, share calendar/todo |
| **Installation** | `d-skills add smartwork-cli` |
| **Tags** | #dchat #dc #d-chat #cooper #doc #calendar #todo #im #message |
| **Motivation** | Compare D-Chat features with our current DChat MCP, potentially integrate additional capabilities |
| **Status** | 🟡 Medium Priority |

**Implementation Notes:**
- We already have DChat MCP - need to compare feature sets
- This skill may have more recent features (v0.8.20)
- Features to evaluate: file downloads, meeting capabilities, calendar sharing

---

### S3. prompt_beautifier
| Field | Details |
|-------|---------|
| **Category** | AI / Prompt Engineering |
| **What it does** | Convert natural language requirements into structured AI prompts with auto-execution support |
| **Workflow** | Natural language input → optimization rules → structured prompt → optional auto-execution |
| **Installation** | `d-skills add prompt_beautifier` |
| **Motivation** | Inspiration for prompt templates and optimization patterns |
| **Status** | 🟢 Backlog |

**Implementation Notes:**
- Not critical for immediate adoption
- Study optimization rules and patterns
- Can inspire our own prompt engineering workflows
- Reference for creating better prompt templates

---

## 📦 MCPs to Adopt

### 1. everything-search
| Field | Details |
|-------|---------|
| **Category** | System/Utility |
| **What it does** | Ultra-fast local file search across the operating system |
| **Technology** | Everything SDK (Windows), mdfind (Mac), locate (Linux) |
| **Installation** | `uvx mcp-server-everything-search` |
| **Environment Variable** | `EVERYTHING_SDK_PATH` |
| **Motivation** | Search files locally (logs, configs, documents) |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- Requires Everything installation on Windows
- For Mac uses native mdfind (Spotlight)
- For Linux requires plocate

---

### 2. Playwright MCP (Microsoft)
| Field | Details |
|-------|---------|
| **Category** | Web Automation |
| **What it does** | Browser automation via Playwright with 19 tools |
| **Tools** | Navigate, click, screenshot, upload, fill forms, extract data, resize, wait |
| **Installation** | `npx @playwright/mcp@latest` |
| **Motivation** | Replace/update our `intranet-fetcher` skill |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- ⚠️ **Important**: Keep authentication functionality from our current skill
- Our current skill handles DiDi intranet SSO (cookies, manual login)
- Playwright MCP official doesn't have interactive auth - we need to adapt or keep our version for intranet
- Possible solution: Use Playwright MCP for public sites, keep our skill for intranet

---

### 3. GitHub MCP (Official)
| Field | Details |
|-------|---------|
| **Category** | DevTools |
| **What it does** | 26 tools for GitHub API |
| **Tools** | Create/update files, create repos, search, issues, PRs, commits |
| **Installation** | `npx -y @modelcontextprotocol/server-github` |
| **Token** | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| **Motivation** | Replace current basic GitHub configuration |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- We already have GitHub configured via npx in `.mcp.json`
- Verify if this has more features than current setup
- Compare before replacing

---

### 4. GitLab MCP (Official)
| Field | Details |
|-------|---------|
| **Category** | DevTools |
| **What it does** | 9 tools for GitLab API |
| **Tools** | Create/update files, search repos, create projects, read content |
| **Installation** | `npx -y @modelcontextprotocol/server-gitlab` |
| **Variables** | `GITLAB_API_URL`, `GITLAB_PERSONAL_ACCESS_TOKEN` |
| **Motivation** | If DiDi uses internal GitLab |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- Verify if DiDi uses GitLab internally (likely yes)
- Need internal GitLab URL
- Personal access token from GitLab

---

### 5. Google Drive MCP
| Field | Details |
|-------|---------|
| **Category** | Productivity/Storage |
| **What it does** | Search files in Google Drive |
| **Installation** | `npx -y @modelcontextprotocol/server-gdrive` |
| **Motivation** | Complement our Google Workspace (which already has Gmail/Calendar) |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- Our Google Workspace MCP currently covers Gmail and Calendar
- This would add file search capability in Drive
- May have overlap - verify if worth it

---

### 6. Google Maps MCP
| Field | Details |
|-------|---------|
| **Category** | Maps/Geolocation |
| **What it does** | 7 tools: geocode, reverse geocode, search places, place details, distance matrix, elevation, directions |
| **Installation** | `npx -y @modelcontextprotocol/server-google-maps` |
| **Token** | `GOOGLE_MAPS_API_KEY` |
| **Motivation** | Route analysis, geographic data for reports |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- Requires Google Maps API Key (free with limits)
- Useful for DiDi operational reports
- Complements DiDi-MCP-Server (which also has maps)

---

### 7. 数梦MCP (Shumeng/Data Dream)
| Field | Details |
|-------|---------|
| **Category** | DiDi Internal - Data |
| **What it does** | Access to DiDi's data/analytics platform |
| **Access** | Via MCP Hub with project-code and Authorization Bearer |
| **Motivation** | Access internal datasets, operational metrics, business data |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- Already integrated in "数小智开发Agent" (DiDi dev copilot)
- Requires specific project-code
- Needs API key authentication

---

### 8. Apollo MCP (UI API)
| Field | Details |
|-------|---------|
| **Category** | DiDi Internal - Configuration |
| **What it does** | Query Apollo configurations (config center) via Cookie SSO |
| **Tools** | query_apollo_item, list_apollo_enviroments, init, list_keys, get_config |
| **Access** | Via MCP Hub with intranet SSO authentication |
| **Motivation** | View service configs, environments, microservice parameters |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- Requires intranet SSO authentication
- Useful for devs working with microservices

---

### 9. Apollo MCP (Go)
| Field | Details |
|-------|---------|
| **Category** | DiDi Internal - Configuration |
| **What it does** | More complete Go version of Apollo MCP |
| **Tools** | query_apollo_item, list_apollo_enviroments, query_hive_table_schema, query_app_detail, query_disf_detail, query_disf_topology |
| **Installation** | `npx -y --registry=http://npm.intra.xiaojukeji.com/ @didi/mcp-server@latest` |
| **Motivation** | Access configs + Hive schemas + app details + DISF routes |
| **Status** | 🟡 Pending |

**Implementation Notes:**
- More complete than UI API version
- Includes Hive schema queries (useful for data engineers)
- Requires DiDi internal npm registry

---

## 📋 Implementation Checklist

### Phase 1: Preparation
- [ ] Verify which MCPs are already partially configured
- [ ] List required tokens/environment variables
- [ ] Document credential acquisition process

### Phase 2: Installation (Priority Order)
1. [ ] `everything-search` - Test local search
2. [ ] `playwright` - Evaluate replacing current skill
3. [ ] `github` - Compare with current config
4. [ ] `gitlab` - Confirm internal DiDi usage
5. [ ] `google-drive` - Evaluate overlap with Workspace
6. [ ] `google-maps` - Obtain API key
7. [ ] `数梦MCP` - Obtain project-code and API key
8. [ ] `apollo-mcp` (Go) - Test internal npm registry

### Phase 3: Validation
- [ ] Test each MCP individually
- [ ] Document use cases
- [ ] Create usage examples

---

## 🔗 Reference Links

### MCP Hub (mcphub.intra.xiaojukeji.com)
- DiDi MCP Hub: https://mcphub.intra.xiaojukeji.com
- everything-search: https://mcphub.intra.xiaojukeji.com/square/everything-search
- Playwright MCP: https://mcphub.intra.xiaojukeji.com/square/playwright
- GitHub MCP: https://mcphub.intra.xiaojukeji.com/square/github
- GitLab MCP: https://mcphub.intra.xiaojukeji.com/square/gitlab
- Google Drive MCP: https://mcphub.intra.xiaojukeji.com/square/google-drive
- Google Maps MCP: https://mcphub.intra.xiaojukeji.com/square/google-maps
- 数梦MCP (Shumeng): https://mcphub.intra.xiaojukeji.com/square/%E6%95%B0%E6%A2%A6MCP
- Apollo MCP: https://mcphub.intra.xiaojukeji.com/square/apollo-mcp
- Apollo MCP (Go): https://mcphub.intra.xiaojukeji.com/square/Apollo-mcp

### Skillshub (skillshub.intra.xiaojukeji.com)
- cooper: https://skillshub.intra.xiaojukeji.com/skill/cooper
- cooper-mcp-helper: https://skillshub.intra.xiaojukeji.com/skill/cooper-mcp-helper
- cooper-image-read: https://skillshub.intra.xiaojukeji.com/skill/cooper-image-read
- smartwork-cli: https://skillshub.intra.xiaojukeji.com/skill/smartwork-cli
- prompt_beautifier: https://skillshub.intra.xiaojukeji.com/skill/prompt_beautifier

### Documentation
- Authentication docs: 《AI身份认证用户使用手册》
- Complete MCP analysis: `temp-storage/mcp-hub-analysis-report.md`
- Complete Skillshub analysis: `temp-storage/skillshub-analysis-report.md`

---

## Notes

- Created: 2026-07-23
- Owner: [TBD]
- Dependencies: DiDi intranet access (VPN), API tokens
