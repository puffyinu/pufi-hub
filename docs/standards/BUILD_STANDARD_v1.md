# PUFI HUB Development Standard v1.0

**Status:** 🟢 LOCKED

---

# Objective

This document defines the mandatory development standard for all future PUFI HUB builds.

Every implementation must follow this standard before making any code changes.

---

# Execution Environment

Validation requirements depend on the execution environment.

When the AI has direct access to the project repository
(e.g. Gemini CLI, Codex CLI, Cloud Shell, or another repository-connected agent),
all validation steps defined in this document MUST be executed before the BUILD is considered complete.

If the AI does not have direct repository access,
it MUST NOT claim that validation has been executed.
Instead, it should provide the required validation commands for the developer to run.

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

# Architecture Preservation

Unless explicitly requested:

- Do NOT rename existing modules.
- Do NOT relocate existing modules.
- Do NOT replace stable implementations.
- Prefer extending existing functionality over replacing it.
- Preserve the established project architecture.

Architecture changes require explicit approval.

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

# File Creation Policy

Before creating any new file:

- Search for an existing implementation.
- Reuse existing modules whenever possible.
- Extend existing components instead of duplicating them.
- Create a new file only when no suitable implementation exists.

Every new file should have a clear justification.

---

# Dependency Policy

Do NOT introduce new dependencies unless explicitly approved.

Prefer existing project dependencies.

Before installing a package:

- Verify that equivalent functionality does not already exist.
- Verify that the package is production-ready.
- Verify compatibility with the current project stack.

Avoid unnecessary dependency growth.

---

# Performance Guidelines

Every implementation should preserve or improve performance.

Avoid:

- unnecessary re-renders
- duplicate API requests
- duplicate state
- unnecessary effects
- excessive client-side rendering

Prefer:

- memoization when appropriate
- reusable utilities
- efficient rendering
- Mobile First optimization

Performance regressions should be avoided.

---

# Security Requirements

Never expose:

- private keys
- secret keys
- wallet credentials
- access tokens
- API secrets
- environment secrets

Never:

- bypass authentication
- bypass authorization
- disable security validation

Security should never be sacrificed for convenience.

---

# World App Compatibility

PUFI HUB targets the World App ecosystem.

Every implementation should remain compatible with:

- World App WebView
- MiniKit
- World Chain
- Mobile browsers

Avoid desktop-only interactions unless explicitly requested.

Maintain Mobile First behavior.

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

## Files Modified

List every modified file.

## Root Cause

If applicable, describe the underlying issue.

## Fix Applied

Summarize the implementation.

## Remaining Warnings

Document any remaining non-blocking warnings.

## Validation Result

- ESLint
- TypeScript
- Build

## Build Result

PASS / FAIL

## BUILD CHECKLIST

- [ ] Objective completed
- [ ] Business flow preserved
- [ ] Architecture preserved
- [ ] No duplicate implementation
- [ ] No duplicate services
- [ ] No duplicate hooks
- [ ] No duplicate components
- [ ] No duplicate types
- [ ] Lint passed
- [ ] Build passed
- [ ] TypeScript passed
- [ ] Existing functionality verified
- [ ] Ready for commit
- [ ] Ready for push

---

# Commit Message Convention

Use consistent commit messages.

Examples:

feat(build-007): implement campaign timer

fix(build-007): resolve claim validation issue

refactor(build-007): simplify reward service

docs(build-007): update development standard

style(build-007): improve dashboard layout

chore(build-007): cleanup project structure

---

# Git Workflow

Before major development:

- Ensure the repository is clean.
- Verify the active branch.
- Verify the Git baseline.
- Confirm there are no uncommitted changes.

After implementation:

- Run lint.
- Run build.
- Review all changes.
- Commit using the standard commit convention.
- Push to the remote repository.
- Treat the pushed commit as the new development baseline.

Never begin a major BUILD from a dirty working tree.

---

# AI Execution Policy

The AI must not declare a BUILD complete unless all required validation steps have been successfully completed within the available execution environment.

If repository access is unavailable:

- Do not claim validation has been executed.
- Do not fabricate build results.
- Clearly distinguish between completed actions and recommended actions.

All implementation reports must accurately reflect the work that has actually been performed.

---

# Document Status

Version:

v1.0

Status:

🟢 LOCKED