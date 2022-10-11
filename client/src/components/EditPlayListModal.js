
import { useContext } from "react";
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'


function EditePlayListModal() {
    const {store}=useContext(GlobalStoreContext);
    const history = useHistory();
    let title_value=store.editSongIndex==null?"" :store.currentList.songs[store.editSongIndex].title;
    let artist_value=store.editSongIndex==null?"" :store.currentList.songs[store.editSongIndex].artist;
    let youtube_value=store.editSongIndex==null?"" :store.currentList.songs[store.editSongIndex].youTubeId;
    

    const confirmModal=()=>{
        document.getElementById("playlist_card_edit_box").classList.remove("is-visible");
        let t=document.getElementById("title_input").value;
        let a=document.getElementById("artist_input").value;
        let y=document.getElementById("youtubeid_input").value;
        store.CreateTransaction_EditSong(t,a,y);
    }
    const cancelModal=()=>{
        document.getElementById("playlist_card_edit_box").classList.remove("is-visible");
        store.cancelEditSong();

    }

    return (        
        <div class="modal" id="playlist_card_edit_box" data-animation="slideInOutLeft">
                <div class="modal-root">
                <div class="modal-north">
                    Edit Song
                </div>
                <div class="modal-center" id="input_text_box">
                    <label class="input_label" id="input_label_1">Title:</label>
                    <input class="input_box" type='text' id="title_input" defaultValue={title_value} />
                    <label class="input_label" id="input_label_2">Artist:</label>
                    <input class="input_box" type='text' id="artist_input" defaultValue={artist_value} />
                    <label class="input_label" id="input_label_3">YouTubeId:</label>
                    <input class="input_box" type='text' id="youtubeid_input" defaultValue={youtube_value}/>
                </div>
                <div class="modal-south">
                    <input type="button" class="modal-button" id="play_card_edit_confirm"
                    onClick={confirmModal}
                     value='Confirm' />
                    <input type="button" class="modal-button" id="play_card_edit_cancel"
                    onClick={cancelModal}
                     value='Cancel' />
                </div>
                </div>
                
            </div>
    );
}

export default EditePlayListModal;