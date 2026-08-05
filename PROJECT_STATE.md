# PUFI HUB - PROJECT STATE
Last updated: 2026-08-03

> File ini adalah SNAPSHOT terkini, bukan log historis.
> Setiap kali sprint/fix selesai atau progress berubah, OVERWRITE isi file ini (jangan ditambah ke bawah).
> Riwayat lengkap sudah tersimpan otomatis di `git log`.

---

## Project Info
- Repo: https://github.com/puffyinu/pufi-hub
- Stack: Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind, @worldcoin/minikit-js ^2.0.3, @worldcoin/idkit ^4.2.0, viem ^2.54.1, Supabase
- Environment: Cloud Shell Editor → GitHub → Vercel
- Live: pufi-hub.vercel.app (juga terdaftar di World App via World ID Developer Portal)
- Standard: Reuse Before Rebuild, Architecture Review sebelum implementasi, Quality Gate (lint + build) wajib sebelum commit

---

## Completed Sprints

### ✅ Sprint: Landing Gateway Restoration
- **Masalah:** Root route `/` (app/page.tsx) menampilkan dashboard mockup hardcoded, bukan landing/gateway screen ("Welcome Human" + Connect World Wallet).
- **Root cause:** Commit `6bca5ff` menimpa page.tsx dengan UI yang salah; `landingGatewayService.ts` sudah lengkap tapi tidak pernah di-wire ke page.tsx.
- **Fix:** Replace total `app/page.tsx` — reuse `AppBackground`, `useWalletContext`, `executeLandingGateway()`. Auto-redirect ke `/dashboard` kalau wallet sudah connected.
- **Files changed:** `app/page.tsx` (replace only)
- **Files NOT touched:** `app/dashboard/page.tsx`, `app/services/landingGatewayService.ts`, `app/context/WalletProvider.tsx`, `app/runtime/auth.ts`, `app/runtime/minikitManager.ts`, `app/layout.tsx`
- **Status:** DONE — dikonfirmasi user, sesi verifikasi Human ID sudah berjalan baik di akun terpisah.
- **Tech debt tersisa:** `app/components/WorldLoginCard.tsx` (redundant, tidak dipakai) dan `app/hooks/useWorldAuth.ts` (stub kosong, tidak pernah dipanggil) — kandidat cleanup di sprint mendatang, BELUM dihapus.

---

## Current Sprint (IN PROGRESS)

### 🔴 Fix: Campaign tab → "Transaction Error: invalid_contract"
- **Gejala:** User klik campaign di tab Campaign → popup MiniKit transaction muncul → error "Transaction failed: invalid_contract" (screenshot dari World App, MiniKit transaction sheet).
- **Dugaan awal:** Contract address yang dipanggil kosong/salah, atau ABI/fungsi tidak sesuai dengan contract yang ter-deploy di World Chain.
- **Diminta ke user, BELUM diterima:**
  ```bash
  grep -rn "invalid_contract" app/
  cat app/services/contracts.ts
  cat app/services/campaignEngine.ts
  ```
- **File-file relevan yang mungkin terlibat (belum diaudit):**
  - `app/services/contracts.ts`
  - `app/services/campaignEngine.ts`
  - `app/services/transaction.ts` / `app/services/transactionSession.ts`
  - `app/config/world.ts` (kemungkinan sumber contract address)
  - `app/components/CampaignForm.tsx` / `app/components/CampaignCard.tsx`
- **Next step kalau lanjut di sesi/akun baru:** minta user jalankan 3 command di atas, satu-persatu (bukan digabung), paste hasilnya. Baru lanjut Architecture Review untuk isu ini.

---

## Known File Map (dari `find app -name "*.tsx" -o -name "*.ts"`)
Struktur lengkap sudah diaudit sekali (lihat riwayat chat / git). Folder utama:
- `app/types/` — semua type definitions
- `app/runtime/` — minikitManager, auth, runtimeCoordinator, RuntimeBootstrap, nonce, runtimeMode
- `app/context/` — WalletProvider, LanguageContext
- `app/services/` — business logic layer (campaignEngine, rewardEngine, worldAuth, worldVerify, dll — jumlah besar, lihat repo untuk daftar lengkap)
- `app/hooks/` — useWallet, useAuth, useCampaign, useMiniKit, dll
- `app/components/` — UI components (WorldLoginCard, PortfolioCard, CampaignCard, dll)
- Routes: `/`, `/dashboard`, `/campaign`, `/claim`, `/creator`, `/creator/create`, `/activity`, `/profile`, `/achievement`, `/language`

---

## Core Principles (jangan dilanggar di sesi manapun)
- Reuse Before Rebuild — audit dulu sebelum tulis kode baru
- Jangan pernah rewrite modul yang sudah jalan tanpa alasan jelas
- Full file, no partial code, no placeholder
- Quality Gate wajib: `npm run lint` + `npm run build` sebelum commit
- Format response ikuti MODE BUILD PUFI HUB (Architecture Review → Files to Create/Replace → Implementation → Quality Gate → Git Commit → ACP Checkpoint → Risk Assessment → Next Sprint)

---

## Cara pakai file ini di sesi/akun baru
1. Buka chat baru di akun lain.
2. Paste seluruh isi file ini sebagai pesan pertama.
3. Sertakan juga link repo: https://github.com/puffyinu/pufi-hub
4. Kalau sedang lanjut isu tertentu (misal Campaign contract error), sebutkan eksplisit supaya Claude langsung fokus ke situ.