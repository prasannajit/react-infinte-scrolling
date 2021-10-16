import { useEffect, useState } from "react";
const URL = 'http://openlibrary.org/search.json';

export default function useBooksSearch(query, pageNumber) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const getBooks = async () => {
        try {
            const response = await fetch(`${URL}?q=${query}&page=${pageNumber}`);
            const booksList = await response.json();
            setBooks(prevBooks => { return [...new Set([...prevBooks, ...booksList.docs.map(b => b.title)])] });
            setHasMore(booksList.docs.length > 0);
            setLoading(false);
            setError(false);
        }
        catch (e) {
            setLoading(false);
            setError(true);
        }
    };
    useEffect(() => {
        setBooks([]);
    },[query]);
    useEffect(() => {
        setLoading(true);
        setError(false);
        getBooks();
    }, [query, pageNumber]);
    return { loading, error, books, hasMore };
}