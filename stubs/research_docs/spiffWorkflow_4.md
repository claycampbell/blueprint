I can see the VS4 document clearly. This is a detailed breakdown of the Design & Entitlement value stream with multiple workflow groups and items. Let me analyze this structure.Now let me create a visual diagram of how VS4 would look with its workflow groups:And one more showing what's inside a single workflow group (the sub-process):## Summary: How SpiffWorkflow Handles Your 3-Tier Structure

### The Architecture

Your structure maps perfectly to BPMN's **Call Activity** pattern:

| Your Term | BPMN Term | SpiffWorkflow |
|-----------|-----------|---------------|
| Value Stream (VS4) | Parent Process | Main BPMN file |
| Workflow Group (WFG3) | Call Activity / Sub-Process | Separate BPMN file, called by parent |
| Workflow Item (WFI2) | Task | User Task within sub-process |

### How It Works

1. **Parent Process (vs4.bpmn)** contains a series of **Call Activities**
2. Each Call Activity references a **Sub-Process file** (wfg1.bpmn, wfg2.bpmn, etc.)
3. When the workflow reaches a Call Activity, SpiffWorkflow **enters** that sub-process
4. The sub-process executes its tasks (WFI1 → WFI2 → WFI3 → WFI4)
5. When the sub-process ends, it **returns** to the parent with a result
6. The parent's **gateway** evaluates the result (approved, back, skip) and routes accordingly

### Complexity Assessment

**This is NOT too complex.** This is actually a textbook BPMN use case:

- ✅ **~28 tasks in VS4** - Normal, well within capabilities
- ✅ **7 workflow groups** - Clean modular design
- ✅ **Back-routing** - Standard gateway pattern
- ✅ **3-tier nesting** - Call Activities handle this elegantly
- ✅ **Each WFG is independent** - Edit one without touching others

### The Key Benefit

Each **Workflow Group is its own BPMN file**. This means:

- **Workflow admins** can edit WFG3 (Construction Docs) without touching WFG2 or the parent VS4
- **Version independently** - Update the permitting workflow without affecting design workflows
- **Reuse** - If VS6 has a similar review pattern, reference the same sub-process
- **Test in isolation** - Run just WFG3 to verify it works before integrating

Would you like me to show you what the actual BPMN XML would look like for one of these, or how you'd set up the bpmn-js editor to allow workflow admins to create/edit these sub-processes?