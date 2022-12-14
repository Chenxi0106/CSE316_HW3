
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
export default function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    let name = store.editListName;

    function deleteList(event){
        document.getElementById("delete-list-modal").classList.remove("is-visible");
        store.deleteSelectedList();
    }
    function cancelDeleteList(event){
        document.getElementById("delete-list-modal").classList.remove("is-visible");
        store.cancelDeleteList();
    }


    return (
        <div 
            class="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-list-root'>
                    <div class="modal-north">
                        Delete playlist?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently delete {name} from playlist?
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



