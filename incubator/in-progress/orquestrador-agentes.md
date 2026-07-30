# Project: Agent Orchestrator

> **Status:** ⚪ Not Started  
> **Start:** -  
> **End:** -

---

## 🎯 Context + Idea

**Problem:** Users don't know all available agents in DCC and end up not using powerful resources like `code-review`, `security-audit`, `doc-generator`, etc. Discovery is manual and depends on reading documentation.

**Idea:** Create an "orchestrator" agent that:
1. Analyzes user need in natural language
2. Decides which specialized agent(s) to call
3. Orchestrates execution (sequential or parallel)
4. Consolidates results into a single response

**Example interaction:**
```
User: "Hey, got this error in the code"
Orchestrator: Detects need for code-review → executes → returns result

User: "Code review and generate documentation of the problems"
Orchestrator: Detects code-review + doc-generator → executes sequentially → returns doc
```

---

## 📋 Action Plan

### Phase 1: Architecture Design
- [ ] Define workflow format (pure YAML vs YAML + JS)
- [ ] Decide parallelism support (real vs sequential)
- [ ] Map all available agents and their triggers
- [ ] Define context passing protocol between agents

### Phase 2: Core Implementation
- [ ] Create base workflow `orchestrator.yaml`
- [ ] Implement intent analysis step
- [ ] Implement router to agents
- [ ] Test with simple cases (1 agent)

### Phase 3: Multi-Agent Orchestration
- [ ] Implement sequential execution
- [ ] Implement output passing between agents
- [ ] Test complex cases (2+ agents)
- [ ] Define result consolidation strategy

### Phase 4: Integration and UX
- [ ] Create slash command `/orchestrate` (optional)
- [ ] Add documentation in `agents/orchestrator/README.md`
- [ ] Create usage examples
- [ ] Test with real users

---

## ✅ What We Did

_Nothing yet - project in conception phase._

---

## 📍 Where We Are

**Initial conception.** We discussed the idea and validated that it's technically feasible. Next step is to decide architecture and start implementation.

**Pending decisions:**
1. Is parallelism possible? If not, do we accept sequential?
2. Is token cost acceptable (orchestrator + N agents)?
3. What is the ideal output format?

---

## 🚀 Next Steps

- [ ] **Architectural decision:** Choose between Option A (pure YAML), B (YAML + JS) or C (simplified)
- [ ] **Technical spike:** Prototype a workflow calling another workflow
- [ ] **Mapping:** List all agents in `.claude/workflows/agents/` and their capabilities

---

## 📊 Results

_To be defined after implementation._

---

## 🧠 Technical Notes

### Available Agents (Initial Mapping)

| Agent | Capability | Suggested Trigger |
|--------|-----------|------------------|
| `code-review` | Code analysis, bugs, quality | "error", "bug", "review", "quality" |
| `security-audit` | Vulnerabilities, security | "security", "vulnerability", "hack" |
| `doc-generator` | Documentation, README, reports | "document", "readme", "docs", "report" |
| `planner` | Planning, task structure | "plan", "organize", "structure" |
| `detect-installation` | Installation detection | "install", "setup", "configure" |
| `update-table-encyclopedia` | Table encyclopedia updates | "update", "encyclopedia", "table" |

### Mapped Use Cases

**Case 1 - Simple:**
```
Input: "There's a bug in the login"
Agents: [code-review]
Order: Simple
```

**Case 2 - Sequential:**
```
Input: "Code review and generate documentation"
Agents: [code-review → doc-generator]
Order: Sequential (doc needs review output)
```

**Case 3 - Parallel:**
```
Input: "Complete system audit"
Agents: [code-review, security-audit, doc-generator]
Order: Parallel (independent) → consolidation
```

### Architecture Options

| Option | Description | Pros | Cons |
|-------|-----------|------|------|
| **A** | Pure YAML workflow | Simple, native | Limited to sequential |
| **B** | Workflow + JavaScript | Flexible, parallelism possible | More complex |
| **C** | Simplified (1 at a time) | Easy maintenance | Less powerful |

### Known Challenges

1. **Parallelism:** Claude's workflow tool doesn't natively support it
2. **Timeout:** Sum of timeouts of each agent
3. **Cost:** Orchestrator + N agents = multiple LLM calls
4. **Context passing:** How to ensure agent 2 understands agent 1's output

---

## 📚 References

- Agent location: `.claude/workflows/agents/`
- Workflow template: `.claude/workflows/agents/_template.yaml`
- Workflow documentation: `.claude/workflows/CLAUDE.md`
- Original discussion: [insert date of conversation when implementing]
