# DChat Skills

> **Status:** ⚪ Not Started  
> **Priority:** Medium  
> **Created:** 2026-07-23

---

## 🎯 Context

Create modular skills for integration with D-Chat MCP, enabling communication automation via natural triggers in Claude Code.

---

## 💡 Proposal

Develop 3 main skills to automate communication via DChat:

### 1. `dchat-send`
**Trigger:** "send message", "send message in chat", "notify"

**What it does:**
- Sends messages to users or groups
- Supports formatting (text, markdown)
- Preview before sending (dry-run)
- Automatic recipient validation

**Usage example:**
```
User: "Send a message to Mauro saying the meeting was postponed"
Claude: [Uses dchat-send skill with target="maurojunior", message="Meeting postponed to..."]
```

### 2. `dchat-notify`
**Trigger:** "notify team", "alert channel", "warn group"

**What it does:**
- Sends notifications to specific channels
- Common message templates
- Mentions users when necessary
- Attaches contextual information

**Usage example:**
```
User: "Notify the AI team about project completion"
Claude: [Uses dchat-notify skill with target="SSI AI Initiatives", message="..."]
```

### 3. `dchat-search`
**Trigger:** "search message", "search in chat", "find conversation"

**What it does:**
- Searches message history
- Filters by date, user, content
- Incremental search with cache
- Returns formatted results

**Usage example:**
```
User: "Search in chat 'SSI AI' messages about 'meeting' last week"
Claude: [Uses dchat-search skill with chat="SSI AI Initiatives", query="meeting", since="last_week"]
```

---

## 📋 Action Plan

### Phase 1: Analysis
- [ ] Review all tools available in MCP DChat
- [ ] Identify most common use cases
- [ ] Define skill triggers and rules
- [ ] Document integration points

### Phase 2: Skill Development
- [ ] Create `skill-rules.json` entries
- [ ] Develop `SKILL.md` for each skill:
  - `dchat-send/SKILL.md`
  - `dchat-notify/SKILL.md`
  - `dchat-search/SKILL.md`
- [ ] Create `examples.md` with usage scenarios
- [ ] Test triggers and functionality

### Phase 3: Integration
- [ ] Register skills in `.claude/skills/`
- [ ] Update main `skill-rules.json`
- [ ] Test end-to-end workflows
- [ ] Document in main docs

### Phase 4: Documentation
- [ ] Add skills to main documentation
- [ ] Create usage examples
- [ ] Update MCP servers README
- [ ] Share with team

---

## 🔗 Dependencies

- **MCP DChat**: Must be active and configured
- **Tools required:**
  - `send_message`
  - `search_messages`
  - `list_chats`
  - `get_chat_info`

---

## 📚 Resources

- [MCP DChat Documentation](../mcp-servers/dchat/README.md)
- [Skills Development Guide](../.claude/skills/CLAUDE.md)
- [Skill Rules](../.claude/skills/skill-rules.json)

---

## 📝 Notes

- Skills should be natural and conversational
- Always confirm before sending messages (safety)
- Support for dry-run mode
- Cache frequently used chat IDs

---

**Next Review:** TBD
