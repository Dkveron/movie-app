import React, { createContext, useState, useEffect } from 'react';

import { getGuestSession, getGenres } from '../api/tmdb';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [genres, setGenres] = useState([]);
  const [ratedMovies, setRatedMovies] = useState(() => {
    const storedRatings = localStorage.getItem('ratedMovies');
    return storedRatings ? JSON.parse(storedRatings) : {};
  });

  useEffect(() => {
    async function init() {
      const storedSession = localStorage.getItem('guestSessionId');
      if (storedSession) {
        setGuestSessionId(storedSession);
      } else {
        const session = await getGuestSession();
        setGuestSessionId(session.guest_session_id);
        localStorage.setItem('guestSessionId', session.guest_session_id);
      }

      const genresList = await getGenres();
      setGenres(genresList);
      localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
    }

    init();
  }, [ratedMovies]);

  return (
    <AppContext.Provider
      value={{ guestSessionId, genres, ratedMovies, setRatedMovies }}
    >
      {children}
    </AppContext.Provider>
  );
};
