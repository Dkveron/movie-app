import React, { useContext, useState } from 'react';
import { Card, Tag, Rate, Image } from 'antd';
import { format } from 'date-fns';

import defaultPoster from '../../assets/default-poster.png';
import { trimText } from '../../utils/trimText';
import { AppContext } from '../../AppContext/AppContext';
import { rateMovie } from '../../api/tmdb';
import './MovieCard.css';

const styles = {
  poster: {
    width: '183px',
    height: '277px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    border: '2px solid',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    pointerEvents: 'none',
  },
};

const getRatingColor = (rating) => {
  if (rating <= 3) return '#E90000';
  if (rating <= 5) return '#E97E00';
  if (rating <= 7) return '#E9D100';
  return '#66E900';
};

const MovieCard = ({ movie, genres }) => {
  const { guestSessionId } = useContext(AppContext);

  const movieGenres = (genres ?? [])
    .filter(
      (g) => Array.isArray(movie.genre_ids) && movie.genre_ids.includes(g.id),
    )
    .map((g) => g.name);

  const formattedDate = movie.release_date
    ? format(new Date(movie.release_date), 'MMMM d, yyyy')
    : 'Unknown date';

  const description = trimText(movie.overview, 80);

  const rating = movie.vote_average ?? 0;
  const ratingColor = getRatingColor(rating);

  const storedRatings = JSON.parse(localStorage.getItem('ratedMovies') || '{}');
  const [userRating, setUserRating] = useState(
    movie.rating ?? storedRatings[movie.id] ?? 0,
  );

  const handleRateChange = (value) => {
    if (!guestSessionId) return;

    rateMovie(movie.id, value, guestSessionId)
      .then(() => {
        const storedRatings = JSON.parse(
          localStorage.getItem('ratedMovies') || '{}',
        );
        storedRatings[movie.id] = value;
        localStorage.setItem('ratedMovies', JSON.stringify(storedRatings));
        setUserRating(value);
      })
      .catch((err) => {
        console.error('Ошибка при отправке рейтинга:', err.response || err);
      });
  };

  return (
    <Card className="card" bodyStyle={{ padding: 0 }}>
      <div style={{ ...styles.ratingBadge, borderColor: ratingColor }}>
        {rating.toFixed(1)}
      </div>
      <div className="cardBody">
        <Image
          alt={movie.title}
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : defaultPoster
          }
          style={styles.poster}
        />
        <div className="content">
          <h3 className="title">{movie.title}</h3>
          <p className="releaseDate">{formattedDate}</p>
          <div className="genresWrapper">
            {movieGenres.slice(0, 2).map((name) => (
              <Tag key={name}>{name}</Tag>
            ))}
          </div>
          <p className="description">{description}</p>
          <div className="footer">
            <Rate
              allowHalf
              count={10}
              style={{ fontSize: 14 }}
              disabled={!guestSessionId}
              value={userRating}
              onChange={handleRateChange}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
