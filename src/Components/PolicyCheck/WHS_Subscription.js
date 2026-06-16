// File: WHS_Subscription.js

import React, { useState } from "react";
import { Button, InputGroup, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BASE_URL } from "../../Config";

const WHS_Subscription = () => {
  const [msisdn, setMsisdn] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ SINGLE ALERT STATE (success / error / info)
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const handleMsisdnChange = (e) => {
    setMsisdn(e.target.value);
  };

  const fetchWHSSubscriptions = async () => {
    if (!msisdn) {
      setAlert({
        type: "error",
        message: "Please enter MSISDN before searching.",
      });
      return;
    }

    setLoading(true);
    setSubscriptions([]);
    setAlert({ type: "", message: "" });

    try {
      const apiUrl = `${BASE_URL}CheckWHSSubscriptions?msisdn=${msisdn}`;
      const response = await axios.get(apiUrl);

      const data = response.data;

      // ✅ No record case (business response)
      if (data?.responseCode === "0001") {
        setAlert({
          type: "info",
          message: data?.message || "No records found.",
        });
        setSubscriptions([]);
        return;
      }

      // ✅ Success case
      if (Array.isArray(data?.records) && data.records.length > 0) {
        setSubscriptions(data.records);
        setAlert({
          type: "success",
          message: `${data.records.length} record(s) loaded successfully.`,
        });
      } else {
        setAlert({
          type: "info",
          message: "No data available.",
        });
        setSubscriptions([]);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Server error occurred.";

      setAlert({
        type: "error",
        message: `Error: ${msg}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Date formatter
  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // ✅ Table columns
  const columns = [
    {
      name: "Date",
      selector: (row) => formatDate(row.date),
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name ?? "N/A",
      sortable: true,
    },
    {
      name: "MSISDN",
      selector: (row) => row.msisdn ?? "N/A",
      sortable: true,
    },
    {
      name: "DOB",
      selector: (row) => row.dob ?? "N/A",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => (row.amount != null ? row.amount : "-"),
      sortable: true,
    },
    {
      name: "Month/Year",
      selector: (row) => row.monthYear ?? "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status ?? "N/A",
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="m-3">
        <div className="card shadow-sm">
          <div className="card-header">
            <h3 className="card-title text-center">
              Check WHS Subscriptions
            </h3>
          </div>

          <div className="card-body">

            {/* Input */}
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter MSISDN"
                value={msisdn}
                onChange={handleMsisdnChange}
              />

              <Button
                variant="success"
                onClick={fetchWHSSubscriptions}
                disabled={loading}
              >
                {loading ? "Loading..." : "Fetch"}
              </Button>
            </InputGroup>

            {/* Alert (SUCCESS / ERROR / INFO) */}
            {alert.message && (
              <Alert
                variant={
                  alert.type === "success"
                    ? "success"
                    : alert.type === "info"
                    ? "info"
                    : "danger"
                }
              >
                {alert.message}
              </Alert>
            )}

            {/* Spinner */}
            {loading && (
              <div className="spinner-border text-primary mb-3" />
            )}

            {/* Table */}
            <DataTable
              columns={columns}
              data={subscriptions}
              progressPending={loading}
              pagination
              highlightOnHover
              responsive
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              persistTableHead
              noDataComponent={
                !loading && "No records to display"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WHS_Subscription;