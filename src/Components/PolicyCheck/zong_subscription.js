// src/Components/PolicyCheck/TelenorSubscriptions.js

import React, { useState, useEffect } from "react";
import {
  Button,
  InputGroup,
  Form,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Chargingcheck_URL } from "../../Config";
import { useNavigate } from "react-router-dom";

const TelenorSubscriptions = () => {
  const [msisdn, setMsisdn] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Sanitize MSISDN input to only digits
  const handleMsisdnChange = (e) => {
    const cleanedInput = e.target.value.replace(/\D/g, "");
    setMsisdn(cleanedInput);
  };

  // Fetch subscription data from API
  const fetchSubscriptions = async () => {
    if (!msisdn || msisdn.length < 10) {
      setError("Please enter a valid MSISDN (at least 10 digits).");
      setSubscriptions([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSubscriptions([]);

    try {
      const response = await fetch(`${Chargingcheck_URL}api/zong/sub_dump/${msisdn}`);
      const json = await response.json();

      if (json.ResponseCode === "0000" && Array.isArray(json.ResponseData)) {
        setSubscriptions(json.ResponseData);
      } else {
        setError("No subscriptions found or invalid response.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format ISO date string to readable format
  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
  };

  // Navigate to charging details page with last 30 days filter
  const handleCheckChargingClick = (policy) => {
  navigate(`/zong-charging`, { state: { policy } });
};

  // Generate columns dynamically, with Check Charging button
  const generateColumns = () => {
    if (subscriptions.length === 0) return [];

    const sample = subscriptions[0];
    const baseColumns = Object.keys(sample).map((key) => ({
      name: key.replace(/_/g, " ").toUpperCase(),
      selector: (row) => {
        const value = row[key];
        if (typeof value === "string" && /\d{4}-\d{2}-\d{2}T/.test(value)) {
          return formatDate(value);
        }
        return value ?? "N/A";
      },
      sortable: true,
      wrap: true,
    }));

    baseColumns.push({
       name: "ACTION",
  cell: (row) => (
   <Button
  variant="info"
  size="sm"
  onClick={() => handleCheckChargingClick(row.policy)}
>
  Check Charging
</Button>
  ),
  ignoreRowClick: true,
  
  width: "150px",
    });

    return baseColumns;
  };

  return (
    <div className="container-fluid">
      <Card className="shadow-sm">
        <Card.Header className="card-header text-center">
          <h3>Check Zong Subscriptions</h3>
        </Card.Header>

        <Card.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              fetchSubscriptions();
            }}
          >
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter MSISDN 3171234567"
                value={msisdn}
                onChange={handleMsisdnChange}
                maxLength={15}
                aria-label="MSISDN input"
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Loading...
                  </>
                ) : (
                  "Get Subscriptions"
                )}
              </Button>
            </InputGroup>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          <DataTable
            columns={generateColumns()}
            data={subscriptions}
            pagination
            highlightOnHover
            responsive
            noDataComponent="No subscriptions found."
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            striped
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default TelenorSubscriptions;
