import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API.USER}/register`, { username, password });
            alert('Account created successfully!');
            navigate('/');
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="auth-card">
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default RegisterPage;
