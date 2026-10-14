import React, { useState } from "react";
import { 
  Button,
  InputGroup,
  Form,
  Alert,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BASE_URL } from "../../Config";

const JC_Policy = () => {
  const [msisdn, setMsisdn] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle MSISDN input change
  const handleMsisdnChange = (e) => {
    setMsisdn(e.target.value);
  };

  // Fetch data from the API
  const fetchTransactions = async () => {
    if (!msisdn) return; // If MSISDN is empty, return early.

    setLoading(true);
    setError(null);
    try {
      const apiUrl =  `${BASE_URL}JazzCashPolicyCheck?Msisdn=${msisdn}`;
      console.log("Making request to:", apiUrl);

      const response = await axios.get(apiUrl);
      console.log("Response data:", response.data);
      // Check if response is valid
      if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
        setError("Invalid data format received.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response) {
        console.error("Error response:", err.response);
        setError(
          `Failed to fetch data: ${err.response.status} - ${err.response.data}`
        );
      } else {
        setError(
          "Failed to fetch data: Network issue or server not responding."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Timestamp",
      selector: (row) => row.timestamp, // Use function instead of string
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Account Number",
      selector: (row) => row.account_Number,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Request DateTime",
      selector: (row) => row.requestDateTime,
      sortable: true,
    },
    {
      name: "Transaction ID",
      selector: (row) => row.transactionId,
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="m-3">
        <div className="card shadow-sm">
          <div className="card-header">
                <h3 className="card-title text-center"> Check Jazzcash Subscription</h3>
          </div>

          <div className="card-body">
            {/* MSISDN input form */}
            <InputGroup className="mb-4">
              <Form.Control
              className="col-12 col-md-8 mb-2 m-2"
                type="text"
                placeholder="Enter MSISDN 923001234567"
                value={msisdn}
                onChange={handleMsisdnChange}
              />
              <Button variant="primary" className="col-12 col-md-2 mb-2 m-2" onClick={fetchTransactions}>
                Fetch Transactions
              </Button>
            </InputGroup>

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Loading spinner */}
            {loading && (
              <div className="spinner-border text-primary" role="status"></div>
            )}
            {/* DataTable */}
            <DataTable
              columns={columns}
              data={transactions}
              progressPending={loading}
              pagination
              highlightOnHover
              responsive
              paginationPerPage={5} // Items per page
              paginationRowsPerPageOptions={[5, 10, 15]} // Options for number of items per page
              persistTableHead
            />
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default JC_Policy;
