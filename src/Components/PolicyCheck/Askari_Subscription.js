import React, { useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { ASKARI_API_URL } from "../../Config";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-PK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "N/A";
  return `PKR ${Number(value).toLocaleString("en-PK")}`;
};

const Detail = ({ label, value }) => (
  <div className="mb-3">
    <div className="text-muted small">{label}</div>
    <div className="fw-medium text-break">{value || "N/A"}</div>
  </div>
);

const renderFeatureNode = (node, key) => {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1 || ["SCRIPT", "STYLE", "IFRAME", "OBJECT"].includes(node.tagName)) return null;

  const allowedTags = new Set(["UL", "OL", "LI", "STRONG", "EM", "P", "BR"]);
  const children = Array.from(node.childNodes).map((child, index) =>
    renderFeatureNode(child, `${key}-${index}`)
  );

  if (!allowedTags.has(node.tagName)) return children;
  return React.createElement(node.tagName.toLowerCase(), { key }, ...children);
};

const renderFeatures = (features) => {
  if (!features) return "N/A";
  const parsed = new DOMParser().parseFromString(features, "text/html");
  return Array.from(parsed.body.childNodes).map((node, index) =>
    renderFeatureNode(node, `feature-${index}`)
  );
};

const Askari_Subscription = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [status, setStatus] = useState("active");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const fetchSubscriptions = async (event) => {
    event.preventDefault();
    const normalizedNumber = mobileNumber.trim().replace(/[\s()-]/g, "");
    const digits = normalizedNumber.replace(/^\+/, "");

    if (!/^\+?\d{10,15}$/.test(normalizedNumber) || !/^\d{10,15}$/.test(digits)) {
      setAlert({ type: "danger", message: "Enter a valid mobile number (10 to 15 digits)." });
      setSubscriptions([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setAlert(null);
    setSubscriptions([]);
    setHasSearched(false);

    try {
      const response = await axios.get(`${ASKARI_API_URL}packages/subscriptions`, {
        params: {
          mobileNumber: normalizedNumber,
          status: status === "all" ? null : status,
        },
      });
      const payload = response.data;

      if (payload?.success !== true) {
        setAlert({
          type: "danger",
          message: payload?.message || "The subscription lookup could not be completed.",
        });
        return;
      }

      const records = Array.isArray(payload.data) ? payload.data : null;
      if (!records) {
        setAlert({ type: "danger", message: "The server returned an unexpected response." });
        return;
      }

      setSubscriptions(records);
      setHasSearched(true);
    } catch (error) {
      setAlert({
        type: "danger",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to reach the subscription service. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <Card className="shadow-sm border">
        <Card.Header className="bg-white py-3">
          <h2 className="h5 text-center mb-0">Askari Subscriptions</h2>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          <Form onSubmit={fetchSubscriptions}>
            <Row className="g-2 align-items-start">
              <Col xs={12} md={6}>
                <Form.Label htmlFor="askari-mobile-number">Mobile number</Form.Label>
                <Form.Control
                  id="askari-mobile-number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Enter mobile number, e.g. 03145757267"
                  value={mobileNumber}
                  onChange={(event) => setMobileNumber(event.target.value)}
                  aria-describedby="askari-lookup-help"
                />
                <Form.Text id="askari-lookup-help">
                  Search subscriptions for this mobile number.
                </Form.Text>
              </Col>
              <Col xs={12} md={3}>
                <Form.Label htmlFor="askari-status">Status</Form.Label>
                <Form.Select
                  id="askari-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="all">All</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={3}>
                <div className="d-flex h-100 flex-column">
                  <Form.Label className="invisible" aria-hidden="true">
                    Action
                  </Form.Label>
                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? "Searching..." : "Fetch Subscriptions"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>

          {alert && (
            <Alert className="mt-3 mb-0" variant={alert.type} role="alert">
              {alert.message}
            </Alert>
          )}

          {loading && (
            <div className="d-flex align-items-center gap-2 mt-4" role="status">
              <span className="spinner-border spinner-border-sm text-primary" aria-hidden="true" />
              <span>Loading subscriptions...</span>
            </div>
          )}

          {!loading && hasSearched && subscriptions.length === 0 && (
            <Alert variant="info" className="mt-4 mb-0">
              No subscriptions found for this mobile number.
            </Alert>
          )}

          {!loading && subscriptions.length > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <h3 className="h6 mb-0">Subscription results</h3>
                <Badge bg="primary">
                  {subscriptions.length} {subscriptions.length === 1 ? "record" : "records"}
                </Badge>
              </div>
              <Row className="g-3">
                {subscriptions.map((subscription) => {
                  const plan = subscription.plan || {};
                  return (
                    <Col key={subscription.id || subscription.orderId} xs={12}>
                      <Card className="h-100">
                        <Card.Header className="bg-light d-flex justify-content-between align-items-center gap-2">
                          <div>
                            <div className="fw-semibold">{plan.name || "Subscription"}</div>
                            <div className="small text-muted">
                              {plan.productId || "Product"} · {plan.billingType || "Billing period unavailable"}
                            </div>
                          </div>
                          <Badge bg={subscription.active ? "success" : "secondary"}>
                            {subscription.active ? "Active" : "Inactive"}
                          </Badge>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col sm={6} md={4}>
                              <Detail label="Premium" value={formatAmount(plan.price)} />
                            </Col>
                            <Col sm={6} md={4}>
                              <Detail label="Coverage" value={formatAmount(plan.coverage)} />
                            </Col>
                            <Col sm={6} md={4}>
                              <Detail label="Order ID" value={subscription.orderId} />
                            </Col>
                            <Col sm={6} md={4}>
                              <Detail label="Purchased" value={formatDate(subscription.purchasedAt)} />
                            </Col>
                            <Col sm={6} md={4}>
                              <Detail label="Expires" value={formatDate(subscription.expiryDate)} />
                            </Col>
                            <Col sm={6} md={4}>
                              <Detail
                                label="Claim / complaint"
                                value={`${subscription.isClaimRaised ? "Claim raised" : "No claim"} · ${subscription.isComplaintRaised ? "Complaint raised" : "No complaint"}`}
                              />
                            </Col>
                          </Row>
                          {subscription.plan && (
                            <Button
                              type="button"
                              variant="outline-primary"
                              className="w-100"
                              onClick={() => setSelectedSubscription(subscription)}
                            >
                              View plan details
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={Boolean(selectedSubscription)}
        onHide={() => setSelectedSubscription(null)}
        centered
        scrollable
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSubscription?.plan?.name || "Plan"} details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubscription && (
            <>
              <h3 className="h6 mb-3">Plan information</h3>
              <Row>
                <Col xs={12} sm={6}>
                  <Detail label="Plan ID" value={selectedSubscription.plan.id} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Product" value={selectedSubscription.plan.productId} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Plan name" value={selectedSubscription.plan.name} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Premium" value={formatAmount(selectedSubscription.plan.price)} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Billing type" value={selectedSubscription.plan.billingType} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Coverage" value={formatAmount(selectedSubscription.plan.coverage)} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Helpline" value={selectedSubscription.plan.helpline} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Created" value={formatDate(selectedSubscription.plan.createdAt)} />
                </Col>
                <Col xs={12}>
                  <Detail label="Description" value={selectedSubscription.plan.description} />
                </Col>
                <Col xs={12}>
                  <div className="mb-3">
                    <div className="text-muted small">Features and eligibility</div>
                    <div className="mt-1 text-break">
                      {renderFeatures(selectedSubscription.plan.features)}
                    </div>
                  </div>
                </Col>
              </Row>

              <hr />
              <h3 className="h6 mb-3">Subscription information</h3>
              <Row>
                <Col xs={12} sm={6}>
                  <Detail label="Subscription ID" value={selectedSubscription.id} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="User ID" value={selectedSubscription.userId} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Order ID" value={selectedSubscription.orderId} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Purchased" value={formatDate(selectedSubscription.purchasedAt)} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Expires" value={formatDate(selectedSubscription.expiryDate)} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Status" value={selectedSubscription.active ? "Active" : "Inactive"} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Digital subscription" value={selectedSubscription.isDigiSub ? "Yes" : "No"} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Digital subscription ID" value={selectedSubscription.digiSubscriptionId} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Claim raised" value={selectedSubscription.isClaimRaised ? "Yes" : "No"} />
                </Col>
                <Col xs={12} sm={6}>
                  <Detail label="Complaint raised" value={selectedSubscription.isComplaintRaised ? "Yes" : "No"} />
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedSubscription(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Askari_Subscription;