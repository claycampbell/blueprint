---
description: Create comprehensive project scope document that doubles as a development checklist
---

# Scope - Project Scope & Checklist

Create a detailed project scope document in markdown format that serves as both comprehensive documentation and a step-by-step development checklist.

## Instructions

1. **Initial Planning**
   - First run `/plan` to create detailed to-do list in Claude Code To Do feature
   - Use that as foundation for the scope document

2. **Create Scope Document**
   - Document every aspect of the program
   - Structure in logical, chronological order
   - Break down into smallest logical tasks
   - Number hierarchically (1.1, 1.2, 2.1, etc.)

3. **Development Order**
   - Organize by best practices (data → logic → UI)
   - Each task should be independently testable
   - Mark dependencies clearly
   - Include acceptance criteria for each task

## Document Structure

The scope should include:
- **Overview**: Project goals and requirements
- **Architecture**: High-level design decisions
- **Development Phases**: Organized chronologically
  - Phase 1: Foundation (data models, core logic)
  - Phase 2: Business Logic (services, APIs)
  - Phase 3: User Interface (UI components)
  - Phase 4: Integration & Testing
  - Phase 5: Deployment & Documentation
- **Task Checklist**: Numbered, sequential tasks

## Workflow

This scope enables a simple workflow:
1. Complete task 1.1
2. User tests (if applicable)
3. Mark 1.1 as complete
4. Move to 1.2
5. Repeat until production-ready

## Output

Create a comprehensive markdown file that serves as both detailed scope and actionable checklist.