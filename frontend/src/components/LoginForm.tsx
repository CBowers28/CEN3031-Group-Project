import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
