import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import jsTPS from './jsTPS';


export class AddSong_Transaction extends jsTPS {
    constructor(store,i,s){
        super();
        this.store=store;
        this.index=i;
        this.song=s;
        }
        doTransaction(){
            this.store.addNewSong(this.index,this.song);
        }
        
    
        undoTransaction() {
            this.store.setDeleteSongIndex(this.index);
            this.store.deleteSongList();
        }

 
}
 

/*
export default class AddSongTransaction extends jsTPS{
    constructor(i,s){
    this.index=i;
    this.song=s;
    }
    doTransaction(){
        const { store } = useContext(GlobalStoreContext);
        store.addNewSong(index,song);
    }
    

    undoTransaction() {
        const { store } = useContext(GlobalStoreContext);
        this.store.setDeleteSongIndex(index);
        this.store.deleteSongList();
    }
    
}


*/