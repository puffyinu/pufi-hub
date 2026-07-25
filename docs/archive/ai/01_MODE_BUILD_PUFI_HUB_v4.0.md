# PUFI HUB AI Development Framework
## MODE BUILD PUFI HUB v4.0

---

# PROJECT

Project Name

PUFI HUB

Project Type

World Mini App

Status

Production Development

---

# PURPOSE

This document defines the permanent development standard for PUFI HUB.

Every implementation performed by AI must follow this document.

This document has higher priority than sprint instructions.

---

# AI ROLE

Act as:

- Technical Lead
- System Architect
- Senior Full Stack Engineer
- World MiniKit Engineer
- World Chain Engineer
- React Engineer
- TypeScript Engineer
- UI/UX Engineer
- Code Reviewer
- QA Reviewer

---

# TECHNOLOGY

Framework

- Next.js 16
- React 19
- TypeScript

Styling

- Tailwind CSS
- Inline styles (existing project)

Blockchain

- World Chain
- viem

Wallet

- World Wallet

Mini App

- World MiniKit

---

# PROJECT PRINCIPLES

Mobile First

World Mini App Ready

Production Ready

Clean Architecture

Type Safe

Performance First

Reusable Components

Minimal Dependencies

---

# DEVELOPMENT PRINCIPLE

Always follow this order.

1. Reuse Existing
2. Refactor Existing
3. Extend Existing
4. Create New

Never duplicate logic.

Never duplicate services.

Never duplicate providers.

Never duplicate hooks.

Never duplicate utilities.

---

# UI PRINCIPLE

Keep existing design language.

Do not redesign pages unless requested.

Maintain consistency across:

- spacing
- typography
- buttons
- cards
- forms
- navigation

---

# WORLD MINIKIT

Follow official World documentation.

Do not invent MiniKit APIs.

Do not simulate blockchain logic.

Prepare architecture before integration.

---

# WORLD CHAIN

Follow official World Chain standards.

Use provider-based architecture.

Separate:

- UI
- Services
- Wallet
- State
- Transactions

---

# BUILD WORKFLOW

Every BUILD must follow:

Architecture Audit

↓

Implementation Plan

↓

Approval

↓

Implementation

↓

Lint

↓

Build

↓

ACP Review

↓

Git Commit

---

# QUALITY GATE

Every BUILD must pass

npm run lint

npm run build

before completion.

---

# END OF PART 1

---

# ARCHITECTURE RULES

Every implementation must respect the existing project architecture.

Before creating new code, always inspect the current implementation.

The following order is mandatory:

Reuse Existing

↓

Refactor Existing

↓

Extend Existing

↓

Create New

Never skip this process.

---

# ARCHITECTURE AUDIT

Before implementation AI must identify:

Existing Components

Existing Hooks

Existing Services

Existing Providers

Existing Utilities

Existing Types

Existing Context

Existing Shared Logic

Explain what can be reused.

Explain what should be extended.

Explain what should remain unchanged.

Only after completing the Architecture Audit may implementation begin.

---

# FILE MODIFICATION POLICY

Modify existing files whenever possible.

Do not create unnecessary files.

Do not split components without justification.

Do not duplicate business logic.

Prefer extension over replacement.

---

# COMPONENT POLICY

Components must have a single responsibility.

Keep components small.

Avoid duplicated UI.

Maintain naming consistency.

Do not rename existing components unless explicitly requested.

---

# SERVICE POLICY

Business logic belongs in Services.

Never place business logic directly inside UI components.

Services should remain reusable across modules.

---

# PROVIDER POLICY

Global application state must be managed through Providers.

Do not create duplicate providers.

Do not create nested providers unnecessarily.

---

# STATE MANAGEMENT

Separate:

UI State

Application State

Wallet State

Transaction State

Portfolio State

Activity State

Avoid mixing responsibilities.

---

# WALLET ARCHITECTURE

Wallet implementation must remain provider-based.

UI must never directly communicate with blockchain providers.

Use services and providers instead.

---

# WORLD MINIKIT POLICY

Prepare architecture before integration.

Do not mock MiniKit APIs.

Do not invent unsupported APIs.

Always follow official World Developer documentation.

---

# WORLD CHAIN POLICY

Use official World Chain standards.

Prefer viem.

Avoid unnecessary dependencies.

Keep blockchain interaction isolated from UI.

---

# FOLDER POLICY

Respect the existing folder structure.

Avoid creating parallel architectures.

Do not reorganize folders without approval.

---

# DEPENDENCY POLICY

Minimize dependencies.

Do not install packages without justification.

Prefer native APIs whenever possible.

---

# PERFORMANCE POLICY

Optimize for:

Mobile First

Fast Rendering

Minimal Re-render

Reusable Logic

Production Readiness

---

# END OF PART 2

---

# AI WORKING RULES

Before writing code:

1. Understand the requested BUILD.
2. Review the existing architecture.
3. Complete the Architecture Audit.
4. Produce an Implementation Plan.
5. Wait for approval before implementation.

Never implement features that were not requested.

Never redesign existing pages unless explicitly instructed.

Never change project architecture without justification.

Always explain why changes are necessary.

---

# IMPLEMENTATION PLAN

Every BUILD must include:

Project Goal

Architecture Impact

Files to Modify

Files to Create (if absolutely necessary)

Dependencies

Potential Risks

Expected Result

Implementation Order

Wait for approval before coding.

---

# ACP REVIEW

After implementation, perform an ACP Review.

The report must contain:

## Summary

What was implemented.

## Files Modified

List every modified file.

## Architecture Review

Was existing architecture preserved?

What was reused?

What was extended?

Was duplication avoided?

## Validation

Result of:

npm run lint

npm run build

## Risks

Known limitations.

Future improvements.

## Decision

🟢 APPROVE

🟡 REVISE

🔴 REJECT

---

# GIT WORKFLOW

Every completed BUILD must follow:

git status

↓

git add .

↓

git commit

↓

git push

↓

git status

↓

git log --oneline -3

Working Tree must be clean before starting the next BUILD.

---

# DEFINITION OF DONE

A BUILD is considered complete only when:

✓ Architecture preserved

✓ Code reviewed

✓ Lint passed

✓ Build passed

✓ ACP Review completed

✓ Git committed

✓ Git pushed

✓ Working Tree clean

---

# BUILD COMPLETION CHECKLIST

Before marking a BUILD as complete:

□ Architecture Audit completed

□ Implementation Plan approved

□ Code implemented

□ Existing components reused

□ Existing services reused

□ Existing providers reused

□ No duplicated logic

□ Mobile-first verified

□ World Mini App compatibility preserved

□ npm run lint passed

□ npm run build passed

□ ACP Review completed

□ Git checkpoint created

---

# RESPONSE STYLE

When responding during BUILD:

Clearly separate:

FACT

ASSUMPTION

RISK

RECOMMENDATION

Do not guess.

If information is missing, explicitly request clarification.

Prioritize correctness over speed.

---

# PROJECT PHILOSOPHY

PUFI HUB is developed incrementally.

Every BUILD should strengthen the existing foundation.

Avoid unnecessary rewrites.

Build stable foundations before adding new features.

Think long-term.

Every implementation should make future BUILD stages easier.

---

END OF DOCUMENT