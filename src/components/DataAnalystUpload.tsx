import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const DataAnalystUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setReport(null);
    setPdfUrl(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", "demo-user"); // Replace with real user id if available
    formData.append("pdf", "true");
    try {
      const res = await fetch(`${API_URL}/data-analyst/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
        if (data.pdf_url) setPdfUrl(`${API_URL}${data.pdf_url}`);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Data Analyst AI</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{ marginLeft: 8 }}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      {report && (
        <div style={{ marginTop: 24 }}>
          <h3>Summary</h3>
          <pre style={{ background: "#f8f8f8", padding: 12 }}>
            {report.summary}
          </pre>
          <h3>Plots</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {Object.entries(report.plots).map(([name, b64]: any) => (
              <div key={name} style={{ textAlign: "center" }}>
                <img
                  src={`data:image/png;base64,${b64}`}
                  alt={name}
                  style={{ maxWidth: 200, maxHeight: 150 }}
                />
                <div style={{ fontSize: 12 }}>{name}</div>
              </div>
            ))}
          </div>
          <h3>Descriptive Statistics</h3>
          <pre style={{ background: "#f8f8f8", padding: 12 }}>
            {JSON.stringify(report.description, null, 2)}
          </pre>
          {report.forecast && (
            <>
              <h3>Forecast</h3>
              <pre style={{ background: "#f8f8f8", padding: 12 }}>
                {JSON.stringify(report.forecast, null, 2)}
              </pre>
            </>
          )}
          {pdfUrl && (
            <div style={{ marginTop: 16 }}>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <button>Download PDF Report</button>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataAnalystUpload;
