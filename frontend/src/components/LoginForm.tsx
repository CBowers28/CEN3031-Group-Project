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
        
        fetch('http://localhost:5000/api/login')
          .then(res => {
            if (!res.ok) throw new Error('Network response not ok');
            return res.json();
          })
          .then((users: { id: number; email: string; password: string }[]) => {
            const user = users.find(
              (u) => u.email === email && u.password === password
            );
        
            if (user) {
              navigate('/dashboard');
            } else {
              setError('Invalid email or password');
            }
          })
          .catch((err) => {
            console.error('Failed to fetch:', err);
            setError('Failed to connect to server');
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
                    <div className={styles.icon}>
                        ✉️
                    </div>
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
                    <div className={styles.icon}>
                        🔒
                    </div>
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