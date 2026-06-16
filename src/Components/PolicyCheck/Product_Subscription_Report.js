import React, { useState, useEffect, useMemo } from "react";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import { BASE_URL } from "../../Config";
import FullScreenLoader from "../../FullScreenLoader";

import "./ProductSubscriptionReport.css";

const Product_Subscription_Report = () => {
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [status, setStatus] = useState("");
  const [packages, setPackages] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });

  // Load UserId
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user");
    if (storedUserId) {
      const userObj = JSON.parse(storedUserId);
      setUserId(userObj.userId);
    }
  }, []);

  // Fetch Packages
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}JazzProducts`)
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode === "0000") {
          setPackages(data.packages);
        } else {
          Swal.fire("Error", "Unable to fetch packages", "error");
        }
      })
      .catch(() => Swal.fire("Error", "Error fetching package data", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Handle Report
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!startDate && !endDate && !mobileNumber && !serviceName && !status) {
      Swal.fire("Warning", "Please fill in at least one filter field!", "warning");
      return;
    }

    setLoading(true);

    const queryParams = new URLSearchParams({
      UserId: userId,
      StartDate: startDate,
      EndDate: endDate,
      mobileNumber,
      serviceName,
      status,
    });

    fetch(`${BASE_URL}ProductSubscriptionCheck?${queryParams}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.responseCode === "0000") {
          setReportData(data.data);
        } else {
          Swal.fire("Info", data.message, "info");
          setReportData([]);
        }
      })
      .catch(() => Swal.fire("Error", "Error fetching data", "error"))
      .finally(() => setLoading(false));
  };

  // 🔥 DOWNLOAD FILE HANDLER
  const handleDownload = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        UserId: userId,
        StartDate: startDate,
        EndDate: endDate,
        mobileNumber,
        serviceName,
        status,
      });

      const response = await fetch(`${BASE_URL}ProductSubscriptionCheckDownload?${queryParams}`, {
        method: "GET",
      });

      if (!response.ok) {
        Swal.fire("Error", "Failed to download file!", "error");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ProductSubscriptionReport" + today + ".xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire("Error", "Download failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Search Filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return reportData;

    return reportData.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, reportData]);

  // Table Columns
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Mobile Number", selector: (row) => row.mobileNumber, sortable: true },
    { name: "Product Name", selector: (row) => row.productName, sortable: true },
    { name: "Price", selector: (row) => "Rs." + row.price, sortable: true },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        const s = row.status?.toLowerCase();
        return (
          <span
            className={`status-badge 
              ${s === "active" ? "status-active" : ""}
              ${s === "pending" ? "status-pending" : ""}
              ${s === "expired" ? "status-expired" : ""}
            `}
          >
            {row.status}
          </span>
        );
      },
    },
    { name: "Policy No", selector: (row) => row.policyNo, sortable: true },
    { name: "Open ID", selector: (row) => row.openId, sortable: true },
    { name: "Buy Date", selector: (row) => row.buyDate, sortable: true },
    { name: "Unsub Date", selector: (row) => row.unsubDate || "N/A", sortable: true },
    { name: "Active Date", selector: (row) => row.activeDate, sortable: true },
    { name: "Expiry Date", selector: (row) => row.expiryDate, sortable: true },
  ];

  return (
    <div className="container-fluid">

      {loading && <FullScreenLoader message="Loading..." />}

      {/* FILTER CARD */}
      <div className="card m-2">
        <div className="card-header text-center">
          <h3>Product Subscription Report Filters</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="row mb-3">

            <div className="col-md-2">
              <label>Start Date</label>
              <input type="date" className="form-control" value={startDate}
                onChange={(e) => setStartDate(e.target.value)} max={today} />
            </div>

            <div className="col-md-2">
              <label>End Date</label>
              <input type="date" className="form-control" value={endDate}
                onChange={(e) => setEndDate(e.target.value)} max={today} />
            </div>

            <div className="col-md-2">
              <label>Mobile Number</label>
              <input type="text" className="form-control" placeholder="03001234567"
                value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            </div>

            <div className="col-md-2">
              <label>Service Name</label>
              <select className="form-control" value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}>
                <option value="">Select a Service</option>

                {packages.map((pkg, index) => (
                  <option key={index} value={pkg.productName}>
                    {pkg.productName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label>Status</label>
              <select className="form-control" value={status}
                onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            {/* GET Button */}
            <div className="col-md-1 mt-4">
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                Get
              </button>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="col-md-1 mt-4">
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={handleDownload}
                disabled={loading}
              >
                Download
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* REPORT TABLE */}
      <div className="card m-2">
        <div className="card-header">
          <div className="row">
            <div className="col-md-9">
              <h3 className="text-center">Product Subscription Report</h3>
            </div>

            <div className="col-md-3">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {reportData.length > 0 && (
          <div className="card m-2">
            <div className="card-body">

              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                striped
                responsive
              />

              <CSVLink
                data={reportData}
                filename="subscription_report.csv"
                className="btn btn-success w-100 mt-3"
              >
                Download CSV
              </CSVLink>

            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Product_Subscription_Report;
