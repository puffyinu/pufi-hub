-- ============================================
-- PUFI HUB DATABASE SCHEMA v1.0
-- ============================================

-- 1. CAMPAIGNS
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  logo text,
  mini_app_url text,
  reward_token text not null check (reward_token in ('PUFI', 'USDC', 'WLD')),
  reward_per_claim numeric not null check (reward_per_claim > 0),
  pool_amount numeric not null check (pool_amount > 0),
  platform_fee_amount numeric not null default 0,
  total_paid numeric not null default 0,
  max_claims integer not null check (max_claims > 0),
  claimed_count integer not null default 0,
  remaining_pool numeric not null,
  status text not null default 'LIVE' check (status in ('LIVE', 'PAUSED', 'COMPLETED', 'DRAFT')),
  created_by text not null, -- advertiser wallet address
  payment_tx_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_campaigns_status on campaigns(status);
create index if not exists idx_campaigns_created_by on campaigns(created_by);

-- 2. DAILY CLAIMS
create table if not exists daily_claims (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  amount numeric not null default 1,
  token text not null default 'PUFI',
  tx_hash text,
  claimed_at timestamptz not null default now()
);

create index if not exists idx_daily_claims_wallet on daily_claims(wallet_address);
create index if not exists idx_daily_claims_claimed_at on daily_claims(claimed_at);

-- 3. CAMPAIGN CLAIMS
create table if not exists campaign_claims (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  wallet_address text not null,
  reward_amount numeric not null,
  reward_token text not null,
  tx_hash text,
  claimed_at timestamptz not null default now(),
  unique (campaign_id, wallet_address) -- 1 wallet hanya bisa claim 1x per campaign
);

create index if not exists idx_campaign_claims_wallet on campaign_claims(wallet_address);
create index if not exists idx_campaign_claims_campaign on campaign_claims(campaign_id);

-- 4. TREASURY LEDGER
create table if not exists treasury_ledger (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in (
    'CAMPAIGN_PAYMENT', 'PLATFORM_FEE', 'DAILY_CLAIM_OUT', 'CAMPAIGN_REWARD_OUT', 'MANUAL_FUND_IN'
  )),
  amount numeric not null,
  token text not null,
  wallet_address text, -- advertiser or user wallet involved
  campaign_id uuid references campaigns(id) on delete set null,
  tx_hash text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_treasury_ledger_type on treasury_ledger(entry_type);
create index if not exists idx_treasury_ledger_created_at on treasury_ledger(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- Public: read-only. Writes only via service_role (backend).
-- ============================================

alter table campaigns enable row level security;
alter table daily_claims enable row level security;
alter table campaign_claims enable row level security;
alter table treasury_ledger enable row level security;

create policy "public read campaigns" on campaigns for select using (true);
create policy "public read campaign_claims" on campaign_claims for select using (true);

-- daily_claims dan treasury_ledger TIDAK publicly readable (data sensitif finansial)
-- hanya backend (service_role) yang bisa akses, service_role otomatis bypass RLS
