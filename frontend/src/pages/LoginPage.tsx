import React from "react";
import LoginForm from "../components/LoginForm";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
    return (
        <div className={styles.container}>
            {/* Main content */}
            <div className={styles.mainContent}>
                {/* Nepsis Logo/Brand */}
                <h1 className={styles.brandTitle}>
                    NEPSIS
                </h1>
                
                {/* Motivational Quote */}
                <p className={styles.motivationalQuote}>
                    "Discipline is the bridge between goals and accomplishment."
                </p>
                <p className={styles.quoteAuthor}>
                    — Jim Rohn
                </p>
            </div>
            
            {/* Login Form */}
            <div className={styles.formContainer}>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;