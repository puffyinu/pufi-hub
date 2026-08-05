'SPECEOF'
# PUFI HUB — Campaign Escrow Smart Contract
## Spesifikasi Teknis (Fase 1) — FINAL

Status: **Disetujui, siap lanjut ke Fase 2 (penulisan kode Solidity)**

---

## 1. Latar Belakang

Sesuai `PUFI HUB MINI APP Official System Workflow v1.0`, alur pembuatan campaign advertiser adalah:

Dokumen ini merinci smart contract yang mengimplementasikan langkah "Approve Token → Smart Contract" tersebut.

---

## 2. Model Bisnis (hasil diskusi)

- Dana pool campaign **dikunci penuh di depan** saat campaign dibuat.
- **Tidak ada** cancel, delete, atau refund campaign yang masih punya sisa klik.
- Campaign otomatis tidak aktif lagi begitu jumlah klik (`maxClaims`) habis — tidak perlu fungsi "selesaikan campaign" terpisah.
- Dana pool 100% dari wallet advertiser sendiri. Platform (treasury/reward wallet) **tidak** ikut membiayai pembuatan campaign.
- Budget yang diinput advertiser adalah **angka GROSS**, di-split otomatis:
  - **70% → Pool** (untuk reward user)
  - **30% → Platform Fee**
- Contoh: Budget 100 PUFI, reward 2 PUFI/klik → Pool efektif 70 PUFI → **35 klik** (bukan 50). UI Creator wajib menampilkan estimasi klik ini secara real-time berdasarkan pool net, bukan budget gross.
- Perhitungan split 70/30 dilakukan di **backend/frontend sebelum** memanggil contract. Contract sendiri hanya menerima dua angka final (`poolAmount`, `feeAmount`), tidak melakukan kalkulasi persentase.

---

## 3. Klasifikasi Transaksi On-Chain (referensi lengkap)

| # | Transaksi | Arah | Ditangani oleh |
|---|---|---|---|
| 1 | Daily Claim reward | Treasury wallet → User | Sudah berjalan (`sendPufiFromRewardWallet`) — di luar scope contract ini |
| 2 | Campaign pool funding | Advertiser wallet → Contract (escrow) | Contract ini, fungsi `createCampaign` |
| 3 | Platform fee (30%) | Advertiser wallet → Platform Fee wallet | Contract ini, bagian dari `createCampaign` |
| 4 | Campaign reward withdrawal | Contract (escrow) → User | Contract ini, fungsi `releaseReward` |

Semua alur lain (World ID verify, wallet connect/SIWE, visit tracking, eligibility check, metadata campaign, activity/leaderboard, baca saldo Portfolio) tetap off-chain (Supabase / API / read-only query).

---

## 4. Spesifikasi Fungsi Contract

### `createCampaign(bytes32 campaignId, address token, uint256 poolAmount, uint256 feeAmount)`
- Dipanggil oleh **advertiser**, setelah `approve()` token ke contract ini.
- Contract menarik `poolAmount + feeAmount` dalam **satu transaksi** via `transferFrom`.
- `poolAmount` dikunci di dalam contract, terikat ke `campaignId`.
- `feeAmount` diteruskan **langsung** ke Platform Fee wallet dalam transaksi yang sama.
- `campaignId` harus unik (mencegah pembuatan ulang dengan ID yang sama — dicocokkan dengan UUID campaign di Supabase).
- Revert jika: `campaignId` sudah pernah dipakai, `poolAmount` atau `feeAmount` bernilai 0, atau allowance/saldo advertiser tidak cukup.

### `releaseReward(bytes32 campaignId, address to, uint256 amount)`
- **Hanya bisa dipanggil oleh Operator** (lihat bagian 5).
- Transfer `amount` token dari saldo terkunci `campaignId` tersebut langsung ke `to` (wallet user).
- Revert otomatis jika `amount` melebihi sisa saldo campaign — proteksi bawaan terhadap over-payout, tidak memerlukan pengecekan manual tambahan.
- Dipanggil backend saat user melakukan withdrawal dari kartu "Rewards Claims" (setelah backend menjumlahkan baris `campaign_claims` yang `tx_hash IS NULL`).

### `getCampaignBalance(bytes32 campaignId) view returns (uint256)`
- Publik, siapa saja bisa cek sisa saldo campaign kapan saja — transparansi.

### Tidak ada fungsi:
- Cancel / delete / refund campaign
- Withdraw oleh advertiser setelah dana masuk
- Extend/top-up pool campaign yang sudah ada (di luar scope Fase 1 — bisa jadi fitur terpisah nanti jika dibutuhkan)

---

## 5. Access Control & Manajemen Wallet

| Peran | Wewenang | Wallet yang dipakai |
|---|---|---|
| **Owner** | Update address Operator & Platform Fee wallet | Wallet admin terpisah, idealnya cold/hardware wallet — **bukan** wallet server |
| **Operator** | Hanya bisa memanggil `releaseReward` | **Wallet server BARU, khusus untuk contract ini** — terpisah dari Reward Wallet yang dipakai Daily Claim |
| **Advertiser** | Memanggil `createCampaign` untuk campaign miliknya | Wallet advertiser masing-masing (via MiniKit di app) |

**Keputusan: Operator pakai wallet baru, terpisah dari Reward Wallet Daily Claim.**

Alasan: kalau private key Operator ini bocor, penyerang bisa memanggil `releaseReward` untuk **mengeluarkan seluruh dana yang terkunci di SEMUA campaign** ke address manapun — risiko ini lebih besar daripada kompromi Reward Wallet biasa (yang saldonya kecil & cuma untuk Daily Claim). Memisahkan wallet membatasi *blast radius* kalau salah satu key bocor, dan memudahkan rotasi key secara independen (seperti yang kita lakukan untuk `WORLD_RP_SIGNING_KEY` sebelumnya) tanpa mengganggu operasional Daily Claim.

`Owner` juga disarankan **beda** dari `Operator` — Owner idealnya dipegang manual (jarang dipakai, hanya untuk situasi darurat/rotasi), sementara Operator adalah hot wallet otomatis di server.

---

## 6. Yang Dibutuhkan Sebelum Fase 2 (Penulisan Kode)

- [ ] Address **Platform Fee wallet** (sudah diminta sebelumnya, belum diberikan)
- [ ] Generate **Operator wallet baru** (private key akan disimpan server-side, mirip pola `REWARD_WALLET_PRIVATE_KEY`)
- [ ] Tentukan **Owner wallet** (rekomendasi: wallet pribadi kamu di World App, bukan hot wallet)
- [ ] Konfirmasi token apa saja yang didukung di awal (PUFI saja dulu, atau langsung PUFI+WLD+USDC sekaligus)

---

## 7. Roadmap Selanjutnya

| Fase | Isi | Status |
|---|---|---|
| 1 | Spesifikasi teknis (dokumen ini) | ✅ Selesai |
| 2 | Tulis kode Solidity sesuai spesifikasi ini | ⏳ Menunggu input Bagian 6 |
| 3 | Deploy & test di testnet (World Chain Sepolia) | ⏳ |
| 4 | Migrasi Campaign System (local session → Supabase, terhubung ke contract) | ⏳ |
| 5 | Review keamanan (reentrancy, access control, overflow) | ⏳ |
| 6 | Deploy mainnet + funding awal | ⏳ |
SPECEOF
echo "File created"