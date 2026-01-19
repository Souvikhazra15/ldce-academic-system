import { useState } from 'react'
import { FileUpload } from './components/FileUpload'
import { Dashboard } from './components/Dashboard'
import { LoadingSpinner } from './components/LoadingSpinner'
import { LayoutDashboard, ArrowLeft } from 'lucide-react'
import './App.css'
import type { MappingData } from './utils/excelExport'

function App() {
  const [mappingData, setMappingData] = useState<MappingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLoadingStart = () => {
    setLoading(true)
    setError(null)
  }

  const handleDataReceived = (data: MappingData) => {
    setMappingData(data)
    setLoading(false)
  }

  const handleError = (errorMsg: string) => {
    setError(errorMsg)
    setLoading(false)
  }

  return (
    <div className="layout-root">
      {/* Premium Glass Header */}
      <header className="glass-header">
        <div className="brand-container">
          <div className="logo-wrapper">
            <LayoutDashboard className="icon-logo" />
          </div>
          <div>
            <h1 className="app-title">
              Nexus AI
            </h1>
            <p className="app-subtitle">NBA ACCREDITATION SUITE</p>
          </div>
        </div>

        {mappingData && (
          <button
            onClick={() => setMappingData(null)}
            className="btn-back"
          >
            <ArrowLeft className="icon-small" />
            New Analysis
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="main-container">
        <div className="content-wrapper">
          {loading && (
            <div className="loading-wrapper">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="status-error">
              <div className="error-content">
                <div className="error-icon-wrapper">
                  <svg className="icon-error" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="error-text">
                  <h3 className="error-heading">Analysis Failed</h3>
                  <div className="error-msg">
                    <p>{error}</p>
                  </div>
                  <div className="error-actions">
                    <button
                      onClick={() => setError(null)}
                      className="btn-dismiss"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!mappingData && !loading && (
            <div className="welcome-section">
              <div className="welcome-header">
                <h2 className="heading-hero">Transform Your Syllabus</h2>
                <p className="hero-text">
                  Upload your course document and let our AI generate comprehensive CO-PO maps, lecture plans, and accreditation data in seconds.
                </p>
              </div>
              <FileUpload
                onLoadingStart={handleLoadingStart}
                onDataReceived={handleDataReceived}
                onError={handleError}
              />
            </div>
          )}

          {mappingData && (
            <Dashboard data={mappingData} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="layout-footer">
        <p>&copy; 2024 Nexus AI for NBA Accreditation. Powered by Advanced LLMs.</p>
      </footer>
    </div>
  )
}

export default App
