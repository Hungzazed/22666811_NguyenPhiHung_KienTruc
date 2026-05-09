const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8082;

app.use(cors());
app.use(express.json());

// Dùng ảnh từ TMDB nên ổn định hơn
let movies = [
    {
        id: 1,
        title: 'Inception',
        director: 'Christopher Nolan',
        year: 2010,
        genre: 'Sci-Fi',
        rating: 8.8,
        image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    },
    {
        id: 2,
        title: 'Interstellar',
        director: 'Christopher Nolan',
        year: 2014,
        genre: 'Sci-Fi',
        rating: 8.6,
        image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    },
    {
        id: 3,
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        year: 2008,
        genre: 'Action',
        rating: 9.0,
        image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    },
    {
        id: 4,
        title: 'Avengers: Endgame',
        director: 'Anthony Russo, Joe Russo',
        year: 2019,
        genre: 'Superhero',
        rating: 8.4,
        image: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
    },
    {
        id: 5,
        title: 'Parasite',
        director: 'Bong Joon-ho',
        year: 2019,
        genre: 'Thriller',
        rating: 8.5,
        image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'
    }
];

// GET all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// GET movie by ID
app.get('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);

    const movie = movies.find(m => m.id === movieId);

    if (!movie) {
        return res.status(404).json({
            message: 'Movie not found'
        });
    }

    res.status(200).json(movie);
});

// POST new movie
app.post('/movies', (req, res) => {
    const { title, director, year, genre, rating, image } = req.body;

    if (!title) {
        return res.status(400).json({
            message: 'Movie title is required'
        });
    }

    const newId =
        movies.length > 0
            ? movies[movies.length - 1].id + 1
            : 1;

    const newMovie = {
        id: newId,
        title,
        director: director || '',
        year: year || null,
        genre: genre || '',
        rating: rating || 0,
        image:
            image ||
            'https://via.placeholder.com/300x450?text=No+Image'
    };

    movies.push(newMovie);

    res.status(201).json({
        message: 'Movie added successfully',
        movie: newMovie
    });
});

// DELETE movie
app.delete('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);

    const index = movies.findIndex(movie => movie.id === movieId);

    if (index === -1) {
        return res.status(404).json({
            message: 'Movie not found'
        });
    }

    const deletedMovie = movies.splice(index, 1);

    res.status(200).json({
        message: 'Movie deleted successfully',
        movie: deletedMovie[0]
    });
});

// PUT update movie
app.put('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);

    const movie = movies.find(m => m.id === movieId);

    if (!movie) {
        return res.status(404).json({
            message: 'Movie not found'
        });
    }

    const { title, director, year, genre, rating, image } = req.body;

    movie.title = title || movie.title;
    movie.director = director || movie.director;
    movie.year = year || movie.year;
    movie.genre = genre || movie.genre;
    movie.rating = rating || movie.rating;
    movie.image = image || movie.image;

    res.status(200).json({
        message: 'Movie updated successfully',
        movie
    });
});

app.listen(PORT, () => {
    console.log(`[Movie Service] running on port ${PORT}`);
});