import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../config';

function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    
    // Sử dụng sessionStorage để đồng bộ các ID đã thông báo trong cùng một tab trình duyệt
    const getNotifiedIds = () => {
        const saved = sessionStorage.getItem('notified_booking_ids');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    };

    const saveNotifiedIds = (idsSet) => {
        sessionStorage.setItem('notified_booking_ids', JSON.stringify(Array.from(idsSet)));
    };

    const fetchBookings = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/');
            return;
        }
        const user = JSON.parse(userStr);

        try {
            const response = await axios.get(`${API.BOOKING}/bookings/${user.username}`);
            const newBookings = response.data;
            const notifiedIds = getNotifiedIds();
            let changed = false;

            newBookings.forEach(booking => {
                // Nếu vé đã có kết quả (SUCCESS/FAILED) và chưa được thông báo trong phiên này
                if (booking.status !== 'PENDING' && !notifiedIds.has(booking.id)) {
                    if (booking.status === 'SUCCESS') {
                        toast.success(`🔔 THÀNH CÔNG: Vé #${booking.id} (${booking.movieName}) đã thanh toán!`, {
                            toastId: `success-${booking.id}` // Tránh lặp lại toast cho cùng 1 ID
                        });
                    } else if (booking.status === 'FAILED') {
                        toast.error(`❌ THẤT BẠI: Vé #${booking.id} bị từ chối thanh toán!`, {
                            toastId: `fail-${booking.id}`
                        });
                    }
                    notifiedIds.add(booking.id);
                    changed = true;
                }
            });

            if (changed) saveNotifiedIds(notifiedIds);
            setBookings(newBookings);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 3000);
        return () => clearInterval(interval);
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SUCCESS': return { color: '#10b981', fontWeight: 'bold' };
            case 'FAILED': return { color: '#ef4444', fontWeight: 'bold' };
            default: return { color: '#f59e0b', fontWeight: 'bold' };
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>My Booking History</h2>
                <button 
                    onClick={fetchBookings} 
                    className="btn-primary" 
                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                >
                    🔄 Refresh Status
                </button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Real-time updates from RabbitMQ Payment Service.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings.length === 0 ? (
                    <div className="auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        No bookings found.
                    </div>
                ) : (
                    bookings.map(b => (
                        <div key={b.id} className="movie-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2.5rem', borderLeft: b.status === 'SUCCESS' ? '4px solid #10b981' : b.status === 'FAILED' ? '4px solid #ef4444' : '4px solid #f59e0b' }}>
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{b.movieName}</div>
                                <div style={{ color: 'var(--text-muted)' }}>Seat: {b.seatNumber} | Ticket ID: #{b.id}</div>
                            </div>
                            <div style={getStatusStyle(b.status)}>
                                {b.status === 'PENDING' ? '⏳ PROCESSING...' : b.status === 'SUCCESS' ? '✅ COMPLETED' : '❌ FAILED'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyBookingsPage;
