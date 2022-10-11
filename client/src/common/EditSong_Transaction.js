import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import jsTPS from './jsTPS';


export class EditSong_Transaction extends jsTPS {
    constructor(store,i,o,n){
        super();
        this.store=store;
        this.index=i;
        this.oldsong=o;
        this.newsong=n;
        }
        doTransaction(){
            this.store.confirmEditSong(this.index,this.newsong.title,this.newsong.artist,this.newsong.youTubeId);
        }
        
    
        undoTransaction() {
            this.store.confirmEditSong(this.index,this.oldsong.title,this.oldsong.artist,this.oldsong.youTubeId);
        }

 
}
 