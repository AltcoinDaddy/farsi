# 🇮 Farsi: Financial Empowerment for New Frontiers

Farsi is a premium mobile-first Decentralized Finance (DeFi) application built on **Flow EVM**. It simplifies complex blockchain interactions into a natural, high-fidelity experience, enabling users to save, earn, and spend their digital assets effortlessly.

---

##  What is Farsi?

In short, **Farsi is a smart money app for your phone.** 

We built Farsi to bridge the gap between "hard-to-use" crypto and everyday life. Think of it like a modern banking app, but built on the next generation of tech. It’s designed for anyone who wants to grow their digital assets without needing a degree in computer science.

### **The Mission**
Our mission is simple: **Financial freedom, simplified.** No seed phrases, no gas fees, just your money working for you.

---

##  Core Features

###  **Live Wallet**
Stay on top of your assets. Our real-time wallet pulls directly from the **Flow EVM Testnet**, showing your live **mUSDC** and **FLOW** balances. Every transaction is block-synced and authentic.

###  **Smart Earn**
Don't let your money sit idle. Farsi Earn connects you to yield-generating vaults. Deposit your mUSDC with a tap, watch it grow through the **ERC-4626 standard**, and withdraw whenever you want. No lock-ups, no hidden catches.

### 🤝 **Social Pots (Save with Friends)**
Project savings, group gifts, or trip funds—on-chain. Create a "Social Pot," set a goal, and invite friends to contribute. It’s transparent, social, and the money is only accessible once the group hits the target.

### 💸 **Global Send**
Seamless P2P transfers. Send mUSDC to anyone on Flow instantly. With **sponsored transactions**, the fees are on us. You just click and go.

### 🛍️ **Integrated Spend**
The "closed loop" of DeFi. Use your mUSDC to purchase gift cards for **Shopping, Travel, and Lifestyle**. Get a dynamic digital receipt for every purchase and spend your digital earnings in the real world.

---

## ⚡ How it Works (The Magic)

We’ve hidden the complexity of blockchain behind a premium interface:

- **No More "Gas"**: Thanks to Flow EVM's sponsored transactions, users never have to hold native tokens just to pay for network fees.
- **Log in your way**: Use your email or social media through **Privy**. Behind the scenes, we create a secure **Smart Account** for you instantly.
- **Always With You**: Farsi is a Progressive Web App (PWA). Just "Add to Home Screen" and it feels just like a native app.
- **Premium UX**: Smooth transitions, vibrant toast notifications (`sonner`), and high-fidelity receipts.

---

## 🛠️ Technical Foundation

| Layer | Technology |
| :--- | :--- |
| **Blockchain** | Flow EVM Testnet (Chain ID: 545) |
| **Identity** | Privy (Social/Email Login) & ZeroDev |
| **Frontend** | Next.js 14, Tailwind CSS |
| **Web3** | Wagmi, Viem, RainbowKit |
| **Contracts** | Solidity (Yield Vaults, Shared Pots, mUSDC) |

---

## 🚀 Jump In

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
NEXT_PUBLIC_FLOW_RPC=https://testnet.evm.nodes.onflow.org
```

### 4. Run
```bash
npm run dev
```

---

## 🏁 How to Demo
1. **Get Funded**: Head to the **Earn** screen and tap the "Get 1000" button to get your test mUSDC.
2. **Grow**: Deposit some funds into the vault to see your yield working.
3. **Socialize**: Create a Social Pot for a "Summer Trip" and try contributing.
4. **Spend**: Buy a Gift Card in the Spend screen and view your dynamic receipt!

---
*Built for the Flow Hacker House 🏆*
