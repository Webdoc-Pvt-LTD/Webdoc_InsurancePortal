//src/Components/Reporting/CallLogExport.js

import React, { useState } from "react";
import { BASE_URL } from "../../Config";

const API_BASE = `${BASE_URL}api/reporting`;



const PLATFORMS = [
  "ALL", "Apna Clinic", "App Calling", "Zindigi App",
  "PTCL", "Tabeeb Online", "Afghan Telecom",
];

export default function CallLogExport() {
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = today.slice(0, 7) + "-01";

  const [fromDate, setFromDate] = useState(firstOfMonth + "T00:00:00");
  const [toDate, setToDate]     = useState(today + "T23:59:59");
  const [platform, setPlatform] = useState("ALL");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleExport = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const body = { fromDate, toDate };
      if (platform !== "ALL") body.platform = platform;

      const res = await fetch(`${API_BASE}/export-call-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `call-logs-${fromDate.slice(0, 10)}-to-${toDate.slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess("File downloaded successfully.");
    } catch (e) {
      setError("Export failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <span style={{ width: 3, height: 16, background: "#2e7d32", borderRadius: 2, marginRight: 8, display: "inline-block" }} />
        <h6 className="mb-0 fw-semibold" style={{ color: "#1a1a2e" }}>Export Call Logs</h6>
      </div>

      <div className="row g-2 align-items-end">
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>From</label>
          <input type="datetime-local" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>To</label>
          <input type="datetime-local" className="form-control form-control-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>Platform</label>
          <select className="form-select form-select-sm" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p === "ALL" ? "All Platforms" : p}</option>)}
          </select>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <button className="btn btn-sm w-100" onClick={handleExport} disabled={loading}
            style={{ background: "#2e7d32", color: "#fff", fontWeight: 500, fontSize: 13 }}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Exporting…</>
              : "⬇ Export Excel"}
          </button>
        </div>
      </div>

      {error   && <div className="alert alert-danger  py-2 mt-3" style={{ fontSize: 13 }}>{error}</div>}
      {success && <div className="alert alert-success py-2 mt-3" style={{ fontSize: 13 }}>{success}</div>}
    </>
  );
}