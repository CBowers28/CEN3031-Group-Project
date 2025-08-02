import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    console.log("Submitting login", { email, password });

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(async (res) => {
        if (!res.ok) {
            const errData = await res.json();
            if (errData.error === "Email not found") {
                const wantsToSignUp = window.confirm("Email not found. Would you like to sign up?");
                if (wantsToSignUp) {
                    // Send a signup request
                    return fetch('http://localhost:5000/api/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    })
                    .then(async (signupRes) => {
                        if (!signupRes.ok) {
                            const signupErr = await signupRes.json();
                            throw new Error(signupErr.error || 'Signup failed');
                        }
                        return signupRes.json();
                    })
                    .then((signupData) => {
                        if (signupData.success) {
                            navigate('/dashboard');
                        } else {
                            setError('Signup failed');
                        }
                    });
                } else {
                    throw new Error("Email not found");
                }
            } else {
                throw new Error("Invalid login");
            }
        }
        return res.json();
    })
    .then((data) => {
        if (data && data.success) {
            navigate('/dashboard');
        } else if (data) {
            setError('Invalid email or password');
        }
    })
    .catch((err) => {
        console.error('Login error:', err);
        if (err.message !== "Email not found") {
            setError(err.message || 'Login failed');
        }
    });
};

    return (
        <div className={styles.loginContainer}>
            {/* Form header */}
            <div className={styles.formHeader}>
                <h2 className={styles.title}>
                    Welcome Back
                </h2>
                <p className={styles.subtitle}>
                    Sign in to continue your journey
                </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Email Input */}
                <div className={styles.inputContainer}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <div className={styles.icon}>✉</div>
                </div>

                {/* Password Input */}
                <div className={styles.inputContainer}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <div className={styles.icon}>🔒</div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className={styles.submitButton}
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
