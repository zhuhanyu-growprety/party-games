import { useCallback, useEffect, useState } from 'react';
import { getReadingState, READING_STATE_EVENT } from '../lib/books';

export function useReadingState() {
  const [state, setState] = useState(getReadingState);

  const refresh = useCallback(() => {
    setState(getReadingState());
  }, []);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener(READING_STATE_EVENT, handler);
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener(READING_STATE_EVENT, handler);
      window.removeEventListener('focus', handler);
    };
  }, [refresh]);

  const isWantToRead = useCallback(
    (bookId) => state.wantToRead.includes(bookId),
    [state.wantToRead],
  );

  const getStatus = useCallback(
    (bookId) => {
      if (state.favorites.includes(bookId)) return 'favorites';
      if (state.wantToRead.includes(bookId)) return 'wantToRead';
      if (state.reading.includes(bookId)) return 'reading';
      if (state.finished.includes(bookId)) return 'finished';
      if (state.dropped.includes(bookId)) return 'dropped';
      return null;
    },
    [state],
  );

  return { state, refresh, isWantToRead, getStatus };
}
