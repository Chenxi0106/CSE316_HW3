/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

router.post('/playlist', PlaylistController.createPlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)

//own code
router.delete('/playlist/:id',PlaylistController.deletePlaylist)
router.post('/playlistSongs',PlaylistController.createNewSong)
router.put('/playlistTwoSongs',PlaylistController.moveTwoSong)
router.put('/playlistSong',PlaylistController.updateSong)
router.put('/playlistDeleteSong',PlaylistController.deleteSong)

//own code
router.put('/playlistUpdate',PlaylistController.updatePlaylistById)





module.exports = router