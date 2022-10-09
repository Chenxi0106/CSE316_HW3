import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);


    //own code
    const handleDragStart = (event) => {
        let id=event.target.id;
        event.dataTransfer.setData("id", id.split('-')[1]);
    }
    const handleDragOver = (event) => {
        event.preventDefault();
       
    }
    const handleDragEnter = (event) => {
        event.preventDefault();
       
    }
    const handleDragLeave = (event) => {
        event.preventDefault();
      
    }
    const handleDrop = (event) => {
        event.preventDefault();
        let target = event.target.id;
        let targetId = target.split('-')[1];
        //line 46 condition : own code
        if(targetId!==""){
            let sourceId = event.dataTransfer.getData("id");
    
            // ASK THE MODEL TO MOVE THE DATA
            store.moveTwoSong(sourceId,targetId);

        }
    }

        




    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;