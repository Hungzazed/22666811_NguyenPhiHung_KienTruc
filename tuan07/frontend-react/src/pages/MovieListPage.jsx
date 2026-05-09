import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../config';

function MovieListPage() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`${API.MOVIE}/movies`);
            setMovies(response.data);
        } catch (error) {
            console.error("Failed to fetch movies", error);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/');
        } else {
            fetchMovies();
        }
    }, [navigate]);

    const getRandomGradient = (id) => {
        const gradients = [
            'linear-gradient(45deg, #1a1c2c, #4a192c)',
            'linear-gradient(45deg, #0f2027, #203a43, #2c5364)',
            'linear-gradient(45deg, #373333, #243b55)',
            'linear-gradient(45deg, #1e130c, #9a8478)',
            'linear-gradient(45deg, #000428, #004e92)'
        ];
        return gradients[id % gradients.length];
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2>Now Playing</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Explore the latest blockbusters and cinematic gems.</p>
                </div>
                
                <Link to="/add-movie" className="book-btn" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem 2rem' }}>
                    + Add New Movie
                </Link>
            </div>

            <div className="movie-grid">
                {movies.map(movie => (
                    <div key={movie.id} className="movie-card">
                        <div className="movie-poster" style={{ background: getRandomGradient(movie.id) }}></div>
                        <div className="movie-info">
                            <div className="movie-title">{movie.name}</div>
                            <p className="movie-desc">
                                {movie.description || "No description available for this movie yet."}
                            </p>
                            <Link to={`/book/${movie.name}`} className="book-btn">Get Tickets</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieListPage;
