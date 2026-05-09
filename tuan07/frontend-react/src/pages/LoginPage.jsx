import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API.USER}/login`, { username, password });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/movies');
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="auth-card">
            <h2>Welcome Back</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default LoginPage;
