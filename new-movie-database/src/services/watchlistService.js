let cachedWatchlist = null;

export const getWatchlist = () => {
    if (cachedWatchlist === null) {
        const watchlistJSON = localStorage.getItem('watchlist');
        cachedWatchlist = watchlistJSON ? JSON.parse(watchlistJSON) : [];
    }
    return cachedWatchlist;
};

export const addToWatchlist = (movie) => {
    const watchlist = getWatchlist();
    if (!watchlist.some(item => item.id === movie.id)) {
        watchlist.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average
        });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        cachedWatchlist = watchlist;
    }
};

export const removeFromWatchlist = (movieId) => {
    const watchlist = getWatchlist();
    const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    cachedWatchlist = updatedWatchlist;
};

export const isInWatchlist = (movieId) => {
    const watchlist = getWatchlist();
    return watchlist.some(movie => movie.id === movieId);
};

export const clearCache = () => {
    cachedWatchlist = null;
};