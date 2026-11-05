import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Configuration helper allowing runtime overrides via localStorage or Vite env
export const getConfig = () => {
  const localConfig = localStorage.getItem('vendorflow_config');
  let parsed = {};
  if (localConfig) {
    try {
      parsed = JSON.parse(localConfig);
    } catch (e) {
      console.error('Failed to parse local config', e);
    }
  }

  return {
    n8nWebhookUrl: parsed.n8nWebhookUrl || import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://zampvendorproject.app.n8n.cloud/webhook/vendor-onboarding',
    n8nStatusUrl: parsed.n8nStatusUrl || import.meta.env.VITE_N8N_STATUS_URL || '',
    n8nApiBaseUrl: parsed.n8nApiBaseUrl || import.meta.env.VITE_N8N_API_BASE_URL || '',
    supabaseUrl: parsed.supabaseUrl || import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: parsed.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };
};

export const saveConfig = (newConfig) => {
  localStorage.setItem('vendorflow_config', JSON.stringify(newConfig));
};

// Supabase client instance (initialized only if URL and Anon Key are present)
let supabaseClient = null;
export const getSupabase = () => {
  const cfg = getConfig();
  if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
    if (!supabaseClient) {
      supabaseClient = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    }
    return supabaseClient;
  }
  return null;
};

// Local storage audit & vendor cache helper
// Stores real submissions made during live demo sessions so they persist across tabs
const STORAGE_KEY_VENDORS = 'vendorflow_live_vendors';
const STORAGE_KEY_AUDIT = 'vendorflow_live_audit';

export const getStoredVendors = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VENDORS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredVendor = (vendor) => {
  const current = getStoredVendors();
  const existingIdx = current.findIndex(v => v.id === vendor.id || (vendor.vendorId && v.vendorId === vendor.vendorId));
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...vendor };
  } else {
    updated = [vendor, ...current];
  }
  localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(updated));
  return updated;
};

export const getStoredAuditLogs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const appendStoredAuditLog = (logEntry) => {
  const current = getStoredAuditLogs();
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    ...logEntry
  };
  const updated = [entry, ...current];
  localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updated));
  return updated;
};

/**
 * 1. Submit Vendor Application to n8n Webhook
 * Sends multipart/form-data to n8n webhook.
 * Browser automatically sets Content-Type with multipart boundary.
 */
export const submitVendor = async (formData, onUploadProgress) => {
  const config = getConfig();
  if (!config.n8nWebhookUrl) {
    throw new Error('n8n Webhook URL is not configured. Please check Settings or .env file.');
  }

  // Record audit log for submission initiation
  appendStoredAuditLog({
    action: 'VENDOR_SUBMISSION_ATTEMPTED',
    vendorName: formData.get('companyName') || formData.get('company_name') || 'Unknown',
    details: 'Initiated submission request to n8n webhook.',
  });

  try {
    const response = await axios.post(config.n8nWebhookUrl, formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percent);
        }
      },
      // Do NOT set 'Content-Type': 'multipart/form-data' so Axios allows the browser to set boundary
    });

    const data = response.data;

    // Normalizing response payload from n8n
    // n8n can return { status, decision, decisionReasons, vendorId, ... } or an array
    const resultObj = Array.isArray(data) ? data[0] : (typeof data === 'object' && data !== null ? data : { raw: data });

    const generatedId = resultObj.vendorId || resultObj.id || `VEND-${Date.now().toString().slice(-6)}`;
    const decision = (resultObj.decision || resultObj.status || 'Pending').toLowerCase();
    const formattedDecision = decision.includes('approv') ? 'Approved' 
      : decision.includes('reject') ? 'Rejected' 
      : 'Pending';

    // Store in local persistent storage for real live demo tracking across dashboard/reports
    const savedRecord = {
      id: generatedId,
      vendorId: generatedId,
      companyName: formData.get('companyName') || resultObj.companyName || 'N/A',
      contactPerson: formData.get('contactPerson') || resultObj.contactPerson || 'N/A',
      email: formData.get('email') || resultObj.email || 'N/A',
      phone: formData.get('phone') || resultObj.phone || 'N/A',
      country: formData.get('country') || resultObj.country || 'N/A',
      address: formData.get('address') || resultObj.address || 'N/A',
      taxId: formData.get('taxId') || resultObj.taxId || 'N/A',
      registrationNumber: formData.get('registrationNumber') || resultObj.registrationNumber || 'N/A',
      bankAccountHolderName: formData.get('bankAccountHolderName') || resultObj.bankAccountHolderName || 'N/A',
      bankAccountNumber: formData.get('bankAccountNumber') ? `••••${String(formData.get('bankAccountNumber')).slice(-4)}` : '••••',
      ifscCode: formData.get('ifscCode') || resultObj.ifscCode || 'N/A',
      decision: formattedDecision,
      decisionReason: resultObj.decisionReason || resultObj.decisionReasons || resultObj.reason || resultObj.message || (formattedDecision === 'Approved' ? 'All documents and cross-field validations passed successfully.' : 'Verification requires review or missing items detected.'),
      extractedData: resultObj.extractedData || resultObj.verificationReport || resultObj,
      rawResponse: data,
      submissionDate: new Date().toISOString(),
      documents: {
        registration_doc: formData.get('registration_doc')?.name || 'Uploaded',
        tax_doc: formData.get('tax_doc')?.name || 'Uploaded',
        bank_proof: formData.get('bank_proof')?.name || 'Uploaded',
      }
    };

    saveStoredVendor(savedRecord);

    appendStoredAuditLog({
      action: 'VENDOR_SUBMISSION_COMPLETED',
      vendorId: generatedId,
      vendorName: savedRecord.companyName,
      details: `Verification completed with decision: ${formattedDecision}`,
    });

    return {
      success: true,
      data: resultObj,
      rawResponse: data,
      savedRecord
    };
  } catch (error) {
    appendStoredAuditLog({
      action: 'VENDOR_SUBMISSION_FAILED',
      vendorName: formData.get('companyName') || 'Unknown',
      details: `Submission failed: ${error.response?.data?.message || error.message}`,
    });

    throw error;
  }
};

/**
 * 2. Get All Vendors
 * Tries backend endpoint, then Supabase, falls back to real live stored vendor records.
 */
export const getVendors = async () => {
  const config = getConfig();

  // Try configured backend REST endpoint
  if (config.n8nApiBaseUrl) {
    try {
      const res = await axios.get(`${config.n8nApiBaseUrl}/vendors`, { timeout: 4000 });
      if (res.data) {
        return { source: 'backend', data: res.data };
      }
    } catch (e) {
      console.warn('Backend REST endpoint not reachable, checking alternatives:', e.message);
    }
  }

  // Try Supabase directly if configured
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { source: 'supabase', data };
      }
    } catch (err) {
      console.warn('Supabase query failed:', err.message);
    }
  }

  // Fallback to real recorded submissions made through the UI
  const localVendors = getStoredVendors();
  return {
    source: 'live_submissions',
    data: localVendors,
    backendConfigured: Boolean(config.n8nApiBaseUrl || config.supabaseUrl)
  };
};

/**
 * 3. Get Vendor By ID
 */
export const getVendorById = async (id) => {
  const config = getConfig();

  if (config.n8nApiBaseUrl) {
    try {
      const res = await axios.get(`${config.n8nApiBaseUrl}/vendors/${id}`);
      return res.data;
    } catch (e) {
      console.warn('Backend fetch failed, falling back to local store:', e.message);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase query failed:', err.message);
    }
  }

  const local = getStoredVendors();
  return local.find(v => v.id === id || v.vendorId === id) || null;
};

/**
 * 4. Get Workflow Status
 */
export const getWorkflowStatus = async (runId) => {
  const config = getConfig();

  if (config.n8nStatusUrl) {
    try {
      const res = await axios.get(`${config.n8nStatusUrl}?id=${encodeURIComponent(runId)}`, { timeout: 5000 });
      return { available: true, data: res.data };
    } catch (e) {
      return { available: false, error: e.message };
    }
  }

  return { available: false, error: 'VITE_N8N_STATUS_URL is not configured.' };
};

/**
 * 5. Get Verification Reports
 */
export const getVerificationReports = async () => {
  const vendorsResult = await getVendors();
  return vendorsResult.data || [];
};

/**
 * 6. Get Audit History
 */
export const getAuditHistory = async () => {
  const config = getConfig();

  if (config.n8nApiBaseUrl) {
    try {
      const res = await axios.get(`${config.n8nApiBaseUrl}/audit-logs`);
      return { source: 'backend', data: res.data };
    } catch (e) {
      console.warn('Failed to fetch backend audit logs:', e.message);
    }
  }

  const storedLogs = getStoredAuditLogs();
  return {
    source: 'live_submissions',
    data: storedLogs,
    backendConfigured: Boolean(config.n8nApiBaseUrl)
  };
};

/**
 * Clear live test data
 */
export const clearStoredData = () => {
  localStorage.removeItem(STORAGE_KEY_VENDORS);
  localStorage.removeItem(STORAGE_KEY_AUDIT);
};

