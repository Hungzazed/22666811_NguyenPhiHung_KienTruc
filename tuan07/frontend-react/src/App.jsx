import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieListPage from './pages/MovieListPage';
import BookingPage from './pages/BookingPage';
import AddMoviePage from './pages/AddMoviePage';
import MyBookingsPage from './pages/MyBookingsPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? "active" : ""}>Movies</NavLink>
          <NavLink to="/add-movie" className={({ isActive }) => isActive ? "active" : ""}>Add Movie</NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => isActive ? "active" : ""}>My Bookings</NavLink>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/movies" element={<MovieListPage />} />
            <Route path="/add-movie" element={<AddMoviePage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/book/:movieId" element={<BookingPage />} />
          </Routes>
        </div>
        
        {/* Container cho Toast Notifications */}
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;
