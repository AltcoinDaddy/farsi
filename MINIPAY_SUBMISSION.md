# MiniPay Submission Checklist

This file tracks the current Farsi readiness state for MiniPay submission.

## Product URL

- Public HTTPS app URL: pending deployment
- `NEXT_PUBLIC_MINIPAY_APP_URL`: supported in code, should be set once the public URL exists

## Technical Requirements

- Auto-connect to wallet: implemented for MiniPay injected wallets
- Mobile optimized layout: current app targets a mobile-sized container and mobile-first screens
- Celo support: app and contracts are on Celo Sepolia
- Graceful wallet errors: transaction flows surface toast errors and validation messages
- Performance review: pending production PageSpeed run after deployment

## In-App Listing Requirements

- Support URL: available in-app at `/support`
- Privacy Policy: available in-app at `/privacy`
- Terms of Use: available in-app at `/terms`
- MiniPay deeplinks:
  - Add Cash
  - Browse / Discover
  - Receipt
  - Invite Friends
  - QR

## Still Needed Before Submission

- Deploy the production HTTPS URL
- Run PageSpeed Insights on the production URL
- Build the network manifest of app origins and third-party services
- Test the full flow on a real device inside MiniPay developer mode
- Prepare final screenshots, icon, and listing copy
