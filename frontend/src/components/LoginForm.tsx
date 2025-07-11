import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate loading for better UX
        setTimeout(() => {
            console.log('Email: ', email);
            console.log('Password: ', password);
            setIsLoading(false);
            navigate('/dashboard');
        }, 1000);
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

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;