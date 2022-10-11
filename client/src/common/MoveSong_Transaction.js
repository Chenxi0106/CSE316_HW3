import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import jsTPS from './jsTPS';


export class MoveSong_Transaction extends jsTPS {
    constructor(store,source,target){
        super();
        this.store=store;
        this.sourceIndex=source;
        this.targetIndex=target;
        }
        doTransaction(){
            this.store.moveTwoSong(this.sourceIndex,this.targetIndex);
        }
        
    
        undoTransaction(){
            this.store.moveTwoSong(this.targetIndex,this.sourceIndex);
        }

 
}
 