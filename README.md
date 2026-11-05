# VendorFlow AI – Intelligent Vendor Onboarding & Verification Platform

Production-grade, enterprise AI platform for automated vendor onboarding, document OCR extraction, and multi-field consistency verification. Built for the **Zamp AI Solutions Analyst Case Study (PS-2: Vendor Onboarding — from submission to approval)**.

---

## 🌟 Architecture & Highlights

- **Frontend Application**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend Automation Engine**: n8n workflow hosting the webhook pipeline at `https://zampvendorproject.app.n8n.cloud/webhook/vendor-onboarding`.
- **AI Verification**: Google Gemini extracting text and cross-checking registration certificates, tax identifiers, and bank account proofs.
- **Database**: Supabase for persistent vendor records and audit logs.
- **Live Demo Presets**: 1-click test scenarios covering the **Happy Path** and **3 Real-World Edge Cases** for flawless live demonstration during interviews and video recordings.

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

The application will run at `http://localhost:5173`.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
# Production n8n Webhook Endpoint (Receives multipart/form-data)
VITE_N8N_WEBHOOK_URL=https://zampvendorproject.app.n8n.cloud/webhook/vendor-onboarding

# Optional: Dedicated workflow polling endpoint
VITE_N8N_STATUS_URL=

# Optional: REST API base URL
VITE_N8N_API_BASE_URL=

# Optional: Supabase Frontend Read-only Integration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **Note**: You can also update and test endpoints dynamically in real time from the in-app **Settings** page without restarting the dev server.

---

## 📋 Vendor Registration Form Specifications

The form sends real `multipart/form-data` to the n8n webhook:

| Form Field | Description | Type |
|---|---|---|
| `companyName` | Legal Entity Name | Text |
| `contactPerson` | Vendor Representative | Text |
| `email` | Primary Billing / Contact Email | Email |
| `phone` | Phone Number | Text |
| `country` | Country of Registration | Dropdown |
| `address` | Company Registered Office | Text |
| `taxId` | Tax Identification Number / GSTIN / EIN | Text |
| `registrationNumber` | Government Registration Number | Text |
| `bankAccountHolderName` | Name on Bank Account | Text |
| `bankAccountNumber` | Account / IBAN Number | Masked Text |
| `ifscCode` | IFSC / Routing / SWIFT Code | Text |
| `registration_doc` | Certificate of Incorporation PDF | PDF File |
| `tax_doc` | Official Tax Certificate / W-9 / GST PDF | PDF File |
| `bank_proof` | Voided Check or Bank Letter PDF | PDF File |

---

## 🎯 Demo Test Presets (Ready for 5-Minute Video & Live Interview)

On the **Register Vendor** page, use the top banner preset buttons to instantly populate the form and mock PDFs:

1. **Happy Path (`Approve`)**:
   - Company: *Apex Cloud Solutions LLC*
   - Bank Account Holder: *Apex Cloud Solutions LLC* (Exact match)
   - Country & Tax ID: Valid US EIN format.
   - Outcome: **Approved** with disclaimers verified.

2. **Edge Case 1: Name Mismatch (`Pending / Fraud Flag`)**:
   - Company: *Global Horizon Tech Corp*
   - Bank Account Holder: *Miller Personal Holding Trust* (Beneficiary mismatch)
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

---

## 🔒 Security Best Practices

- **Zero Secret Key Exposure**: Gemini API keys and Supabase service-role keys are securely kept inside the private n8n backend.
- **Content-Type Handling**: Axios allows the browser to automatically set boundary markers for multipart uploads.
- **Sensitive Masking**: Bank account numbers are masked in tables and UI logs.

