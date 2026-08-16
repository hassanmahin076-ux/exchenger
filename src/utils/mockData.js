// Original market data and token assets unique to Exchanger 3th

export const INITIAL_MARKETS = [
  { id: "EX3-USDT", symbol: "EX3 / USDT", name: "Exchanger 3th Token", price: 42.85, change: 18.42, high: 45.20, low: 35.10, vol: "142.5M", category: "Apex", isHot: true },
  { id: "BTC-USDT", symbol: "BTC / USDT", name: "Bitcoin", price: 68450.00, change: 3.25, high: 69200.00, low: 66100.00, vol: "2.8B", category: "Apex" },
  { id: "ETH-USDT", symbol: "ETH / USDT", name: "Ethereum", price: 3485.50, change: -1.15, high: 3590.00, low: 3420.00, vol: "1.4B", category: "Apex" },
  { id: "SOL-USDT", symbol: "SOL / USDT", name: "Solana Nexus", price: 178.40, change: 7.80, high: 182.00, low: 164.50, vol: "890M", category: "Trending", isHot: true },
  { id: "NEO-3TH", symbol: "N3TH / USDT", name: "Nexus 3rd Yield", price: 8.92, change: 24.60, high: 9.40, low: 7.10, vol: "410M", category: "Top Yield", isHot: true },
  { id: "AIX-USDT", symbol: "AIX / USDT", name: "Cyber AI Matrix", price: 1.45, change: 12.30, high: 1.58, low: 1.22, vol: "320M", category: "Trending" },
  { id: "QNT-USDT", symbol: "QNT / USDT", name: "Quantum Vault", price: 124.70, change: -4.50, high: 132.00, low: 120.10, vol: "180M", category: "New" },
  { id: "GLD-3TH", symbol: "GLD3 / USDT", name: "Gold Yield 3th", price: 2450.80, change: 1.85, high: 2465.00, low: 2420.00, vol: "650M", category: "Top Yield" },
];

export const INITIAL_USER = {
  name: "CyberTrader_3th",
  uid: "88492031",
  vipLevel: "VIP 3",
  totalBalanceUSDT: 24580.45,
  availableUSDT: 14200.00,
  spotBalance: 18450.25,
  futuresBalance: 6130.20,
  stakedBalance: 5000.00,
  assetsList: [
    { symbol: "USDT", name: "Tether USD", amount: "14,200.00", valueUSD: "$14,200.00", percent: "57.7%" },
    { symbol: "EX3", name: "Exchanger 3th", amount: "150.00", valueUSD: "$6,427.50", percent: "26.1%" },
    { symbol: "BTC", name: "Bitcoin", amount: "0.042", valueUSD: "$2,874.90", percent: "11.7%" },
    { symbol: "N3TH", name: "Nexus 3th", amount: "120.00", valueUSD: "$1,078.05", percent: "4.5%" }
  ]
};

export const TASK_CENTER_REWARDS = [
  { id: 1, title: "Welcome Matrix Deposit", reward: "100 USDT Bonus", status: "Claimable", desc: "First deposit of 100 USDT or equivalent into Cyber Vault" },
  { id: 2, title: "EX3 Token Staker", reward: "250 USDT Bonus", status: "In Progress", desc: "Stake 50 EX3 tokens in Quantum Vault for 7 days" },
  { id: 3, title: "Perpetual AI Trading Volume", reward: "500 USDT Bonus", status: "Locked", desc: "Reach $10,000 trading volume on EX3/USDT Futures" },
  { id: 4, title: "Security Matrix 2FA", reward: "20 USDT Voucher", status: "Claimable", desc: "Enable 2FA Hardware or Passkey Protection" }
];
