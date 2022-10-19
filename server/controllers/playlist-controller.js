const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}
getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }
        if (!playlists.length) {
            return res
                .status(200)
                .json({ success: true, idNamePairs:[]})
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id : list._id,
                    name : list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

//own code
deletePlaylist= async(req,res)=>{
    let val=req.params.id;
    console.log("here it goes "+val)
    await Playlist.findByIdAndRemove({_id:req.params.id},(err, list) => {
        if (err) {
            return res.status(500).json({success:false, error:err})
        }
        return res.status(200).json({success:true,list:list})
    }).catch(err=>console.log(err))
}

createNewSong= (req,res)=>{
    const body=req.body;
    Playlist.findOne({ _id:body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        list.songs.splice(body.index,0,body.song);
        list.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                list: list
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
    }).catch(err => console.log(err))
}
moveTwoSong = (req,res) => {
    const body=req.body;
    Playlist.findOne({ _id:body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        let sourceSong=list.songs[body.sourceId];
        //console.log("my pointed list is "+sourceSong);
        let targetSong=list.songs[body.targetId];
        //console.log("my pointed list is "+targetSong);
        list.songs.splice(body.sourceId,1,targetSong);
        //console.log("left now list is "+list.songs);
        list.songs.splice(body.targetId,1,sourceSong);
        //console.log("right now list is "+list.songs);
        list.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                list: list
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Moved at backend!',
            })
        })
    console.log("list value are "+list.songs+" and id is "+body.id);
    }).catch(err => console.log(err))
}
updateSong=(req,res)=>{
    const body=req.body;
    console.log(body);
    console.log("before goes down, what is index?"+body.index);
    Playlist.findOne({ _id:body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        //let message={id:store.currentList._id,index:store.editSongIndex,object:{title:{t},artist:{a},youTubeId:{y}}};
        list.songs[body.index].title=body.title;
        list.songs[body.index].artist=body.artist;
        list.songs[body.index].youTubeId=body.youTubeId;
        list.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                list: list
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Update Backend!',
            })
        })
    }).catch(err => console.log(err))


}
deleteSong= async(req,res)=>{
    console.log(req.body);
    const body=req.body;
    Playlist.findOne({_id:body.id},(err,list)=> {
        if(err){
            return res.status(400).json({success:false, err:err})
        }
        list.songs.splice(body.index,1);
        console.log("right noew, list songs are"+ list.songs)
        list.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                list: list
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Update Backend!',
            })
        })

    }).catch(err => console.log(err))
}


//own code
updatePlaylistById=(req,res)=>{
    console.log(req.body);
    Playlist.findOne({_id:req.body.id},(err,list)=>{
        if(err){
            return res.status(400).json({success:false, err:err})
        }
        list.name=req.body.list.name;
        console.log(list);
        list.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                list: list
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Update Backend!',
            })
        })

    }).catch(err => console.log(err))
}




module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    deletePlaylist,
    createNewSong,
    moveTwoSong,
    updateSong,
    deleteSong,
    updatePlaylistById
}