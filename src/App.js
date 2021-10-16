import { debounce } from 'lodash';
import React, { useState, useCallback, useRef } from 'react';
import useBooksSearch from './useBooksSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const { loading, error, books, hasMore } = useBooksSearch(query, pageNumber);
  const lastBookElementRef = useCallback(node => {
    if (loading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('visible');
        setPageNumber(prevPage=>prevPage+1);
      }
    });
    if (node) {
      observer.current.observe(node);
    }
    console.log(node);
  }, [loading, hasMore]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };
  const debouncedHandleChange = useCallback(
    debounce(handleChange, 300),
    []);

  return (
    <>
      <input type="text" onChange={debouncedHandleChange} />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book}>{book}</div>;
        }
        return <div key={book}>{book}</div>;
      })}
      {loading && <div>Loading...</div>}
      {error && <div>Error...</div>}
    </>
  );
}

export default App;
