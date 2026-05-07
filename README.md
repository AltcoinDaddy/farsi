# Farsi: Save Together on Celo

Farsi is a mobile-first savings application built on **Celo** for **MiniPay-style stablecoin users**. It simplifies blockchain interactions into a guided experience for saving, contributing, and moving digital dollars on testnet.

---

##  What is Farsi?

In short, **Farsi is a smart money app for your phone.** 

We built Farsi to bridge the gap between "hard-to-use" crypto and everyday life. Think of it like a modern banking app, but built for **Celo stablecoin flows**. It’s designed for anyone who wants to save together and move digital dollars without needing a degree in computer science.

### **The Mission**
Our mission is simple: **Financial freedom, simplified.** No seed phrase drama, no chain confusion, just practical saving and social finance on mobile.

---

##  Core Features

###  **On-Chain Proof (Verifiable Receipts)**
Trust, but verify. Every action in Farsi generates a receipt linked to **Blockscout on Celo Sepolia**, so testnet transactions can be checked directly onchain.

###  **Wallet Snapshot**
Stay on top of your assets. The wallet reads directly from **Celo Sepolia**, showing current **cUSD** and **CELO** balances for the connected account.

###  **Smart Save**
Farsi Save connects you to a simple savings vault on testnet. Deposit cUSD with a tap and withdraw whenever you want while the product direction is still being validated.

###  **Social Pots (Save with Friends)**
Project savings, group gifts, or trip funds—on-chain. Create a "Social Pot," set a goal, and invite friends to contribute. It’s transparent, social, and the money is only accessible once the group hits the target.

###  **Global Send**
Simple P2P transfers. Send cUSD to another address on Celo. If an alternate transaction path is configured for the current environment, the app uses it; otherwise the wallet pays standard CELO gas.

###  **Focused v1**
Farsi is deliberately centered on **Save, Pots, and Send** for the current MiniPay/Celo version. Spend flows are parked until there is a real MiniPay-native payment or cash-out path to support them.

---

## ⚡ How it Works (The Magic)

We’ve hidden the complexity of blockchain behind a premium interface:

- **Flexible Gas Handling**: The app can use a configured transaction path for supported setups, or fall back to standard CELO gas.
- **Log in your way**: Use your email or social media through **Privy**. In MiniPay, the app can also rely on the injected wallet session.
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
NEXT_PUBLIC_MINIPAY_APP_URL=https://your-public-app-url.example
PRIVATE_KEY=your_deployment_private_key
```

`PRIVATE_KEY` is required for contract deployment to Celo Sepolia.
`NEXT_PUBLIC_ENABLE_SPONSORED_TRANSACTIONS` should only be turned on when the smart-account sponsorship path is fully configured for the current environment.
`NEXT_PUBLIC_MINIPAY_APP_URL` should point to the public HTTPS URL you plan to submit to MiniPay so `browse?url=...` deeplinks can open Farsi directly inside MiniPay.

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
