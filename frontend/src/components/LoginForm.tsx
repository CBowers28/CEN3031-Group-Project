import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    // Edit this to add login functionality
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Used for testing
        console.log('Email: ', email);
        console.log('Password: ', password);
        navigate('/dashboard'); // redirect after login
    };

    return(
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                width: '300px'
            }}
        >
            <h2 style={{ textAlign: 'center', color: 'black'}}>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Log In</button>
        </form>
    );
};

export default LoginForm;