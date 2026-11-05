import React, { useState } from 'react';
import {
  Building2,
  FileCheck,
  Landmark,
  FileText,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import StatusBadge from '../components/StatusBadge';
import { submitVendor, getConfig } from '../services/api';

// Helper to generate a minimal valid PDF Blob for fast demo testing
const createDemoPdfBlob = (filename, contentText) => {
  const dummyPdfContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 55 >>\nstream\nBT /F1 12 Tf 50 700 Td (${contentText || 'Vendor Document Proof'}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000201 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n308\n%%EOF`;
  return new File([dummyPdfContent], filename, { type: 'application/pdf' });
};

export default function VendorRegistration() {
  const config = getConfig();

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: 'United States',
    address: '',
    taxId: '',
    registrationNumber: '',
    bankAccountHolderName: '',
    bankAccountNumber: '',
    ifscCode: '',
  });

  // Files State
  const [files, setFiles] = useState({
    registration_doc: null,
    tax_doc: null,
    bank_proof: null,
  });

  // Submission & UI States
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileRemove = (field) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
  };

  // Preset edge cases & happy path for 5-minute video demo
  const applyPreset = (presetType) => {
    setSubmissionResult(null);
    setErrorMessage(null);
    setFormErrors({});

    if (presetType === 'happy') {
      setFormData({
        companyName: 'Apex Cloud Solutions LLC',
        contactPerson: 'Sarah Jenkins',
        email: 'billing@apexcloud.io',
        phone: '+1 (555) 234-5678',
        country: 'United States',
        address: '100 Montgomery St, Suite 1500, San Francisco, CA 94104',
        taxId: 'US-94-3829104',
        registrationNumber: 'LLC-CA-2021-98762',
        bankAccountHolderName: 'Apex Cloud Solutions LLC',
        bankAccountNumber: '987654321098',
        ifscCode: 'CHASUS33',
      });
      setFiles({
        registration_doc: createDemoPdfBlob('Apex_Cloud_Articles_of_Incorporation.pdf', 'Apex Cloud Solutions LLC Certificate of Incorporation'),
        tax_doc: createDemoPdfBlob('Apex_W9_Tax_Registration.pdf', 'US EIN 94-3829104 Apex Cloud Solutions LLC'),
        bank_proof: createDemoPdfBlob('Apex_Voided_Check.pdf', 'JPMorgan Chase Bank Voided Check Apex Cloud Solutions LLC'),
      });
    } else if (presetType === 'mismatch_name') {
      // Edge Case 1: Company Name vs Bank Beneficiary Mismatch (Common Payment Fraud vector)
      setFormData({
        companyName: 'Global Horizon Tech Corp',
        contactPerson: 'David Miller',
        email: 'finance@globalhorizon.com',
        phone: '+1 (555) 876-1234',
        country: 'United States',
        address: '450 Lexington Ave, New York, NY 10017',
        taxId: 'US-13-4920194',
        registrationNumber: 'CORP-NY-49201',
        bankAccountHolderName: 'Miller Personal Holding Trust', // Inconsistency!
        bankAccountNumber: '123456789012',
        ifscCode: 'BOFAUS3N',
      });
      setFiles({
        registration_doc: createDemoPdfBlob('Global_Horizon_Certificate.pdf', 'Global Horizon Tech Corp Certificate'),
        tax_doc: createDemoPdfBlob('Global_Horizon_Tax_ID.pdf', 'EIN 13-4920194 Global Horizon Tech Corp'),
        bank_proof: createDemoPdfBlob('Personal_Holding_Account_Statement.pdf', 'Bank Statement: Beneficiary Miller Personal Holding Trust'),
      });
    } else if (presetType === 'tax_format') {
      // Edge Case 2: Country vs Tax ID format mismatch
      setFormData({
        companyName: 'Vanguard Logistics UK Ltd',
        contactPerson: 'Nigel Campbell',
        email: 'accounts@vanguardlogistics.co.uk',
        phone: '+44 20 7946 0912',
        country: 'United Kingdom',
        address: '25 Fenchurch Avenue, London EC3M 5AD',
        taxId: 'INVALID-US-TAX-FORMAT-999', // Invalid tax format for UK VAT
        registrationNumber: 'UK-08472910',
        bankAccountHolderName: 'Vanguard Logistics UK Ltd',
        bankAccountNumber: '445566778899',
        ifscCode: 'BARCGB22',
      });
      setFiles({
        registration_doc: createDemoPdfBlob('Vanguard_Companies_House.pdf', 'Companies House UK Registration Vanguard Logistics'),
        tax_doc: createDemoPdfBlob('Vanguard_Tax_Certificate.pdf', 'Invalid Tax Form Vanguard Logistics'),
        bank_proof: createDemoPdfBlob('Barclays_Bank_Proof.pdf', 'Barclays Bank Verification Letter Vanguard Logistics UK'),
      });
    } else if (presetType === 'missing_doc') {
      // Edge Case 3: Missing Tax Certificate Document
      setFormData({
        companyName: 'Nordic Clean Energy AB',
        contactPerson: 'Astrid Lindqvist',
        email: 'procurement@nordicenergy.se',
        phone: '+46 8 123 4567',
        country: 'Sweden',
        address: 'Sveavägen 44, Stockholm',
        taxId: 'SE556677889901',
        registrationNumber: 'SE-556677-8899',
        bankAccountHolderName: 'Nordic Clean Energy AB',
        bankAccountNumber: '887766554433',
        ifscCode: 'HANDSEEE',
      });
      setFiles({
        registration_doc: createDemoPdfBlob('Nordic_Bolagsverket_Cert.pdf', 'Bolagsverket Registration Nordic Clean Energy'),
        tax_doc: null, // Intentionally missing tax document!
        bank_proof: createDemoPdfBlob('Handelsbanken_Proof.pdf', 'Handelsbanken Account Confirmation Nordic Clean Energy'),
      });
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!formData.taxId.trim()) errors.taxId = 'Tax ID / GSTIN is required';
    if (!formData.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required';
    if (!formData.bankAccountHolderName.trim()) errors.bankAccountHolderName = 'Bank account holder name is required';
    if (!formData.bankAccountNumber.trim()) errors.bankAccountNumber = 'Bank account number is required';

    // File validations
    if (!files.registration_doc) errors.registration_doc = 'Registration certificate PDF is required';
    if (!files.tax_doc) errors.tax_doc = 'Tax certificate PDF is required';
    if (!files.bank_proof) errors.bank_proof = 'Bank proof PDF is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmissionResult(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    // Build standard multipart/form-data
    const data = new FormData();
    data.append('companyName', formData.companyName);
    data.append('company_name', formData.companyName); // compatibility alias
    data.append('contactPerson', formData.contactPerson);
    data.append('contact_person', formData.contactPerson);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('country', formData.country);
    data.append('address', formData.address);
    data.append('taxId', formData.taxId);
    data.append('tax_id', formData.taxId);
    data.append('registrationNumber', formData.registrationNumber);
    data.append('registration_number', formData.registrationNumber);
    data.append('bankAccountHolderName', formData.bankAccountHolderName);
    data.append('bank_account_holder_name', formData.bankAccountHolderName);
    data.append('bankAccountNumber', formData.bankAccountNumber);
    data.append('bank_account_number', formData.bankAccountNumber);
    data.append('ifscCode', formData.ifscCode);
    data.append('ifsc_code', formData.ifscCode);

    // Attach required files with exact field names
    if (files.registration_doc) {
      data.append('registration_doc', files.registration_doc);
    }
    if (files.tax_doc) {
      data.append('tax_doc', files.tax_doc);
    }
    if (files.bank_proof) {
      data.append('bank_proof', files.bank_proof);
    }

    try {
      const res = await submitVendor(data, (percent) => {
        setUploadProgress(percent);
      });

      setSubmissionResult(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      const detail = err.response?.data?.message || err.message || 'Unknown network error';
      setErrorMessage(`Failed to connect to n8n webhook: ${detail}. Please check if the n8n workflow is active or verify CORS settings.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      country: 'United States',
      address: '',
      taxId: '',
      registrationNumber: '',
      bankAccountHolderName: '',
      bankAccountNumber: '',
      ifscCode: '',
    });
    setFiles({
      registration_doc: null,
      tax_doc: null,
      bank_proof: null,
    });
    setSubmissionResult(null);
    setErrorMessage(null);
    setFormErrors({});
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Quick Demo Pre-fill Bar (Essential for the 5-minute video demo) */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Demo Test Presets (1-Click Test Scenarios)
              </h4>
              <p className="text-2xs text-indigo-700">
                Instantly pre-fill inputs & sample PDFs to demo the happy path and edge cases live:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('happy')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
            >
              Happy Path (Approve)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('mismatch_name')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-colors"
              title="Bank Account Name differs from registered Legal Entity"
            >
              Edge Case 1: Name Mismatch
            </button>
            <button
              type="button"
              onClick={() => applyPreset('tax_format')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors"
              title="Country does not match Tax ID format"
            >
              Edge Case 2: Tax Format Error
            </button>
            <button
              type="button"
              onClick={() => applyPreset('missing_doc')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white shadow-2xs transition-colors"
              title="Missing Tax Certificate PDF"
            >
              Edge Case 3: Missing Doc
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-white transition-colors"
              title="Reset Form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Real Response Notification Card */}
      {submissionResult && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Workflow Evaluation Received from n8n
                  </h3>
                  <StatusBadge status={submissionResult.savedRecord?.decision || submissionResult.data?.decision} size="lg" />
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Vendor ID: <span className="font-bold text-slate-800">{submissionResult.savedRecord?.vendorId}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubmissionResult(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Dismiss
            </button>
          </div>

          {/* Decision Reason */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Decision & AI Reasoning
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed">
              {submissionResult.savedRecord?.decisionReason || 'Evaluation completed. Check verification report for extracted parameters.'}
            </p>
          </div>

          {/* Raw Response Viewer Toggle */}
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer font-medium hover:text-slate-800 select-none">
              View raw payload from n8n
            </summary>
            <pre className="mt-2 p-3 bg-slate-900 text-emerald-400 rounded-xl text-2xs font-mono overflow-x-auto max-h-48">
              {JSON.stringify(submissionResult.rawResponse, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-900 shadow-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-900">Submission Failure</h4>
            <p className="mt-1 text-xs text-rose-800 leading-relaxed">{errorMessage}</p>
            <p className="mt-2 text-2xs text-rose-700">
              Verify your n8n workflow has the Webhook node active and listening on POST at{' '}
              <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">{config.n8nWebhookUrl}</code>
            </p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Company Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">1. Company Information</h3>
              <p className="text-2xs text-slate-500">Primary legal entity identity and contact profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g. Apex Cloud Solutions LLC"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  formErrors.companyName
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {formErrors.companyName && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="e.g. Sarah Jenkins"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  formErrors.contactPerson
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {formErrors.contactPerson && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.contactPerson}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="billing@company.com"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  formErrors.email
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {formErrors.email && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country <span className="text-rose-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="Singapore">Singapore</option>
                <option value="Sweden">Sweden</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, City, Postal Code"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">2. Business & Tax Identifiers</h3>
              <p className="text-2xs text-slate-500">Government registrations and tax classification numbers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tax ID / GSTIN / EIN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="e.g. US-94-3829104 or 27AAAAA0000A1Z5"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  formErrors.taxId
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {formErrors.taxId && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.taxId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Registration Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                placeholder="e.g. LLC-CA-2021-98762"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  formErrors.registrationNumber
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {formErrors.registrationNumber && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.registrationNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Bank Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">3. Banking & Disbursement Details</h3>
              <p className="text-2xs text-slate-500">Cross-verified against bank proof to prevent payment fraud</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Account Holder Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="bankAccountHolderName"
                value={formData.bankAccountHolderName}
                onChange={handleInputChange}
                placeholder="Exact legal name on bank record"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  formErrors.bankAccountHolderName
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {formErrors.bankAccountHolderName && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.bankAccountHolderName}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
                placeholder="Account or IBAN"
                className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  formErrors.bankAccountNumber
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {formErrors.bankAccountNumber && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.bankAccountNumber}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                IFSC / SWIFT / Routing Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                placeholder="e.g. CHASUS33 or HDFC0001234"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Document Upload */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">4. Supporting Compliance Documents (PDF)</h3>
              <p className="text-2xs text-slate-500">
                Uploaded PDFs will be passed to Gemini AI inside n8n for OCR text extraction and cross-check
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FileUpload
                label="Company Registration Certificate"
                name="registration_doc"
                required
                file={files.registration_doc}
                onChange={(f) => handleFileChange('registration_doc', f)}
                onRemove={() => handleFileRemove('registration_doc')}
                progress={uploadProgress}
                description="Articles of Incorporation / Org Proof"
              />
              {formErrors.registration_doc && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.registration_doc}</p>
              )}
            </div>

            <div>
              <FileUpload
                label="Tax Certificate / W-9 / GST"
                name="tax_doc"
                required
                file={files.tax_doc}
                onChange={(f) => handleFileChange('tax_doc', f)}
                onRemove={() => handleFileRemove('tax_doc')}
                progress={uploadProgress}
                description="Official Tax Registration proof"
              />
              {formErrors.tax_doc && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.tax_doc}</p>
              )}
            </div>

            <div>
              <FileUpload
                label="Bank Proof Document"
                name="bank_proof"
                required
                file={files.bank_proof}
                onChange={(f) => handleFileChange('bank_proof', f)}
                onRemove={() => handleFileRemove('bank_proof')}
                progress={uploadProgress}
                description="Voided check or official statement"
              />
              {formErrors.bank_proof && (
                <p className="text-2xs text-rose-600 mt-1">{formErrors.bank_proof}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Targeting live n8n webhook:</span>
            <code className="text-2xs font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-xs">
              {config.n8nWebhookUrl}
            </code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 ${
              loading ? 'cursor-wait' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Triggering n8n AI Workflow ({uploadProgress > 0 ? `${uploadProgress}%` : 'Processing'}...)...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Vendor Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

