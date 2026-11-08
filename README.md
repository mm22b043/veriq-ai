# VERIQ AI – Intelligent Vendor Verification & Onboarding Platform

Enterprise-grade AI platform for automated vendor onboarding, document OCR extraction, and multi-field consistency verification. Built for the **Zamp AI Solutions Analyst Case Study (PS-2: Vendor Onboarding — from submission to approval)**.

---

## 🌟 Key Highlights & Design System

- **Brand Identity**: **VERIQ AI** (*Intelligent Vendor Verification & Onboarding*).
- **Dual-Theme System**:
  - **Light Mode**: Soft lavender and porcelain surfaces, clean micro-typography, crisp purple and indigo accents.
  - **Dark Mode**: Deep space void (`#0A0B12`), glowing neon violet and cyber-cyan area charts, glassmorphic cards, and glowing active pills.
- **Micro-Interactions**: Powered by **Framer Motion** with smooth page transitions, layout animations, and card hover elevations.
- **Backend Automation Engine**: Live n8n workflow at `https://zampvendorproject.app.n8n.cloud/webhook/vendor-onboarding`.
- **AI Verification**: Google Gemini for PDF OCR extraction, document seal checking, and cross-field discrepancy analysis.
- **1-Click Demo Presets**: Pre-configured test scenarios for the **Happy Path** and **3 Real-World Edge Cases** (Bank Beneficiary Mismatch, Country/Tax Format Error, Missing Doc) with valid test PDF blobs.

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone or navigate to the project directory
cd /Users/raju/Desktop/Zamp_vendorAi

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application runs locally at `http://localhost:5173`.

---

## ⚙️ Environment Variables

```env
# Production n8n Webhook Endpoint (Receives multipart/form-data)
VITE_N8N_WEBHOOK_URL=https://zampvendorproject.app.n8n.cloud/webhook/vendor-onboarding

# Optional endpoints
VITE_N8N_STATUS_URL=
VITE_N8N_API_BASE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🎯 Demo Test Presets

1. **Happy Path (`Approve`)**:
   - Company: *Apex Cloud Solutions LLC*
   - Bank Account Holder: *Apex Cloud Solutions LLC* (Match)
   - Country & Tax ID: Valid US EIN format.
   - Outcome: **Approved**.

2. **Edge Case 1: Name Mismatch (`Pending / Fraud Risk`)**:
   - Company: *Global Horizon Tech Corp*
   - Bank Account Holder: *Miller Personal Holding Trust* (Beneficiary Mismatch)
   - Outcome: **Pending / Flagged** (Highlights risk of third-party disbursement fraud).

3. **Edge Case 2: Tax Format Error (`Reject / Action Required`)**:
   - Company: *Vanguard Logistics UK Ltd*
   - Country: *United Kingdom*
   - Tax ID: *INVALID-US-TAX-FORMAT-999* (Checksum failure)
   - Outcome: **Rejected / Action Required**.

4. **Edge Case 3: Missing Document (`Pending More Info`)**:
   - Company: *Nordic Clean Energy AB*
   - Missing: Tax Certificate PDF omitted.
   - Outcome: **Pending** with auto-generated clarification email to vendor.
