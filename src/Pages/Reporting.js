// src/Pages/Reporting.js

import React, { useState, useEffect } from "react";
import DashboardSummary from "../Components/Reporting/DashboardSummary";
import CallLogTable from "../Components/Reporting/CallLogTable";
import CallLogExport from "../Components/Reporting/CallLogExport";

import Claim_Head_Header from "../Components/Claim_Head_Component/Claim_Head_Header";
import Key_Account_Manager_Header from "../Components/Key_Account_Manager_Header";

const TAB_SUMMARY = "summary";
const TAB_LOGS    = "logs";
const TAB_EXPORT  = "export";

const TabButton = ({ id, label, icon, activeTab, onClick }) => (
  <button
    onClick={() => onClick(id)}
    style={{
      background:    activeTab === id ? "#185FA5" : "transparent",
      color:         activeTab === id ? "#fff"    : "#6c757d",
      border:        activeTab === id ? "1px solid #185FA5" : "1px solid #dee2e6",
      borderRadius:  8,
      padding:       "7px 18px",
      fontSize:      13,
      fontWeight:    activeTab === id ? 600 : 400,
      cursor:        "pointer",
      display:       "flex",
      alignItems:    "center",
      gap:           6,
      transition:    "all 0.15s",
      whiteSpace:    "nowrap",
    }}
  >
    <span>{icon}</span> {label}
  </button>
);

const PageShell = ({ header: Header, tabs, children }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="container-fluid p-0">
      {Header && <Header />}

      <div className="px-3 px-md-4 py-4" style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Page title */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 4, height: 22, background: "#185FA5", borderRadius: 2, display: "inline-block" }} />
              <h5 className="mb-0 fw-semibold" style={{ color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                Call Reporting
              </h5>
            </div>
            <p className="mb-0 mt-1 ms-3" style={{ fontSize: 13, color: "#6c757d" }}>
              Monitor call activity across platforms
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {tabs.map((t) => (
            <TabButton
              key={t.id}
              id={t.id}
              label={t.label}
              icon={t.icon}
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          ))}
        </div>

        {/* Active tab content */}
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-body p-3 p-md-4">
            {children(activeTab)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Reporting() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) setUserData(user);
  }, []);

  if (!userData) return null;

  // ── Claim Head ──────────────────────────────────────────────
  if (userData.userRole === "Claim_Head") {
    const tabs = [
      { id: TAB_SUMMARY, label: "Dashboard Summary", icon: "📊" },
      { id: TAB_EXPORT,  label: "Export Logs",        icon: "⬇" },
      { id: TAB_LOGS,    label: "Call Logs",           icon: "📋" },
    ];
    return (
      <PageShell header={Claim_Head_Header} tabs={tabs}>
        {(active) => (
          <>
            {active === TAB_SUMMARY && <DashboardSummary />}
            {active === TAB_EXPORT  && <CallLogExport />}
            {active === TAB_LOGS    && <CallLogTable />}
          </>
        )}
      </PageShell>
    );
  }

  // ── Key Account Manager ─────────────────────────────────────
  if (userData.userRole === "Key_Account_Manager") {
    const tabs = [
      { id: TAB_SUMMARY, label: "Dashboard Summary", icon: "📊" },
      { id: TAB_LOGS,    label: "Call Logs",           icon: "📋" },
    ];
    return (
      <PageShell header={Key_Account_Manager_Header} tabs={tabs}>
        {(active) => (
          <>
            {active === TAB_SUMMARY && <DashboardSummary />}
            {active === TAB_LOGS    && <CallLogTable />}
          </>
        )}
      </PageShell>
    );
  }

  // ── Admin ───────────────────────────────────────────────────
  if (userData.userRole === "Admin") {
    const tabs = [
      { id: TAB_SUMMARY, label: "Dashboard Summary", icon: "📊" },
      { id: TAB_EXPORT,  label: "Export Logs",        icon: "⬇" },
      { id: TAB_LOGS,    label: "Call Logs",           icon: "📋" },
    ];
    return (
      <PageShell header={null} tabs={tabs}>
        {(active) => (
          <>
            {active === TAB_SUMMARY && <DashboardSummary />}
            {active === TAB_EXPORT  && <CallLogExport />}
            {active === TAB_LOGS    && <CallLogTable />}
          </>
        )}
      </PageShell>
    );
  }

  // ── Manager ─────────────────────────────────────────────────
  if (userData.userRole === "Manager") {
    const tabs = [
      { id: TAB_SUMMARY, label: "Dashboard Summary", icon: "📊" },
      { id: TAB_LOGS,    label: "Call Logs",           icon: "📋" },
    ];
    return (
      <PageShell header={null} tabs={tabs}>
        {(active) => (
          <>
            {active === TAB_SUMMARY && <DashboardSummary />}
            {active === TAB_LOGS    && <CallLogTable />}
          </>
        )}
      </PageShell>
    );
  }

  return null;
}