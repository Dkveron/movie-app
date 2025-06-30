import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Spin, Alert, Pagination } from 'antd';

import { searchMovies, getPopularMovies } from '../../../api/tmdb';
import MovieCard from '../../MovieCard/MovieCard';
import SearchMovie from '../../SearchMovie/SearchMovie';
import { AppContext } from '../../../AppContext/AppContext';

const SearchTab = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { genres } = useContext(AppContext);

  const fetchData = async (query, page) => {
    if (!navigator.onLine) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const movieData = query
        ? await searchMovies(query, page)
        : await getPopularMovies(page);
      setMovies(movieData.results || []);
      setTotalResults(movieData.total_results || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearch = (query) => {
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <SearchMovie onSearch={handleSearch} />
      {!isOnline && (
        <Alert
          message="No Internet Connection"
          description="Please check your internet connection."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      {loading ? (
        <Spin
          spinning={loading}
          tip="Loading movies..."
          style={{ display: 'block', margin: '50px auto' }}
        >
          <div style={{ minHeight: '200px' }} />
        </Spin>
      ) : (
        <>
          <Row gutter={[16, 16]} justify="center">
            {Array.isArray(genres) &&
              genres.length > 0 &&
              movies.map((movie) => (
                <Col
                  key={movie.id}
                  style={{
                    flex: '0 0 451px',
                    maxWidth: '451px',
                    display: 'flex',
                  }}
                >
                  <MovieCard movie={movie} genres={genres} />
                </Col>
              ))}
          </Row>
          {totalResults > 20 && (
            <Pagination
              current={currentPage}
              pageSize={20}
              total={totalResults}
              showSizeChanger={false}
              onChange={handlePageChange}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default SearchTab;
