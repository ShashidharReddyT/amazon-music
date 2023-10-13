import { createContext, useContext, useState } from "react";

const FavoriteSongsContext = createContext();

export function useFavoriteSongs() {
    return useContext(FavoriteSongsContext);
}

export function FavoriteSongsProvider({ children }) {
    const [favoriteSongs, setFavoriteSongs] = useState([]);

    const toggleFavorite = (songId) => {
        if (favoriteSongs.includes(songId)) {
            setFavoriteSongs(favoriteSongs.filter((id) => id !== songId));
        } else {
            setFavoriteSongs([...favoriteSongs, songId]);
        }
    };

    return (
        <FavoriteSongsContext.Provider value={{ favoriteSongs, toggleFavorite }}>
            {children}
        </FavoriteSongsContext.Provider>
    );
}
