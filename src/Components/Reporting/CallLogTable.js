// src/Components/Reporting/CallLogTable.js

import React, { useState, useCallback, useEffect } from "react";
import { BASE_URL } from "../../Config";
import { usePlatforms } from "../../hooks/usePlatforms";

const API_BASE = `${BASE_URL}api/reporting`;

const STATUSES = ["", "Connected", "Ringing", "Accepted", "Ended", "Missed"];

const STATUS_BADGE = {
  Connected: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  Ringing:   { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  Accepted:  { bg: "#e0f7fa", text: "#00695c", border: "#80cbc4" },
  Ended:     { bg: "#f5f5f5", text: "#424242", border: "#bdbdbd" },
  Missed:    { bg: "#ffebee", text: "#c62828", border: "#ef9a9a" },
};

function StatusBadge({ status }) {
  const c = STATUS_BADGE[status] || { bg: "#f5f5f5", text: "#424242", border: "#bdbdbd" };
  return (
    <span style={{
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 20, padding: "2px 10px",
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

export default function CallLogTable() {
  const { platforms, loadingPlatforms } = usePlatforms();

  const today = new Date().toISOString().slice(0, 10);

  // ✅ Aaj ki date default — pehle firstOfMonth tha
  const [platform, setPlatform]     = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [doctorId, setDoctorId]     = useState("");
  const [patientId, setPatientId]   = useState("");
  const [fromDate, setFromDate]     = useState(today + "T00:00:00");
  const [toDate, setToDate]         = useState(today + "T23:59:59");
  const [pageNumber, setPageNumber] = useState(1);
  const PAGE_SIZE = 20;

  const [logs, setLogs]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const body = { fromDate, toDate, pageNumber: page, pageSize: PAGE_SIZE };
      if (platform && platform !== "ALL") body.platform = platform;
      if (callStatus) body.callStatus = callStatus;
      if (doctorId)   body.doctorId   = doctorId;
      if (patientId)  body.patientId  = patientId;

      const res  = await fetch(`${API_BASE}/call-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setLogs(data); setPageNumber(page); }
      else setError("Failed to load logs.");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, platform, callStatus, doctorId, patientId]);

  // ✅ Page load hote hi aaj ka data fetch karo
  useEffect(() => {
    fetchLogs(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = logs?.totalPages || 0;
  const visiblePages = () => {
    const pages = [];
    const start = Math.max(1, pageNumber - 2);
    const end   = Math.min(totalPages, pageNumber + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <span style={{ width: 3, height: 16, background: "#6f42c1", borderRadius: 2, marginRight: 8, display: "inline-block" }} />
        <h6 className="mb-0 fw-semibold" style={{ color: "#1a1a2e" }}>Call Logs</h6>
      </div>

      {/* Row 1 filters */}
      <div className="row g-2 align-items-end mb-2">
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
          <select
            className="form-select form-select-sm"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={loadingPlatforms}
          >
            {platforms.map((p) => (
              <option key={p} value={p === "ALL" ? "" : p}>
                {p === "ALL" ? "All Platforms" : p}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>Status</label>
          <select className="form-select form-select-sm" value={callStatus} onChange={(e) => setCallStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s || "All Statuses"}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2 filters */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-sm-6 col-lg-4">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>
            Doctor ID <span style={{ color: "#adb5bd" }}>(optional)</span>
          </label>
          <input type="text" className="form-control form-control-sm" placeholder="UUID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>
            Patient ID <span style={{ color: "#adb5bd" }}>(optional)</span>
          </label>
          <input type="text" className="form-control form-control-sm" placeholder="UUID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </div>
        <div className="col-12 col-sm-12 col-lg-4">
          <button className="btn btn-sm w-100" onClick={() => fetchLogs(1)} disabled={loading}
            style={{ background: "#6f42c1", color: "#fff", fontWeight: 500, fontSize: 13 }}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Searching…</>
              : "Search Logs"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2" style={{ fontSize: 13 }}>{error}</div>}

      {logs && (
        <p style={{ fontSize: 12, color: "#6c757d", marginBottom: 10 }}>
          <strong style={{ color: "#1a1a2e" }}>{logs.totalRecords.toLocaleString()}</strong> records — page{" "}
          <strong style={{ color: "#1a1a2e" }}>{logs.pageNumber}</strong> of{" "}
          <strong style={{ color: "#1a1a2e" }}>{logs.totalPages}</strong>
        </p>
      )}

      {/* Table */}
      {logs && logs.data.length > 0 && (
        <div className="table-responsive rounded-3" style={{ border: "1px solid #e9ecef" }}>
          <table className="table table-sm table-hover mb-0" style={{ fontSize: 12 }}>
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                {["ID", "Time", "Platform", "Status", "Type", "Doctor Email", "Patient Email", "Log", "Remarks"].map((h) => (
                  <th key={h} style={{ fontWeight: 600, fontSize: 11, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.3px", padding: "10px 12px", whiteSpace: "nowrap", borderBottom: "1px solid #dee2e6" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.data.map((row) => (
                <tr key={row.id} style={{ verticalAlign: "middle" }}>
                  <td style={{ padding: "9px 12px", color: "#adb5bd", fontWeight: 500 }}>{row.id}</td>
                  <td style={{ padding: "9px 12px", whiteSpace: "nowrap", color: "#495057" }}>
                    {new Date(row.time).toLocaleString()}
                  </td>
                  <td style={{ padding: "9px 12px" }}>{row.platfrom}</td>
                  <td style={{ padding: "9px 12px" }}><StatusBadge status={row.callStatus} /></td>
                  <td style={{ padding: "9px 12px" }}>{row.callType}</td>
                  <td style={{ padding: "9px 12px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#185FA5" }}>
                    {row.doctorEmail}
                  </td>
                  <td style={{ padding: "9px 12px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {row.patientEmail}
                  </td>
                  <td style={{ padding: "9px 12px", color: "#6c757d" }}>{row.logDefinition}</td>
                  <td style={{ padding: "9px 12px", color: "#6c757d" }}>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {logs && logs.data.length === 0 && (
        <div className="text-center py-5" style={{ color: "#adb5bd" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <p className="mb-0" style={{ fontSize: 13 }}>No records found for selected filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination pagination-sm justify-content-center mb-0 flex-wrap gap-1">
            <li className={`page-item ${pageNumber === 1 || loading ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => fetchLogs(1)} style={{ fontSize: 12 }}>«</button>
            </li>
            <li className={`page-item ${pageNumber <= 1 || loading ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => fetchLogs(pageNumber - 1)} style={{ fontSize: 12 }}>‹ Prev</button>
            </li>
            {visiblePages().map((p) => (
              <li key={p} className={`page-item ${p === pageNumber ? "active" : ""}`}>
                <button className="page-link" onClick={() => fetchLogs(p)} style={{ fontSize: 12, background: p === pageNumber ? "#185FA5" : "", borderColor: p === pageNumber ? "#185FA5" : "" }}>
                  {p}
                </button>
              </li>
            ))}
            <li className={`page-item ${pageNumber >= totalPages || loading ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => fetchLogs(pageNumber + 1)} style={{ fontSize: 12 }}>Next ›</button>
            </li>
            <li className={`page-item ${pageNumber === totalPages || loading ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => fetchLogs(totalPages)} style={{ fontSize: 12 }}>»</button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}