// src/Components/Reporting/DashboardSummary.js

import React, { useState, useCallback, useEffect } from "react";
import { usePlatforms } from "../../hooks/usePlatforms";
import { BASE_URL } from "../../Config";

const API_BASE = `${BASE_URL}api/reporting`;

const STATUS_CONFIG = {
  Connected: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  Ringing:   { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  Accepted:  { bg: "#e0f7fa", text: "#00695c", border: "#80cbc4" },
  Ended:     { bg: "#f5f5f5", text: "#424242", border: "#bdbdbd" },
  Missed:    { bg: "#ffebee", text: "#c62828", border: "#ef9a9a" },
};

function MetricCard({ label, value, total }) {
  const cfg = STATUS_CONFIG[label];
  const pct = total ? Math.round((value / total) * 100) : null;
  return (
    <div className="rounded-3 p-3 h-100" style={{ background: cfg ? cfg.bg : "#f0f4ff", border: `1px solid ${cfg ? cfg.border : "#b3c6f7"}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: cfg ? cfg.text : "#3a5fc8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: cfg ? cfg.text : "#1a1a2e", lineHeight: 1 }}>
        {value.toLocaleString()}
      </div>
      {pct !== null && (
        <div style={{ fontSize: 11, color: cfg ? cfg.text : "#3a5fc8", marginTop: 4, opacity: 0.75 }}>{pct}% of total</div>
      )}
    </div>
  );
}

export default function DashboardSummary() {
  const { platforms, loadingPlatforms } = usePlatforms();

  const today          = new Date().toISOString().slice(0, 10);  // "2025-06-05"

  // ✅ fromDate aur toDate dono aaj ki date — poora din
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate]     = useState(today);
  const [platform, setPlatform] = useState("ALL");
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const fetchSummary = useCallback(async (from, to, plat) => {
    setLoading(true);
    setError("");
    try {
      const body = { fromDate: from, toDate: to };
      if (plat !== "ALL") body.platform = plat;
      const res  = await fetch(`${API_BASE}/dashboard-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) setSummary(data);
      else setError("Failed to load summary.");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Page load hote hi aaj ka data fetch karo
  useEffect(() => {
    fetchSummary(today, today, "ALL");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <span style={{ width: 3, height: 16, background: "#185FA5", borderRadius: 2, marginRight: 8, display: "inline-block" }} />
        <h6 className="mb-0 fw-semibold" style={{ color: "#1a1a2e" }}>Dashboard Summary</h6>
      </div>

      <div className="row g-2 align-items-end mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>From date</label>
          <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label className="form-label" style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>To date</label>
          <input type="date" className="form-control form-control-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} />
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
              <option key={p} value={p}>
                {p === "ALL" ? "All Platforms" : p}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <button
            className="btn btn-sm w-100"
            onClick={() => fetchSummary(fromDate, toDate, platform)}
            disabled={loading}
            style={{ background: "#185FA5", color: "#fff", fontWeight: 500, fontSize: 13 }}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Loading…</>
              : "Fetch Summary"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2" style={{ fontSize: 13 }}>{error}</div>}

      {summary && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-sm-4 col-md-3 col-xl-2">
              <div className="rounded-3 p-3 h-100 text-center" style={{ background: "#1a1a2e" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#90caf9", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Total Calls</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{summary.summary.totalCalls.toLocaleString()}</div>
              </div>
            </div>
            {summary.summary.statusCounts.map((s) => (
              <div key={s.status} className="col-6 col-sm-4 col-md-3 col-xl-2">
                <MetricCard label={s.status} value={s.count} total={summary.summary.totalCalls} />
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, fontWeight: 600, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
            Platform Breakdown
          </p>
          <div className="d-flex flex-column gap-2">
            {summary.summary.platformCounts
              .filter((p) => p.platform)
              .sort((a, b) => b.count - a.count)
              .map((p) => {
                const pct = Math.round((p.count / summary.summary.totalCalls) * 100);
                return (
                  <div key={p.platform} className="d-flex align-items-center gap-3">
                    <div style={{ minWidth: 130, fontSize: 13, color: "#1a1a2e", fontWeight: 500 }}>{p.platform}</div>
                    <div className="flex-grow-1" style={{ height: 8, background: "#e9ecef", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#185FA5", borderRadius: 4 }} />
                    </div>
                    <div style={{ minWidth: 80, fontSize: 12, color: "#6c757d", textAlign: "right" }}>
                      {p.count.toLocaleString()} <span style={{ color: "#adb5bd" }}>({pct}%)</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}