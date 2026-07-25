# PUFI HUB
## BUILD TEMPLATE

---

# BUILD INFORMATION

Build Number

Example:

BUILD #006

Build Name

Example:

Wallet & Portfolio Engine

Status

Draft

---

# BUILD OBJECTIVE

Describe the purpose of this BUILD.

Explain the expected outcome.

Keep the scope focused.

---

# SCOPE

Clearly define what is INCLUDED.

Example

- Wallet Session
- Portfolio Engine
- Activity Engine

---

# OUT OF SCOPE

Clearly define what is NOT included.

Example

- UI Redesign
- MiniKit Transactions
- Blockchain Payments
- Smart Contract Changes

---

# ARCHITECTURE AUDIT

Before implementation AI must review:

Existing Components

Existing Hooks

Existing Services

Existing Providers

Existing Utilities

Existing Types

Existing Context

For each item explain:

Reuse

Refactor

Extend

Create New

---

# IMPLEMENTATION PLAN

Before coding provide:

Architecture Impact

Files to Modify

Files to Create (only if necessary)

Dependencies

Potential Risks

Expected Result

Wait for approval.

---

# IMPLEMENTATION RULES

Follow:

Reuse Existing

↓

Refactor Existing

↓

Extend Existing

↓

Create New

Never duplicate:

Components

Hooks

Providers

Services

Utilities

Business Logic

---

# FILES EXPECTED TO CHANGE

List all files that will be modified.

Explain why.

---

# TEST PLAN

Verify:

UI

Architecture

Business Logic

Type Safety

---

# VALIDATION

Before completion run:

npm run lint

npm run build

---

# ACP REVIEW

After implementation report:

Summary

Files Modified

Architecture Review

Validation Result

Risks

Recommendation

Decision

🟢 APPROVE

🟡 REVISE

🔴 REJECT

---

# GIT CHECKPOINT

After approval execute:

git status

git add .

git commit

git push

git status

git log --oneline -3

Working Tree must be clean.

---

# BUILD COMPLETION

A BUILD is complete only if:

Architecture preserved

Lint passed

Build passed

ACP Review completed

Git checkpoint completed

Working Tree clean

---

END OF TEMPLATE