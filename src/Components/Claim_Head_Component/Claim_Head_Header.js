import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext"; // Import useAuth from AuthContext
import { Container, Navbar, Nav, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Claim_Head_Header = () => {
    const { logout } = useAuth(); // Access logout function from AuthContext
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null); // Store user data

    
    // Load user data from sessionStorage on component mount
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
          setUserData(user);
        } else {
          console.log("No user found in sessionStorage");
          // Optionally navigate to login page here, if necessary
          navigate("/"); // Redirect to login page if no user is found
        }
      }, []); // This runs only once when the component mounts
      
      

    // Handle logout functionality
    const handleLogout = () => {
        handleLogOutApi();
    };

    const handleLogOutApi = async () => {
        const userId = userData.userId;
        try {
            const response = await axios.post(
                "https://WebdocinsuranceportalAPI.webddocsystems.com/Logout",
                { userId },
                {
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response.data.responseCode === "0000") {
                // After successfully logging out, do not navigate immediately.
                // Instead, ensure the logout action completes first
                logout(); 
                sessionStorage.removeItem("user"); 
                console.log("Logout successful");
                
                // Add a small delay to prevent infinite state updates (optional)
                setTimeout(() => {
                    navigate("/");  // Navigate to the login page after a short delay
                }, 500); // You can adjust the delay time
            } else {
                console.error("Logout failed with response:", response.data);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    

    return (
        <Navbar expand="lg" className="portal-navbar bg-body-tertiary">
            <Container>
            <Navbar.Brand href="#">
                            <img src="/Webdoc.png" style={{ width: "100px" }} alt="logo" />
                        </Navbar.Brand>                        
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100 me-auto">
                    {userData ? (
                            <>
                                <Nav.Link href={`/Dashboard`}>Dashboard</Nav.Link>
                                <Nav.Link href={`/Reports`}>Report</Nav.Link>
                                <Nav.Link href={`/CheckPolicy`}>CheckPolicy</Nav.Link>
                                <Nav.Link href={`/Product`}>Products</Nav.Link>
                                <Nav.Link href={`/Claim_ApprovalPending`}>Pending_Claims</Nav.Link>

                                <div className="d-flex ms-lg-auto portal-user-actions">
                                    <Nav.Link className="text-end">{userData?.name}</Nav.Link>
                                        {/* Logout Section */}
                                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                </div>
                            </>
                        ) : (
                            <Nav.Link href="/">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Claim_Head_Header;
