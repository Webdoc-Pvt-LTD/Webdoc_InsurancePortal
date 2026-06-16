import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { BASE_URL } from "../../Config";
import { useNavigate } from "react-router-dom";

const Claim_Head_Products = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();

  // 🔹 Fetch products
  useEffect(() => {
    axios
      .get(`${BASE_URL}Products`, {
        headers: {
          Accept: "*/*",
        },
      })
      .then((response) => {
        if (response.data.responseCode === "0000") {
          setPackages(response.data.packages);
        }
      })
      .catch((error) => console.error("Error fetching packages:", error));
  }, []);

  // 🔹 Get unique company list
  const uniqueCompanies = [...new Set(packages.map((pkg) => pkg.companyName))];

  // 🔹 Filter based on search term & selected company
  const filteredPackages = packages
    .filter((pkg) => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      return (
        (pkg.id && String(pkg.id).includes(lowercasedSearchTerm)) ||
        (pkg.productName &&
          pkg.productName.toLowerCase().includes(lowercasedSearchTerm)) ||
        (pkg.companyName &&
          pkg.companyName.toLowerCase().includes(lowercasedSearchTerm)) ||
        (pkg.price &&
          String(pkg.price).toLowerCase().includes(lowercasedSearchTerm)) ||
        (pkg.category &&
          String(pkg.category).toLowerCase().includes(lowercasedSearchTerm)) ||
        (pkg.planType &&
          String(pkg.planType).toLowerCase().includes(lowercasedSearchTerm)) ||
        (pkg.coverage &&
          String(pkg.coverage).toLowerCase().includes(lowercasedSearchTerm)) ||
        (pkg.details &&
          String(pkg.details).toLowerCase().includes(lowercasedSearchTerm))
      );
    })
    .filter((pkg) => {
      if (selectedCompany === "") return true;
      return pkg.companyName === selectedCompany;
    });

  // 🔹 Navigate to edit
  const handleDetailsClick = (id) => {
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

  // 🔹 Helper: render text with tooltip + ellipsis
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

  // 🔹 Table columns
  const columns = [
    {
      name: "Id",
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
      name: "Category",
      cell: (row) => renderWithTooltip(row.category),
      sortable: true,
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
          onClick={() => handleDetailsClick(row.id)}
          className="m-1 w-100"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Container className="mt-4">
      <div className="card m-2">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-md-7">
              <h3 className="card-title text-center">Available Packages</h3>
            </div>

            <div className="col-12 col-md-2">
              <input
                type="text"
                placeholder="Search ..."
                className="form-control"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-3">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => navigate("/ProductCreate")}
              >
                Add Product
              </button>
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
                <option value="">Select a Company</option>
                {uniqueCompanies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={filteredPackages}
            pagination
            responsive
            highlightOnHover
            dense
            defaultSortFieldId={1}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
          />

          {/* CSV Download */}
          <div className="d-flex justify-content-between mb-3">
            <CSVLink
              data={filteredPackages}
              filename={"packages.csv"}
              className="btn btn-success w-100"
              target="_blank"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>

      {/* 🟣 Modal for viewing details */}
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

export default Claim_Head_Products;
