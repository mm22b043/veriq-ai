import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Database,
  Trash2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { getConfig, saveConfig, clearStoredData } from '../services/api';
import axios from 'axios';

export default function Settings() {
  const [config, setConfig] = useState({
    n8nWebhookUrl: '',
    n8nStatusUrl: '',
    n8nApiBaseUrl: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    const defaults = {
      n8nWebhookUrl: 'https://zampvendorproject.app.n8n.cloud/webhook/vendor-onboarding',
      n8nStatusUrl: '',
      n8nApiBaseUrl: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
    };
    setConfig(defaults);
    saveConfig(defaults);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setTestResult(null);
    try {
      if (!config.n8nWebhookUrl) {
        throw new Error('Please enter an n8n webhook URL first.');
      }

      // Test webhook reachable
      const res = await axios.post(
        config.n8nWebhookUrl,
        { ping: true, test: 'connectivity_probe', timestamp: new Date().toISOString() },
        { timeout: 8000 }
      );

      setTestResult({
        success: true,
        message: `Connection successful! Status: ${res.status} (${res.statusText || 'OK'}). n8n webhook is online and accepting requests.`,
        data: res.data
      });
    } catch (err) {
      // Often n8n webhooks require specific keys or multipart, so getting a 4xx/5xx still confirms the URL is reachable!
      if (err.response) {
        setTestResult({
          success: true,
          message: `Webhook endpoint reached! HTTP Status: ${err.response.status} (${err.response.statusText}). Endpoint is active.`,
          data: err.response.data
        });
      } else {
        setTestResult({
          success: false,
          message: `Connection failed: ${err.message}. Please check if the workflow is Active in n8n or check network/CORS settings.`
        });
      }
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all recorded vendor submissions and audit events stored in this browser session?')) {
      clearStoredData();
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System & Integration Settings</h2>
        <p className="text-xs text-slate-500">
          Configure connection endpoints for n8n workflows, Google Gemini AI pipeline, and Supabase database
        </p>
      </div>

      {/* Security Advisory Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold">Enterprise Security Policy</p>
          <p className="text-2xs text-amber-800 mt-0.5">
            Never expose secret credentials (such as Supabase service-role keys or Gemini API keys) in the browser. 
            All secure AI processing and document OCR is handled on your private n8n server. The frontend only communicates with your authenticated webhook.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* n8n Integration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">n8n Workflow Integration</h3>
              <p className="text-2xs text-slate-500">Endpoints running the AI onboarding automation</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                n8n Webhook URL (Vendor Onboarding Trigger) <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                name="n8nWebhookUrl"
                value={config.n8nWebhookUrl}
                onChange={handleChange}
                placeholder="https://your-n8n.cloud/webhook/vendor-onboarding"
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <p className="text-2xs text-slate-400 mt-1">
                The production webhook URL configured in your n8n workflow. Accepts POST with multipart/form-data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  n8n Status Poll URL (Optional)
                </label>
                <input
                  type="url"
                  name="n8nStatusUrl"
                  value={config.n8nStatusUrl}
                  onChange={handleChange}
                  placeholder="https://your-n8n.cloud/webhook/status"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  n8n API Base URL (Optional REST endpoints)
                </label>
                <input
                  type="url"
                  name="n8nApiBaseUrl"
                  value={config.n8nApiBaseUrl}
                  onChange={handleChange}
                  placeholder="https://your-backend.com/api"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl transition-colors border border-slate-200"
              >
                <Zap className={`w-3.5 h-3.5 ${testingWebhook ? 'animate-pulse text-indigo-600' : 'text-slate-500'}`} />
                {testingWebhook ? 'Testing Connectivity...' : 'Test Webhook Connectivity'}
              </button>

              {testResult && (
                <span className={`text-xs flex items-center gap-1.5 ${testResult.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span className="truncate max-w-md">{testResult.message}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Supabase Integration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supabase Database Integration</h3>
              <p className="text-2xs text-slate-500">Query vendor tables directly from the browser (Read-only Anon Key)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                name="supabaseUrl"
                value={config.supabaseUrl}
                onChange={handleChange}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Public Anon Key
              </label>
              <input
                type="password"
                name="supabaseAnonKey"
                value={config.supabaseAnonKey}
                onChange={handleChange}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save and Reset Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>

          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Configuration saved successfully
            </span>
          )}

          {/* Clear Cache */}
          <button
            type="button"
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Demo Submission Cache
          </button>
        </div>

        {cacheCleared && (
          <p className="text-xs text-emerald-600 font-medium text-right">
            Demo submission cache cleared.
          </p>
        )}
      </form>
    </div>
  );
}

