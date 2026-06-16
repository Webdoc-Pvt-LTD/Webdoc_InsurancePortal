import React from "react";
import { Spinner } from "react-bootstrap";

const FullScreenLoader = ({ message = "" }) => {
    return (
        <div style={styles.overlay}>
            <div style={styles.box}>
                <Spinner
                    animation="border"
                    variant="light"
                    style={styles.spinner}
                />

                {/* Show message only if provided */}
                {message !== "" && (
                    <p style={styles.text}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backdropFilter: "blur(3px)",
    },

    box: {
        textAlign: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
    },

    spinner: {
        width: "4rem",
        height: "4rem",
        marginBottom: "15px",
    },

    text: {
        fontSize: "1.3rem",
        fontWeight: "600",
        letterSpacing: "1px",
    }
};

export default FullScreenLoader;
