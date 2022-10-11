
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
export default function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    let name = store.currentList==null||store.deleteSongIndex==null||store.deleteSongIndex>=store.currentList.songs.length?"":store.currentList.songs[store.deleteSongIndex].title;

    function deleteList(event){
        document.getElementById("delete-songList-modal").classList.remove("is-visible");
        store.CreateTransaction_DeleteSong();
    }
    function cancelDeleteList(event){
        document.getElementById("delete-songList-modal").classList.remove("is-visible");
        store.cancelDeleteSongList();
    }


    return (
        <div 
            class="modal" 
            id="delete-songList-modal" 
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-list-root'>
                    <div class="modal-north">
                        Delete Song?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently delete the {name} from list?
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            class="modal-button" 
                            onClick={deleteList}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            class="modal-button" 
                            onClick={cancelDeleteList}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}



