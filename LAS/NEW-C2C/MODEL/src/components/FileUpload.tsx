import { useState } from "react";
import { Upload, FileText, CheckCircle, FileType } from "lucide-react";
import { generateCOPOMapping, type AIProvider } from "../utils/aiProvider";
import type { MappingData } from "../utils/excelExport";
import { parseSyllabusFile } from "../utils/fileParser";

interface FileUploadProps {
  onLoadingStart: () => void;
  onDataReceived: (data: MappingData) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onLoadingStart,
  onDataReceived,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.txt', '.docx'];
      const isValid = validTypes.includes(selectedFile.type) || validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

      if (isValid) {
        setFile(selectedFile);
      } else {
        onError("Please select a valid syllabus file (.PDF, .TXT, or .DOCX)");
      }
    }
  };

  const [provider, setProvider] = useState<AIProvider>("groq");
  const [customApiKey, setCustomApiKey] = useState("");


  const [status, setStatus] = useState<string>("");

  const handleUpload = async () => {
    if (!file) {
      onError("Please select a file first");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError("File size too large. Please use a file smaller than 5MB.");
      return;
    }

    onLoadingStart();
    setIsProcessing(true);
    setStatus("Parsing syllabus file...");

    try {
      const text = await parseSyllabusFile(file);
      const mappingData = await generateCOPOMapping(
        text,
        customApiKey || undefined,
        provider,
        (msg) => setStatus(msg)
      );
      onDataReceived(mappingData);
    } catch (err: any) {
      console.error("Upload Error:", err);
      let errorMsg = err instanceof Error ? err.message : "Failed to process syllabus";

      // Final Fallback Detection (if BOTH fail)
      if (errorMsg.includes("429") || errorMsg.toLowerCase().includes("rate limit")) {
        errorMsg = `🚨 All AI Engines Busy! \n\nBhai, Groq aur OpenRouter dono ke daily limits khatam ho gaye hain. \n\nKripya 1 ghante baad try karein ya apni khud ki API Key use kijiye.`;
      }

      onError(errorMsg);
    } finally {
      setIsProcessing(false);
      setStatus("");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2 className="upload-title">
          Upload Syllabus
        </h2>
        <p className="upload-subtitle">Supported formats: PDF, DOCX, TXT</p>
      </div>

      {/* AI Provider Toggle */}
      <div className="provider-selector">
        <div className="provider-tabs-scroll">
          <button
            className={`provider-tab ${provider === 'groq' ? 'is-active' : ''}`}
            onClick={() => setProvider('groq')}
          >
            Groq (Llama 70B)
          </button>
          <button
            className={`provider-tab ${provider === 'sambanova' ? 'is-active' : ''}`}
            onClick={() => setProvider('sambanova')}
          >
            SambaNova (Fast-Turbo)
          </button>
          <button
            className={`provider-tab ${provider === 'openrouter' ? 'is-active' : ''}`}
            onClick={() => setProvider('openrouter')}
          >
            OpenRouter (Rescue)
          </button>
        </div>

        <div className="key-input-wrapper">
          <input
            type="password"
            placeholder={
              provider === 'sambanova'
                ? "Enter SambaKey (from cloud.sambanova.ai)"
                : provider === 'groq'
                  ? "Enter Groq Key (Optional)"
                  : "Enter OpenRouter Key"
            }
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            className="input-field-sm"
          />
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        className={`upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <div className="dropzone-content">
          <div className={`dropzone-icon ${file ? 'has-file' : ''}`}>
            {file ? <FileText className="icon-large" /> : <Upload className="icon-large" />}
          </div>

          <div className="dropzone-text-wrapper">
            {file ? (
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <p className="file-meta">{(file.size / 1024).toFixed(1)} KB • Ready to analyze</p>
              </div>
            ) : (
              <>
                <p className="dropzone-prompt">
                  Drag & drop your file here
                </p>
                <p className="dropzone-subprompt">
                  or click to browse
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <input
        id="fileInput"
        type="file"
        accept=".pdf,.txt,.docx"
        onChange={handleFileChange}
        className="hidden"
        style={{ display: 'none' }}
      />

      <button
        onClick={handleUpload}
        disabled={!file || isProcessing}
        className={`btn-primary btn-full ${isProcessing ? 'is-loading' : ''}`}
      >
        {isProcessing ? (
          <>
            <div className="spinner-mini" />
            <span className="animate-pulse">{status || "AI Processing..."}</span>
          </>
        ) : (
          <>
            <FileType className="icon-small" />
            Generate Analysis
          </>
        )}
      </button>

      {/* Info Markers */}
      <div className="upload-status-grid">
        <div className="status-card status-secure">
          <CheckCircle className="icon-status" />
          <div>
            <p className="status-title">{
              provider === 'sambanova' ? 'SambaNova Hub' :
                provider === 'groq' ? 'Groq Primary' : 'Rescue Hub'
            }</p>
            <p className="status-desc">
              {provider === 'sambanova'
                ? 'High-speed Llama-3.3 70B processing.'
                : 'Using multi-tier model fallback for analysis.'}
            </p>
          </div>
        </div>

        <div className="status-card status-smart">
          <CheckCircle className="icon-status" />
          <div>
            <p className="status-title">Smart Resilience</p>
            <p className="status-desc">Automatically cycles through 3 backup hubs if a server is busy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
