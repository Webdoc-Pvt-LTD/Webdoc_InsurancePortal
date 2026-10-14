import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HeaderFinance = () => {
    const { logout } = useAuth(); // Access logout function from AuthContext
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null); // Store user data

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            setUserData(user);
        } else {
            console.log("No user found in sessionStorage");
        }
    }, []);

    // Handle logout functionality
    const handleLogout = () => {
        handleLogOutApi();
    };

    const handleLogOutApi = async () => {
        const userId = userData?.userId; // Ensure userData is not null
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
                logout(); // Call the logout function from AuthContext
                sessionStorage.removeItem("user"); // Clear user data from sessionStorage
                console.log("Logout successful");
                navigate("/"); // Navigate to the login page
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
                                {/* Navigation links visible after user is logged in */}
                                <Nav.Link href={`/Dashboard`}>Dashboard</Nav.Link>
                                

                                <div className="d-flex ms-lg-auto portal-user-actions">
                                    <Nav.Link className="text-end">{userData?.name}</Nav.Link>
                                    {/* Logout Section */}
                                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                </div>
                            </>
                        ) : (
                            <Nav.Link href="/">Login</Nav.Link> // Login link if no user is logged in
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default HeaderFinance;
