# PUFI HUB

## Project Overview

PUFI HUB is a specialized World Mini App built for the World ecosystem. It serves as a human-verified advertising marketplace that leverages the World Chain and World ID to ensure trust and authenticity in user interactions.

### Mission

To build a production-ready, decentralized advertising platform where every interaction is verified by World ID, ensuring advertisers reach real humans and users receive fair rewards for their attention.

### Vision

To become the foundational advertising layer for the World ecosystem, providing a seamless bridge between creators and verified humans through a trustless, transparent, and rewarding marketplace.

### Problem Statement

Traditional advertising platforms are plagued by bot traffic, fraudulent claims, and lack of transparency. Advertisers often pay for non-human engagement, while users' privacy and data are exploited without fair compensation.

### Solution

PUFI HUB solves these issues by integrating World ID for Proof of Personhood (PoP), ensuring that only verified humans can participate in the ecosystem. By using World Chain and PUFI smart contracts, the platform provides a transparent and automated reward system for both creators and users.

### Target Users

*   **Creators:** Advertisers and app developers looking to reach a verified human audience within the World ecosystem.
*   **Users:** Human-verified participants who want to discover new applications and earn rewards for their attention and engagement.

### Core Features

*   **Creator Center:** A dedicated dashboard for advertisers to create, fund, and manage their campaign slots.
*   **Campaign Marketplace:** A list of active, human-verified advertising campaigns.
*   **Daily Claim System:** A rewarding mechanism for users to engage with the platform daily.
*   **Wallet & Portfolio:** Integrated wallet management for tracking PUFI rewards and other supported tokens (WLD, USDC).
*   **Human Verification:** Native integration with World ID for secure and private personhood verification.

### Project Goals

*   **Production Readiness:** Delivering a stable, audited, and high-performance application.
*   **Mobile-First Design:** Optimized for the World App and mobile devices.
*   **World MiniKit Integration:** Full utilization of official World SDKs and APIs.
*   **Decentralized Rewards:** Automated distribution of rewards via smart contracts on World Chain.

### Technology Stack

*   **Frontend Framework:** Next.js 16.2.10 (Turbopack enabled)
*   **Language:** React 19 / TypeScript
*   **Styling:** Tailwind CSS / Inline Styles
*   **Blockchain Integration:** viem
*   **World Ecosystem Tools:** @worldcoin/minikit-js, @worldcoin/idkit
*   **Infrastructure:** World Chain

### Architecture Summary

PUFI HUB follows a clean, provider-based architecture designed for scalability and maintainability.

*   **UI Layer:** React components optimized for mobile viewports.
*   **Services Layer:** Encapsulated business logic (e.g., `achievementEngine`, `campaignSession`).
*   **Runtime Layer:** Platform-specific management (e.g., `minikitManager`, `worldRuntime`).
*   **Provider/Context Layer:** Global state management (e.g., `WalletProvider`, `providers.tsx`).
*   **Hooks Layer:** Reusable React logic for interacting with services and state.

### Current Build Status

The project is developed in incremental BUILD stages.

*   **BUILD #001: Landing Page** - Status: Locked
*   **BUILD #002: Dashboard** - Status: Locked
*   **BUILD #003: Daily Claim** - Status: Locked
*   **BUILD #004: Campaign** - Status: Locked
*   **BUILD #005: Creator** - Status: Completed

### Project Structure

```text
/
├── app/                 # Next.js App Router (Pages, Components, Hooks, Services)
│   ├── components/      # Reusable UI components
│   ├── services/        # Business logic and engines
│   ├── providers/       # Data and state providers
│   ├── runtime/         # Platform coordination
│   ├── types/           # TypeScript definitions
│   └── (routes)/        # Page routes (creator, dashboard, etc.)
├── docs/                # Project documentation
│   ├── ai/              # AI development frameworks
│   ├── audit/           # Architecture and UI audits
│   └── builds/          # Detailed build documentation
├── public/              # Static assets
├── GEMINI.md            # Core project instructions
└── package.json         # Dependencies and scripts
```

### Development Workflow

PUFI HUB follows a rigorous development lifecycle to ensure quality and consistency.

1.  **Architecture Audit:** Identify reusable components and services before starting work.
2.  **Implementation Plan:** Define the scope, impact, and risks of the build.
3.  **Implementation:** Surgical code updates following the "Reuse First" principle.
4.  **Verification:** Mandatory `npm run lint` and `npm run build` checks.
5.  **ACP Review:** Architecture, Consistency, and Performance review of the changes.

### Documentation Structure

*   `GEMINI.md`: Foundational mandates and project rules.
*   `docs/`: Comprehensive technical documentation.
*   `docs/ai/`: AI-specific implementation frameworks.
*   `docs/audit/`: Reports on architectural and UI compliance.
*   `docs/builds/`: History and requirements of each build stage.

### Coding Standards

*   **Reuse First:** Priority: Reuse -> Refactor -> Extend -> Create New.
*   **Clean Architecture:** Strict separation of UI and business logic.
*   **Type Safety:** Explicit typing for all interfaces and services.
*   **Mobile-First:** Adaptive UI for mobile safe areas.

### Build Standards

Every build must pass:
*   ESLint verification (`npm run lint`).
*   Production build compilation (`npm run build`).

### Git Workflow

*   **Clean Tree:** Working tree must be clean before and after every BUILD.
*   **Atomic Commits:** Build-specific commits with concise messages.
*   **Log Review:** Frequent review of `git status` and `git log`.

### Quality Assurance

*   **Mandatory Gating:** No build is marked as done without passing lint and build checks.
*   **Architecture Reviews:** Every change is reviewed against the core project architecture.
*   **Proof of Personhood:** Core functionality is guarded by World ID.

### Future Roadmap

1.  **BUILD #006: Wallet & Portfolio Engine** - Application architecture for World Wallet integration.
2.  **BUILD #007: Bottom Navigation** - Navigation refinement and persistent state.
3.  **BUILD #008: Splash Screen** - App loading and initialization experience.
4.  **BUILD #009: World Integration** - Final World MiniKit and IDKit synchronization.
5.  **BUILD #010: Polish** - Production-ready UI/UX and performance tuning.

### Repository Status

*   **Git Branch:** `main`
*   **Production Readiness:** In development (Sprint BUILD #006).
*   **Baseline Commit:** `770bbd3`

### Folder Overview

*   `app/components`: Visual building blocks.
*   `app/services`: Reusable engines for campaigns, rewards, and sessions.
*   `app/runtime`: Coordination between the application and the World App environment.
*   `docs/ai`: AI-specific instructions and build templates.

### Conclusion

PUFI HUB is committed to delivering a high-quality World Mini App that sets a new standard for advertising transparency and human verification. By following a structured development framework and leveraging the World ecosystem, the project ensures a secure and rewarding experience for all participants.
