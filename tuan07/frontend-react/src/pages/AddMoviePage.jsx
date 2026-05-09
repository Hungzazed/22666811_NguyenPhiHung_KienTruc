import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

function AddMoviePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return;

        try {
            await axios.post(`${API.MOVIE}/movies`, { name, description });
            alert('Movie added successfully!');
            navigate('/movies'); // Quay lại danh sách phim
        } catch (error) {
            alert('Failed to add movie: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="auth-card" style={{ maxWidth: '600px' }}>
            <h2>Add New Movie</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                Fill in the details below to add a new blockbuster to the catalog.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px', display: 'block' }}>Movie Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Inception" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px', display: 'block' }}>Description</label>
                    <textarea 
                        placeholder="Brief summary of the movie..." 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        style={{ 
                            width: '100%',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.75rem',
                            color: 'white',
                            padding: '1rem',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            minHeight: '150px',
                            resize: 'vertical'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="button" onClick={() => navigate('/movies')} style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Cancel</button>
                    <button type="submit">Publish Movie</button>
                </div>
            </form>
        </div>
    );
}

export default AddMoviePage;
