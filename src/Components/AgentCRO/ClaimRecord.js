import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
// import { useTable, usePagination } from "react-table";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../../Config";
import AgentCRO_Header from "./AgentCRO_Header";
import { useParams } from "react-router-dom";

const ClaimRecord = () => {
  const [claimRecords, setClaimRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { msisdn } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimNo, setClaimNo] = useState("");
  const [remarks, setRemarks] = useState("");
  // Fetch claim records
  const fetchClaims = async () => {
    if (!msisdn) {
      setError("MSISDN is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BASE_URL}ClaimRecord?msisdn=${msisdn}`,
        {},
        { headers: { accept: "*/*" } }
      );
      setClaimRecords(response.data.claimrecords);
    } catch (error) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (msisdn) {
      fetchClaims();
    }
  }, [msisdn]);

  // Filter claim records based on search query
  const filteredClaims = useMemo(
    () =>
      claimRecords.filter(
        (claim) =>
          claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          claim.status.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, claimRecords]
  );

  const handleDetailsClick = (msisdn, claimNumber) => {
    navigate(`/Claim_Details/${msisdn}/${claimNumber}`);
  };

  // Handle "Request Call Back" button click to open the modal
  const handleRequestCallbackClick = (claimNumber) => {
    setClaimNo(claimNumber);
    setIsModalOpen(true); // Open the modal
  };

  // Submit callback request
  const handleSubmitCallbackRequest = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}AgentCallBackRequests?ClaimNo=${claimNo}&Remarks=${remarks}`,
        {},
        { headers: { accept: "*/*" } }
      );
      if (response.data.responseCode === "0000") {
        alert(response.data.message); // Success
        setIsModalOpen(false); // Close the modal
        setRemarks(""); // Clear remarks field
      } else {
        alert("Failed to submit callback request.");
      }
    } catch (error) {
      alert("Error submitting callback request.");
    }
  };
  return (
    <div className="container-fluid">
      <AgentCRO_Header />
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-10 col-lg-10">
          <div className="card shadow-lg">
            <div className="card-body">
              <div>
                <h5>MSISDN: {msisdn}</h5>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Claim Number or Status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : filteredClaims.length === 0 ? (
                <p>No claim records available for this MSISDN.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Claim Details</th>
                        <th>Callback_Info</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClaims.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="row">
                              <div className="col-md-4">
                                <strong>Agent Name:</strong> {item.name}
                                <br />
                                <strong>Claim No:</strong> {item.claimNumber}
                                <br />
                                <strong>Status:</strong>{" "}
                                <span
                                  className={`badge 
            ${
              item.status === "Approved"
                ? "bg-success"
                : item.status === "Rejected"
                ? "bg-danger"
                : item.status === "Intimation"
                ? "bg-primary"
                : item.status === "Processing"
                ? "bg-warning"
                : "bg-secondary"
            }`}
                                >
                                  {item.status || "N/A"}
                                </span>
                                <br />
                                <strong>Service Name:</strong>{" "}
                                <span>{item.serviceName}</span>
                                <br />
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  item.claimDateTime
                                ).toLocaleDateString()}
                                <br />
                                <strong>Whatsapp:</strong> {item.whatsappNumber}
                              </div>

                              <div className="col-md-4">
                                <strong>Claim Intimation:</strong>
                                {item.premarks &&
                                  item.premarks.map((remark, idx) => (
                                    <span key={idx}>
                                      {remark.remarks} (
                                      {new Date(
                                        remark.dateTime
                                      ).toLocaleDateString()}
                                      )
                                    </span>
                                  ))}
                                <br />
                                <strong>Additional Notes:</strong>{" "}
                                {item.additionalNotes}
                                <br />
                                <strong>Missing Notes:</strong>{" "}
                                {item.missingDocuments || "N/A"}
                                <br />
                                <strong>Reason of Rejection:</strong>{" "}
                                {item.recordDetails[0]?.reasonofRejection ||
                                  "N/A"}
                              </div>

                              <div className="col-md-4">
                                <strong>Expense Amount:</strong>{" "}
                                {item.recordDetails[0]?.expenseAmount}
                                <br />
                                <strong>Payable Amount:</strong>{" "}
                                {item.recordDetails[0]?.payableAmount}
                                <br />
                                <strong>Paid Amount:</strong>{" "}
                                {item.recordDetails[0]?.amountPaid || "N/A"}
                                <br />
                                <strong>Payable Note:</strong>{" "}
                                {item.recordDetails[0]?.payableNote || "N/A"}
                                <br />
                                <strong>Processing Notes:</strong>
                                {item.premarks &&
                                  item.premarks.map((remark, idx) => (
                                    <ul key={idx}>
                                      <li>
                                        {remark.remarks}{" "}
                                        <strong>
                                          (
                                          {new Date(
                                            remark.dateTime
                                          ).toLocaleString()}
                                          )
                                        </strong>
                                      </li>
                                    </ul>
                                  ))}
                              </div>
                            </div>
                          </td>

                          <td>
                            {item.callbackRequestData &&
                              item.callbackRequestData.map(
                                (callbackItem, idx) => (
                                  <p key={idx}>
                                    CallBack Arranged By{" "}
                                    <strong>{callbackItem.agentname}</strong> at{" "}
                                    <strong>
                                      {new Date(
                                        callbackItem.callbackDatetime
                                      ).toLocaleDateString()}
                                    </strong>
                                    .
                                    <br />
                                    <strong>Remarks:</strong>{" "}
                                    {callbackItem.remarks}
                                  </p>
                                )
                              )}
                          </td>

                          <td>
                            {item.requestStatus === "Pending" ? (
                              <p>
                                Callback request is generated, and agent will
                                call within 24 hours.
                              </p>
                            ) : (
                              <Button
                                variant="success"
                                onClick={() =>
                                  handleRequestCallbackClick(item.claimNumber)
                                }
                              >
                                Request_CallBack
                              </Button>
                            )}
                            <br /> <br />
                            {[
                              "Approved",
                              "Incomplete",
                              "Rejected",
                              "Paid",
                              "Processing",
                              "Intimation",
                            ].includes(item.status) && (
                              <Button
                                variant="primary"
                                onClick={() =>
                                  handleDetailsClick(
                                    item.whatsappNumber,
                                    item.claimNumber
                                  )
                                }
                              >
                                View Details
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Remarks Input */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Call Back</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitCallbackRequest}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClaimRecord;
