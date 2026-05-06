# Farsi: Save Together on Celo

Farsi is a premium mobile-first savings application built on **Celo** for **MiniPay-style stablecoin users**. It simplifies blockchain interactions into a natural, high-fidelity experience, enabling users to save, contribute, and move digital dollars effortlessly.

---

##  What is Farsi?

In short, **Farsi is a smart money app for your phone.** 

We built Farsi to bridge the gap between "hard-to-use" crypto and everyday life. Think of it like a modern banking app, but built for **Celo stablecoin flows**. It’s designed for anyone who wants to save together and move digital dollars without needing a degree in computer science.

### **The Mission**
Our mission is simple: **Financial freedom, simplified.** No seed phrase drama, no chain confusion, just practical saving and social finance on mobile.

---

##  Core Features

###  **On-Chain Proof (Verifiable Receipts)**
Trust, but verify. Every action in Farsi generates a dynamic, high-fidelity receipt. These receipts are linked to **Blockscout on Celo Sepolia**, providing instant, transparent proof of each transaction.

###  **Live Wallet**
Stay on top of your assets. Our real-time wallet pulls directly from **Celo Sepolia**, showing your live **cUSD** and **CELO** balances. Every transaction is block-synced and authentic.

###  **Smart Earn**
Don't let your money sit idle. Farsi Save connects you to a simple savings vault. Deposit your cUSD with a tap and withdraw whenever you want while we validate the full MiniPay-native savings experience.

###  **Social Pots (Save with Friends)**
Project savings, group gifts, or trip funds—on-chain. Create a "Social Pot," set a goal, and invite friends to contribute. It’s transparent, social, and the money is only accessible once the group hits the target.

###  **Global Send**
Seamless P2P transfers. Send cUSD to anyone on Celo instantly. When sponsorship is configured, the app can use that path for fees; otherwise the wallet pays standard CELO gas.

###  **Integrated Spend**
The long-term goal is a full savings-and-spend loop. For now, the strongest product path is **social saving in cUSD**, backed by real contracts on Celo Sepolia.

---

## ⚡ How it Works (The Magic)

We’ve hidden the complexity of blockchain behind a premium interface:

- **Flexible Gas Handling**: The app can use a configured sponsorship path for supported setups, or fall back to standard CELO gas when sponsorship is not enabled.
- **Log in your way**: Use your email or social media through **Privy**. Behind the scenes, we create a secure **Smart Account** for you instantly.
- **Always With You**: Farsi is a Progressive Web App (PWA). Just "Add to Home Screen" and it feels just like a native app.
- **Premium UX**: Smooth transitions, vibrant toast notifications (`sonner`), and high-fidelity receipts.

---

## 🛠️ Technical Foundation

| Layer | Technology |
| :--- | :--- |
| **Blockchain** | Celo Sepolia (Chain ID: 11142220) |
| **Identity** | Privy (Social/Email Login) & ZeroDev |
| **Frontend** | Next.js 14, Tailwind CSS |
| **Web3** | Wagmi, Viem, RainbowKit |
| **Contracts** | Solidity (Savings Vault, Shared Pots, cUSD-compatible flows) |

---

##  Jump In

### 1. Requirements
You'll need a few project IDs for the full experience:
- [Privy App ID](https://dashboard.privy.io/)
- [WalletConnect Project ID](https://cloud.walletconnect.com/)
- [ZeroDev Project ID](https://dashboard.zerodev.app/)

### 2. Setup
```bash
git clone https://github.com/AltcoinDaddy/farsi.git
cd farsi
npm install --legacy-peer-deps
```

### 3. Configure
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_WC_PROJECT_ID=your_id
NEXT_PUBLIC_PRIVY_APP_ID=your_id
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_id
NEXT_PUBLIC_ENABLE_SPONSORED_TRANSACTIONS=false
NEXT_PUBLIC_CELO_RPC=https://forno.celo-sepolia.celo-testnet.org
PRIVATE_KEY=your_deployment_private_key
```

`PRIVATE_KEY` is required for contract deployment to Celo Sepolia.
`NEXT_PUBLIC_ENABLE_SPONSORED_TRANSACTIONS` should only be turned on when the smart-account sponsorship path is fully configured for the current environment.

### 4. Run
```bash
npm run dev
```

---

## How to Demo
1. **Get Gas**: Fund your wallet with **CELO on Celo Sepolia** so you can send transactions.
2. **Get Stablecoins**: Fund your wallet with **cUSD on Celo Sepolia** or use the MiniPay add-cash path when available.
3. **Save**: Deposit some cUSD into the savings vault.
4. **Socialize**: Create a Social Pot and try contributing.
5. **Verify**: Open the receipt and confirm the transaction on Blockscout.

---
