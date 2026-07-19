# PUFI HUB - Gemini CLI Project Instructions

## Project

Project Name: PUFI HUB

PUFI HUB is a World Mini App built for the World ecosystem.

Final objective:

Build a production-ready World Mini App using:

- World MiniKit
- World ID
- Wallet
- World Chain
- PUFI Smart Contract

Browser is ONLY used for development, testing and debugging.

Browser is NOT the final product.

---

# Core Development Principles

## 1. Audit Before Implementation

Always audit before modifying code.

Never implement first.

---

## 2. Reuse First

Priority:

Reuse Existing

↓

Refactor Existing

↓

Extend Existing

↓

Create New

Do not create duplicate components, hooks, services or utilities.

---

## 3. Preserve Architecture

Do not change architecture without explicit approval.

Keep folder structure consistent.

---

## 4. World First

Respect World platform responsibilities.

Never recreate:

- Login
- Wallet Connection
- Authentication
- Human Verification
- Transaction Signing

Use official World SDKs and MiniKit APIs.

---

## 5. Mobile First

Always optimize for:

- World App
- Mobile
- Safe Area
- Device Adaptive UI

Desktop is only for development.

---

## 6. Dashboard Philosophy

Dashboard is an Information Center.

Dashboard is NOT an action page.

Actions belong to:

- Campaign
- Claim
- Wallet
- Creator

---

## 7. Business Flow

Creator

↓

Campaign

↓

Claim

↓

Wallet

Always preserve this business flow.

---

## 8. Audit Rules

Before implementation always audit:

- Folder structure
- Existing components
- Existing hooks
- Existing services
- Existing types
- Existing utilities
- Duplicate code
- Unused files

---

## 9. Build Workflow

Implementation

↓

ESLint

↓

Production Build

↓

Architecture Review

↓

Git Commit

↓

Git Push

Never skip quality gates.

---

## 10. Documentation

Whenever requested:

Store audit reports in:

docs/audit/

Store build documentation in:

docs/builds/

Use prompt templates from:

docs/prompts/

---

## Response Style

Prefer concise technical explanations.

Explain root cause before proposing implementation.

Never modify unrelated files.

Always minimize changes.

When in doubt:

Ask before implementing.