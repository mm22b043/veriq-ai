import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, UploadCloud, X, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function FileUpload({
  label,
  required = false,
  file,
  onChange,
  onRemove,
  progress = 0,
  description = 'PDF format only, maximum 10MB',
  name
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file type. Please upload a PDF document.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    onChange(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {file && (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Attached
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {!file ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/15 shadow-[0_0_20px_-4px_rgba(139,92,246,0.3)]'
              : error
              ? 'border-rose-300 bg-rose-50/40 dark:border-rose-500/40 dark:bg-rose-500/10'
              : 'border-slate-200 dark:border-white/10 hover:border-brand-400 dark:hover:border-brand-500/60 bg-slate-50/40 dark:bg-white/[0.02] hover:bg-brand-50/30 dark:hover:bg-white/[0.04] hover:shadow-[0_0_16px_-4px_rgba(139,92,246,0.2)]'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.div
              animate={dragActive ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-xl bg-white dark:bg-dark-elevated shadow-xs border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-brand-600 dark:text-brand-400"
            >
              <UploadCloud className="w-5 h-5" />
            </motion.div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span className="text-brand-600 dark:text-brand-400 hover:underline">Click to upload</span> or drag & drop
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{description}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="border border-emerald-200 dark:border-emerald-500/25 bg-emerald-50/60 dark:bg-emerald-500/5 rounded-2xl p-3.5 flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{formatFileSize(file.size)} • PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* ✅ Download Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              title="Download this PDF"
              className="p-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/15 transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 font-semibold px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                onRemove();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Upload progress bar */}
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden mt-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-brand-600 to-indigo-500 h-1.5 rounded-full shadow-glow-sm"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
