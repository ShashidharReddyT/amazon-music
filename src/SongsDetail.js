import React from 'react';
import { useLocation } from 'react-router-dom';
import Musicplayer from './Musicplayer';

function AlbumDetails() {
    const { state } = useLocation();
    const itemData = state && state.itemData;

    if (!itemData) {
        return <div>Item data not available.</div>;
    }

    const artistNames = itemData.artist.map(artist => artist.name).join(', ');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <h2>Featured songs</h2>
            <img src={itemData.thumbnail} alt={itemData.title} className='thumbnaill' />
            <h3>{itemData.title}</h3>
            <p>{artistNames}</p>
            <p>{itemData.dateOfRelease}</p>

            {itemData.songs ? (
                <>
                    <h3>Songs:</h3>
                    <ul>
                        {itemData.songs.map((item, index) => (
                            <li key={index}>
                                <p>{item.title}</p>
                                <p className='datee'>{formatDate(item.dateOfRelease)}</p>
                                <Musicplayer audioUrl={item.audio_url} albumImage={item.image} title={item.title} />
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p></p>
            )}
            <Musicplayer audioUrl={itemData.audio_url} albumImage={itemData.thumbnail} title={itemData.title} />
        </div>
    );
}

export default AlbumDetails;
