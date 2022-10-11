import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import jsTPS from './jsTPS';


export class DeleteSong_Transaction extends jsTPS {
    constructor(store,i,s){
        super();
        this.store=store;
        this.index=i;
        this.song=s;
        }
        doTransaction(){
            this.store.deleteSongList();
        }
        
    
        undoTransaction() {
            this.store.addNewSong(this.index,this.song);
        }

 
}
 