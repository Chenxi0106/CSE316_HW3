import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import { AddSong_Transaction } from '../common/AddSong_Transaction';
import { DeleteSong_Transaction } from '../common/DeleteSong_Transaction';
import { MoveSong_Transaction } from '../common/MoveSong_Transaction';
import { EditSong_Transaction } from '../common/EditSong_Transaction';
export const GlobalStoreContext = createContext({});

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SELECTED_LIST:"EDIT_SELECTED_LIST",
    DELETE_SELECTED_LIST:"DELETE_SELECTED_LIST",
    PREPARE_TO_EDIT_THE_SONG:"PREPARE_TO_EDIT_THE_SONG",
    PREPARE_TO_DELETE_THE_SONG:"PREPARE_TO_DELETE_THE_SONG"
 
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,

        //own code
        editListId:null,
        editListName:null,
        editSongIndex:null,
        deleteSongIndex:0,
        isListNameEditActive:false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(store.deleteSongIndex);
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    editListId:null,
                    editListName:null,
                    editSongIndex:null,
                    deleteSongIndex:null,
                    isListNameEditActive:false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    editListId:null,
                    editListName:null,
                    editSongIndex:null,
                    deleteSongIndex:null,
                    isListNameEditActive:true
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }

            //own code
            //delete or edit selected list
            case GlobalStoreActionType.EDIT_SELECTED_LIST:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    editListId:payload._id,
                    editListName:payload.name,
                    editSongIndex:null,
                    deleteSongIndex:null,
                    isListNameEditActive:false
                });
            }
            case GlobalStoreActionType.DELETE_SELECTED_LIST:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter-1,
                    listNameActive: store.listNameActive,
                    editListId:null,
                    editListName:null,
                    editSongIndex:null,
                    deleteSongIndex:null,
                    isListNameEditActive:false
                });
            }
            case GlobalStoreActionType.PREPARE_TO_EDIT_THE_SONG:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    editListId:null,
                    editListName:null,
                    editSongIndex:payload,
                    deleteSongIndex:null,
                    isListNameEditActive:true
                })
            }
            case GlobalStoreActionType.PREPARE_TO_DELETE_THE_SONG:{
                return setStore({
                    
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    editListId:null,
                    editListName:null,
                    editSongIndex:null,
                    deleteSongIndex:payload,
                    isListNameEditActive:true

                })
            }
            default:
                return store;
        }
        
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById({id:playlist._id, list:playlist});
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        //own code
        tps.clearAllTransactions();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }





    //own code
    store.createNewList= function(){
        async function asyncreateNewList() {
                    let request={name:"Untitled", item:[]};
                    const response = await api.createPlaylist(request);
                    if (response.data.success) {
                        let playlist = response.data.playlist;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: playlist
                        });
                    }
                    else {
                        console.log("API FAILED TO CREATE THE LIST");
                    }
                    const response1 = await api.getPlaylistPairs();
                    if (response1.data.success) {
                        let pairsArray = response1.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
        }
                asyncreateNewList();
                store.setCurrentList(store.idNamePairs[store.idNamePairs.length-1]._id);

    }
    
    store.showDeletedListModal=function(idNamePair){
        storeReducer({
            type:GlobalStoreActionType.EDIT_SELECTED_LIST,
            payload:idNamePair
        });
        document.getElementById("delete-list-modal").classList.add("is-visible");
    }

    store.deleteSelectedList = function(){
        async function asyncdeleteSelectedList(){
            const response= await api.deletePlaylist(store.editListId);
            if(response.data.success){
                store.loadIdNamePairs();
                storeReducer({
                    type:GlobalStoreActionType.DELETE_SELECTED_LIST,
                    payload:null
                })
               
            }
            else{
                console.log("API FAILED TO DELETE LIST");
            }
        }
        asyncdeleteSelectedList();
        
    }
    store.cancelDeleteList = function(){
        store.loadIdNamePairs();
      
    }

    store.CreateTransaction_AddSong= function(){
        let t=new AddSong_Transaction(store,store.currentList.songs.length,{title:"Untitled",artist:"Untitled",youTubeId:"dQw4w9WgXcQ"});
        tps.addTransaction(t);
    }


    //insert at current place
    store.addNewSong = function(i,s){
        async function asyncAddNewSong(){
            const sendMessage={id:store.currentList._id,index:i,song:s};
            const response=await api.createNewSong(sendMessage);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:response.data.list
                });
            }
            else{
                console.log("SERVER FAIL TO ADD THE LIST");
            }

        }
        asyncAddNewSong();
    }

    store.CreateTransaction_MoveSong=function (sourceId,targetId){
        let t=new MoveSong_Transaction(store,sourceId,targetId);
        tps.addTransaction(t);
    }


    store.moveTwoSong = function(sourceId,targetId){
        async function asyncMoveTwoSong(){
            let message={id:store.currentList._id,sourceId:sourceId,targetId:targetId};
            const response=await api.moveTwoSong(message);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:response.data.list
                });
            }
            else{
                console.log("List is not moved");
            }
        }
        asyncMoveTwoSong();
    } 

    store.showEditPlayListModal = function(id) {
        document.getElementById("title_input").value=store.currentList.songs[id].title;
        document.getElementById("artist_input").value=store.currentList.songs[id].artist;
        document.getElementById("youtubeid_input").value=store.currentList.songs[id].youTubeId;
        storeReducer({
            type:GlobalStoreActionType.PREPARE_TO_EDIT_THE_SONG,
            payload:id
        })
        document.getElementById("playlist_card_edit_box").classList.add("is-visible");
    }

    store.CreateTransaction_EditSong=function(t,a,y){
        let oldSong=store.currentList.songs[store.editSongIndex];
        let newSong={title:t,artist:a,youTubeId:y};
        let transaction=new EditSong_Transaction(store,store.editSongIndex,oldSong,newSong);
        tps.addTransaction(transaction);

    }
    
    store.confirmEditSong=function(i,t,a,y){
        async function asyncUpdateSong(){
            let message={id:store.currentList._id,index:i,title:t,artist:a,youTubeId:y};
            console.log(message);
            const response= await api.updateSong(message);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:response.data.list

                });
            }
            else{
                console.log("Fail to update the list");
            }

        }
        asyncUpdateSong();
    }

    store.cancelEditSong = function(){
        storeReducer({
            type:GlobalStoreActionType.SET_CURRENT_LIST,
            payload:store.currentList

        });
    }

    store.showDeleteSongModal=function(id){
        document.getElementById("delete-songList-modal").classList.add("is-visible");
        storeReducer({
            type:GlobalStoreActionType.PREPARE_TO_DELETE_THE_SONG,
            payload:id
        });
    }
    /*
    store.SetIndex=function(value){
        storeReducer({
            type:GlobalStoreActionType.PREPARE_TO_DELETE_THE_SONG,
            payload:value
        });
        store.deleteSongList();
    }
    */
    store.CreateTransaction_DeleteSong=function(){
        let t=new DeleteSong_Transaction(store,store.deleteSongIndex,store.currentList.songs[store.deleteSongIndex]);
        tps.addTransaction(t);

        
    }
    store.deleteSongList=function(value){
        async function asyncDeleteSongList(){
            let message={id:store.currentList._id,index:value};
            //let message={id:store.currentList._id,index:store.deleteSongIndex};
            console.log(message);
            const response=await api.deleteSong(message);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:response.data.list
                });
            }
            else{
                console.log("FAIL TO DELETE THE LIST");
            }
        }
        asyncDeleteSongList();
    }
    store.cancelDeleteSongList=function(){
        storeReducer({
            type:GlobalStoreActionType.SET_CURRENT_LIST,
            payload:store.currentList
        });
    }


 




    
/*
    store.getListName=function(id){
        async function asyncGetList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                return response.data.playlist.name;
            }
            else{
                return "x";
            }
        }
        asyncGetList(id);
    }
*/











    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    //own code
    store.redoable=function(){
        return tps.hasTransactionToRedo();
    }
    store.undoable=function(){
        return tps.hasTransactionToUndo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}