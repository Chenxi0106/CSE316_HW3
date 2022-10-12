import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleAdd(){
        store.CreateTransaction_AddSong();
       
    }


    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    let undoable= false;
    if (store.undoable())
        undoable = true;
    let redoable= false;
        if (store.redoable())
            redoable = true    
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!editStatus}
                value="+"
                className={enabledButtonClass}
                onClick={handleAdd}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!editStatus||!undoable}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!editStatus||!redoable}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!editStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;