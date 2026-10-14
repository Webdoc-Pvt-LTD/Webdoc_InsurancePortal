import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { BASE_URL } from "../../Config";
import { useNavigate } from "react-router-dom";

const Key_Account_Manager_Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const navigate = useNavigate();

  // 🔹 Fetch Products
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}JazzProducts`, { headers: { Accept: "*/*" } })
      .then((response) => {
        if (response.data.responseCode === "0000") {
          setProducts(response.data.packages || []);
        } else {
          console.warn("Unexpected API response:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Get unique company list
  const uniqueCompanies = [...new Set(products.map((pkg) => pkg.companyName))];

  // 🔹 Search & Company Filter
  const filteredProducts = products
    .filter((pkg) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        (pkg.id && String(pkg.id).includes(lowerSearch)) ||
        (pkg.productName &&
          pkg.productName.toLowerCase().includes(lowerSearch)) ||
        (pkg.companyName &&
          pkg.companyName.toLowerCase().includes(lowerSearch)) ||
        (pkg.price && String(pkg.price).toLowerCase().includes(lowerSearch)) ||
        (pkg.planType &&
          String(pkg.planType).toLowerCase().includes(lowerSearch)) ||
        (pkg.coverage &&
          String(pkg.coverage).toLowerCase().includes(lowerSearch)) ||
        (pkg.details &&
          String(pkg.details).toLowerCase().includes(lowerSearch))
      );
    })
    .filter((pkg) =>
      selectedCompany ? pkg.companyName === selectedCompany : true
    );

  // 🔹 Navigate to edit page
  const handleEditClick = (id) => {
    navigate(`/ProductEdit/${id}`);
  };

  // 🔹 Modal handlers
  const handleViewDetails = (row) => {
    setModalTitle(row.productName);
    setModalContent(row.details);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent("");
    setModalTitle("");
  };

  // 🔹 Helper: Render with tooltip
  const renderWithTooltip = (text, maxLength = 25) => {
    if (!text) return "-";
    const displayText =
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip
            id={`tooltip-${Math.random()}`}
            style={{ whiteSpace: "pre-wrap", maxWidth: "400px" }}
          >
            {text}
          </Tooltip>
        }
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            maxWidth: "180px",
            cursor: "pointer",
          }}
        >
          {displayText}
        </span>
      </OverlayTrigger>
    );
  };

  // 🔹 DataTable Columns
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Product Name",
      cell: (row) => renderWithTooltip(row.productName),
      sortable: true,
    },
    {
      name: "Product Id",
      cell: (row) => renderWithTooltip(row.externalId),
    },
    {
      name: "Product Code",
      cell: (row) => renderWithTooltip(row.webServiceUrl),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "-",
      sortable: true,
      width: "100px",
      cell: (row) => (
        <span
          className={`badge ${
            row.status === "Active" ? "bg-success" : "bg-secondary"
          }`}
        >
          {row.status || "-"}
        </span>
      ),
    },
    {
      name: "Company",
      cell: (row) => renderWithTooltip(row.companyName),
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      width: "100px",
    },
    
    {
      name: "Plan Type",
      cell: (row) => renderWithTooltip(row.planType),
      sortable: true,
    },
    {
      name: "Coverage",
      cell: (row) => renderWithTooltip(row.coverage),
      sortable: true,
    },
    {
      name: "Details",
      cell: (row) => (
        <Button
          variant="info"
          className="m-1 w-75"
          onClick={() => handleViewDetails(row)}
        >
          View
        </Button>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <Button
          variant="primary"
          className="m-1 w-100"
          onClick={() => handleEditClick(row.id)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Container className="mt-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="col-12 col-md-7">
              <h3 className="card-title text-center">Available Packages</h3>
            </div>
            <div className="col-12 col-md-3"> 
              <button type="button" className="btn btn-primary w-100 " onClick={() => navigate("/ProductCreate")} > Add Product </button> 
              </div>
          </div>
        </div>

        <div className="card-body">
          {/* Company Filter */}
          <div className="row mb-3">
            <div className="col-md-4">
              <select
                className="form-control"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Select Company</option>
                {uniqueCompanies.map((company, i) => (
                  <option key={i} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading products...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={filteredProducts}
                pagination
                responsive
                highlightOnHover
                dense
                defaultSortFieldId={1}
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
              />

              {/* CSV Download */}
              <div className="mt-3">
                <CSVLink
                  data={filteredProducts}
                  filename={"products.csv"}
                  className="btn btn-success w-100"
                  target="_blank"
                >
                  Download CSV
                </CSVLink>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🟣 Modal for Details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div
            dangerouslySetInnerHTML={{
              __html: modalContent || "<p>No details available.</p>",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Key_Account_Manager_Product;
