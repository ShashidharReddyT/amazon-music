import { createContext, useContext, useState } from "react";

const MusicContext = createContext();

export function MusicProvider(props) {
    const { children } = props;
    const [selectedMusic, setMusic] = useState(null);

    return (
        <MusicContext.Provider value={{ selectedMusic, setMusic }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    return useContext(MusicContext);
}
