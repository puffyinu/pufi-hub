# PUFI HUB Development Standard v1.0

**Status:** 🟢 LOCKED

---

# Objective

This document defines the mandatory development standard for all future PUFI HUB builds.

Every implementation must follow this standard before making any code changes.

---

# Core Principles

- Reuse Before Rebuild
- Preserve Existing Architecture
- Mobile First
- World App Ready
- Type Safe
- Production Ready
- Validation Required
- Git Baseline Before Major Changes

---

# Mandatory Workflow

Every BUILD must follow this order.

1. Objective
2. Constraints
3. Implementation
4. Validation
5. Self-Heal
6. Build Report

---

# Constraints

Unless explicitly requested:

Do NOT:

- Modify architecture
- Modify routing
- Modify business logic
- Create duplicate services
- Create duplicate hooks
- Create duplicate components
- Create duplicate types

Reuse the existing implementation whenever possible.

---

# Validation Protocol

Validation is mandatory.

Run:

```bash
npm run lint
```

If lint reports errors:

- Fix the errors.
- Run lint again.
- Repeat until there are no lint errors.

Warnings may remain only if they are non-blocking.
Examples:

- @next/next/no-img-element

Warnings must be reported in the final summary.

Then run:

```bash
npm run build
```

If build fails:

- Identify the root cause.
- Fix the code.
- Run build again.
- Repeat until build succeeds.

Never bypass TypeScript.

Never disable lint rules.

---

# Self-Heal Requirement

If the implementation introduces:

- TypeScript errors
- ESLint errors
- Runtime errors
- Missing imports
- Undefined variables
- Missing properties
- Routing issues
- Build failures

The implementation is NOT complete.

The issue must be repaired before the task is considered finished.

---

# Build Safety Rules

Before creating anything new:

Check whether an equivalent already exists.

Reuse:

- Components
- Services
- Hooks
- Types
- Utilities

Avoid duplication.

---

# Validation Responsibility

The AI is responsible for delivering a buildable project.

Reporting an error is NOT considered task completion.

If the implementation introduces:

- TypeScript errors
- ESLint errors
- Build failures
- Runtime compile errors
- Missing imports
- Missing properties
- Undefined variables
- Invalid component usage
- Broken routing

the AI MUST repair the implementation before completing the BUILD.

The user should never be required to manually fix implementation errors introduced during the BUILD.

Validation Status

🔴 Critical Errors

Must be zero.

🟡 Major Warnings

Should be resolved when practical.

🔵 Minor Warnings

May remain if documented in the BUILD REPORT.

# Autonomous Build Recovery

If validation fails,

the AI MUST automatically enter a recovery loop.

Recovery Loop

Implement

↓

Validate

↓

Analyze

↓

Repair

↓

Validate

↓

Repeat

Continue until all validation succeeds.

Do not stop after the first failure.

Do not return an incomplete BUILD REPORT.

# Automatic Repair Loop

Validation is not only responsible for detecting errors.

Validation is also responsible for repairing the implementation.

If any issue is detected during:

- npm run lint
- npm run build

the AI MUST automatically:

1. Analyze the root cause.
2. Repair the implementation.
3. Run validation again.
4. Repeat until validation succeeds.

Never stop after reporting an error.

The BUILD is NOT complete until all validation passes.

# Stop Condition

A BUILD is complete only when ALL conditions are satisfied.

- Objective has been fully implemented.
- No architecture violations exist.
- No duplicate services, hooks, components, or types have been introduced.
- npm run lint passes without errors.
- npm run build succeeds.
- TypeScript succeeds.
- Existing functionality remains operational.
- No runtime compile errors remain.
- The project is ready for commit.

---

# Final Verification

Before generating the BUILD REPORT, the AI MUST verify that:

- The requested objective has been implemented.
- The implementation matches the approved business flow.
- Existing functionality has not been unintentionally changed.
- Validation has completed successfully.
- The project is ready for review and commit.

Only after all checks pass may the BUILD REPORT be generated.

# Build Report

Every BUILD must provide:

- Files Modified
- Root Cause (if applicable)
- Fix Applied
- Remaining Warnings
- Validation Result
- Build Result

---

# Git Workflow

Before major development:

- Ensure a clean Git baseline.

After implementation:

- Run lint.
- Run build.
- Review changes.
- Commit.
- Push.
- Treat the commit as the new baseline.

---

# Environment Setup

For a new development environment:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Ensure:

```env
NEXT_PUBLIC_RUNTIME_MODE=development
```

is configured before running the application.

---

# Build Instruction

Every new BUILD prompt should begin with:

> Follow PUFI HUB Development Standard v1.0 before implementing this task.

---

# Document Status

Version:

v1.0

Status:

🟢 LOCKED