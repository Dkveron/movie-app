import { useContext, useEffect, useState } from 'react';
import { Row, Col, Pagination, Spin, Alert } from 'antd';

import { AppContext } from '../../../AppContext/AppContext.js';
import { getRatedMovies } from '../../../api/tmdb.js';
import MovieCard from '../../MovieCard/MovieCard.js';

const RatedPage = () => {
  const { guestSessionId } = useContext(AppContext);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatedMovies = async () => {
      if (!guestSessionId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getRatedMovies(guestSessionId, page);
        setMovies(data.results);
        setTotal(data.total_results);
      } catch (err) {
        setError('Ошибка загрузки оцененных фильмов');
      } finally {
        setLoading(false);
      }
    };

    fetchRatedMovies();
  }, [guestSessionId, page]);

  if (loading) return <Spin tip="Загрузка..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <>
      <Row gutter={[16, 16]} justify="center">
        {movies.map((movie) => (
          <Col key={movie.id} style={{ width: 451 }}>
            <MovieCard movie={movie} isRatedView={true} />
          </Col>
        ))}
      </Row>
      {total > 20 && (
        <Pagination
          current={page}
          total={total}
          pageSize={20}
          onChange={(page) => setPage(page)}
          style={{ textAlign: 'center', marginTop: 24 }}
        />
      )}
    </>
  );
};

export default RatedPage;
