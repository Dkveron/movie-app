import React, { useState, useEffect, useMemo } from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';

const SearchMovie = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (value.trim() !== '') {
          onSearch(value);
        }
      }, 500),
    [onSearch],
  );

  useEffect(() => {
    if (inputValue.trim() !== '') {
      debouncedSearch(inputValue);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
    >
      <Input
        placeholder="Type to search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: 938, height: 40 }}
      />
    </div>
  );
};

export default SearchMovie;
