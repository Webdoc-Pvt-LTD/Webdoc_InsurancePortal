import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Config";
import FullScreenLoader from "../FullScreenLoader"; // loader

const Key_Account_Manager_Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load user data on mount
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) setUserData(user);
    }, []);

    // Handle Logout
    const handleLogout = () => {
        setLoading(true); 
        handleLogOutApi();
    };

    const handleLogOutApi = async () => {
        const userId = userData?.userId;

        try {
            const response = await axios.post(
                `${BASE_URL}Logout`,
                { userId },
                {
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.responseCode === "0000") {
                logout();
                sessionStorage.removeItem("user");
                navigate("/");
            } else {
                console.error("Logout failed:", response.data);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <>
            {/* Full Screen Loader */}
{loading && <FullScreenLoader message="Logging out..." />}

            <Navbar
                expand="lg"
                className="bg-body-tertiary"
                style={{ borderRadius: "25px" }}
            >
                <Container>
                    <Navbar.Brand href="#">
                        <img src="/Webdoc.png" style={{ width: "100px" }} alt="logo" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="w-100 me-auto">
                            {userData ? (
                                <>
                                    <Nav.Link href="/Dashboard">Dashboard</Nav.Link>
                                    <Nav.Link href="/Reports">Report</Nav.Link>
                                    <Nav.Link href="/Product">Product</Nav.Link>
                                    <Nav.Link href="/CheckPolicy">CheckPolicy</Nav.Link>

                                    <div className="d-flex ms-auto">
                                        <Nav.Link className="text-end">
                                            {userData?.name}
                                        </Nav.Link>

                                        <Nav.Link onClick={handleLogout}>
                                            Logout
                                        </Nav.Link>
                                    </div>
                                </>
                            ) : (
                                <Nav.Link href="/">Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Key_Account_Manager_Header;
