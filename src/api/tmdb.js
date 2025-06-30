// src/api/tmdb.js
import axios from 'axios';

const API_KEY = '966334fc295275c6593f6e525d52f57e';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
        page,
      },
    });
    return response.data; // возвращаем весь объект с пагинацией
  } catch (error) {
    console.error('Ошибка при получении фильмов:', error);
    return { results: [], total_results: 0 }; // чтобы избежать ошибок
  }
};

export const getGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data.genres; // массив жанров
};

// Создание гостевой сессии TMDB
export const getGuestSession = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/authentication/guest_session/new`,
      null,
      {
        params: {
          api_key: API_KEY,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании гостевой сессии:', error);
    return null;
  }
};

export const rateMovie = async (movieId, value, guestSessionId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/movie/${movieId}/rating`,
      { value },
      {
        params: {
          api_key: API_KEY,
          guest_session_id: guestSessionId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке рейтинга:', error.response || error);
    return null;
  }
};

// Получение фильмов, оцененных в рамках guest-сессии
export const getRatedMovies = async (guestSessionId, page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/guest_session/${guestSessionId}/rated/movies`,
      {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page,
          sort_by: 'created_at.asc',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      'Ошибка при получении оцененных фильмов:',
      error.response || error,
    );
    return { results: [], total_results: 0 };
  }
};

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении популярных фильмов:', error);
    return { results: [], total_results: 0 };
  }
};
