import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../config';

function BookingPage() {
    const { movieId } = useParams();
    const [seatNumber, setSeatNumber] = useState('');
    const navigate = useNavigate();

    const handleBooking = async (e) => {
        e.preventDefault();
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            toast.warning("Please login first");
            navigate('/');
            return;
        }

        const user = JSON.parse(userStr);

        try {
            await axios.post(`${API.BOOKING}/bookings`, {
                movieName: movieId,
                seatNumber,
                user: user.username
            });
            
            // Hiện thông báo gửi yêu cầu thành công
            toast.info(`🎟️ Booking for ${movieId} submitted! Processing payment...`, {
                autoClose: 3000
            });
            
            // Tự động chuyển sang trang My Bookings
            navigate('/my-bookings');
        } catch (error) {
            console.error(error);
            toast.error('Booking failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="auth-card">
            <h2>Select Your Seat</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: '600' }}>
                Booking for: {movieId}
            </p>
            <form onSubmit={handleBooking}>
                <div className="form-group">
                    <label>Seat Number</label>
                    <input 
                        type="text" 
                        placeholder="e.g. A1, B5" 
                        value={seatNumber} 
                        onChange={e => setSeatNumber(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
}

export default BookingPage;
