import React from "react";
import LoginForm from "../components/LoginForm";

//defines LoginPage as a functional component
const LoginPage: React.FC = () => {
    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            background: "#c1bfc0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <LoginForm />
        </div>
    );
};

export default LoginPage;