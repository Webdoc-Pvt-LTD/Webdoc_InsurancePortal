import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Claim_Head_Header from '../Components/Claim_Head_Component/Claim_Head_Header';
import { useParams } from "react-router-dom";

const Claim_Details = () => {
  const { customerMobileNo, claimNo } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://WebdocinsuranceportalAPI.webddocsystems.com/Claim_Details?mobileno=${customerMobileNo}&claimNumber=${claimNo}`);
        const result = await response.json();

        if (result.responseCode === "0000") {
          setData(result.response);
        } else {
          setError('Failed to load claim details');
        }
      } catch (error) {
        setError('An error occurred while fetching the data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerMobileNo, claimNo]);

  // Merge all media sources (images, videos, etc.) into one array
  const media = [
    ...(data?.images || []),
    ...(data?.videos || []),
    ...(data?.audio || []),
  ];

  if (loading) {
    // Professional loader
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <Card style={{ padding: '2rem', textAlign: 'center', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p style={{ marginTop: '1rem', fontWeight: '500', fontSize: '1.2rem' }}>Loading claim details...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="fluid">
        <Claim_Head_Header />
      </div>

      <Card className="mt-5">
        <Card.Header>
          <h3 className="text-center">Claim Details</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Claim No:</strong> {data.claimNo}</p>
              <p><strong>Customer Name:</strong> {data.customerName}</p>
              <p><strong>Customer Mobile No:</strong> {data.customerMobileNo}</p>
              <p><strong>Claim Date:</strong> {data.claimDate ? new Date(data.claimDate).toLocaleString() : "N/A"}</p>
            </Col>
            <Col md={6}>
              <p><strong>Service Name:</strong> {data.serviceName}</p>
              <p><strong>Claim Status:</strong> {data.claimStatus}</p>
              <p><strong>Intimation Details:</strong></p>
              {data.intimation_Remarks?.length > 0 ? (
                <ul>
                  {data.intimation_Remarks.map((remark, index) => (
                    <li key={index}>
                      {remark} ({data.intimationDate?.[index] ? new Date(data.intimationDate[index]).toLocaleString() : "N/A"})
                    </li>
                  ))}
                </ul>
              ) : <p>No intimation remarks.</p>}
            </Col>
          </Row>

          <hr />
          <h4>Media</h4>
          {media.length > 0 ? (
            <Row>
              {media.map((item, index) => {
                const url = item.imageUrl || item.url; 
                if (!url) return null;

                const extension = url.split('.').pop().toLowerCase();

                return (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    {["jpg", "jpeg", "png", "gif", "webp"].includes(extension) && (
                      <Image src={url} thumbnail />
                    )}

                    {["mp4", "webm", "ogg"].includes(extension) && (
                      <video controls width="100%">
                        <source src={url} type={`video/${extension}`} />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    {["mp3", "wav", "ogg"].includes(extension) && (
                      <audio controls>
                        <source src={url} type={`audio/${extension}`} />
                        Your browser does not support the audio element.
                      </audio>
                    )}

                    {!["jpg","jpeg","png","gif","webp","mp4","webm","ogg","mp3","wav"].includes(extension) && (
                      <p>Unsupported file type</p>
                    )}
                  </Col>
                );
              })}
            </Row>
          ) : (
            <p>No media available.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Claim_Details;
