import React from 'react';
import { useLocation } from 'react-router-dom';
import Musicplayer from './Musicplayer';

function FeaturedSongDetails() {
    const { state } = useLocation();
    const itemData = state && state.itemData;

    if (!itemData) {
        return <div>Item data not available.</div>;
    }
    const artistsString = Array.isArray(itemData.artists) ? itemData.artists.join(', ') : 'No artists available';

    return (
        <div>
            <h2>Featured Song Details</h2>
            <img src={itemData.thumbnail} alt={itemData.name} className="artist-image" />
            <h3>Title: {itemData.title}</h3>
            <p>Album: {itemData.album}</p>
            <p>Artists: {artistsString}</p>
            <p>Date of Release: {itemData.dateOfRelease}</p>
            <p>Description: {itemData.description}</p>
            <p>Audiourl: {itemData.audio_url}</p>

            <Musicplayer audioUrl={itemData.audio_url} albumImage={itemData.thumbnail} title={itemData.title} />
        </div>
    );
}

export default FeaturedSongDetails;
