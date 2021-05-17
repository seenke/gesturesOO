import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";

import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
    icon: {
        height: 75,
        width: 75,
        color: 'white'
    },
    iconPlay: {
        height: 100,
        width: 100,
        color: 'white'
    },
    playerControls: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    mainContainer: {
        display: 'inline-block',
        margin: "auto",
        textAlign: 'center'
    },
    albumCoverContainer: {
        width: 600,
        height: 600,
    },
    albumCover: {
        width: '100%',
        height: '100%'
    },
    songInfo: {
        color: 'white'
    },
    playerStatus: {
        color: 'white',
        fontWeight: 100
    },
    iconButton: {
        color: 'white'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));


let player = null
let position = 0
let duration = 0
let playStatus = false


const MusicPlayer = forwardRef((props, ref) => {

    const classes = useStyles()

    //Get here https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
    const token = 'Insert token';

    /*useImperativeHandle(ref, () => ({

        play() {
            if (!play) {
                togglePlay()
            }
        },
        pause() {
            if (play) {
                togglePlay()
            }
        },
        next() {
            loadSong('next')
        },
        previous() {
            loadSong('previous')
        }
    }))*/

    useEffect(() => {
        connectPlayer();
        updateProgress()
    }, [])

    const connectPlayer = async () => {
        await waitForPlayer();
        player = new window.Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(token); }
        });
        player.connect();
        statusUpdates();
    }

    const waitForPlayer = () => {
        return new Promise(resolve => {
            if (window.Spotify) {
                resolve();
            } else {
                window.onSpotifyWebPlaybackSDKReady = resolve;
            }
        })
    }

    const statusUpdates = () => {
        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => {
            console.log(state);
            if (state && uri != state.track_window.current_track.uri) {
                setUri(state.track_window.current_track.uri)
                setTitle(state.track_window.current_track.name)
                setImage(state.track_window.current_track.album.images[2].url)
                setAuthor(state.track_window.current_track.artists.map(el => el.name).join(", "))
                position = state.position
                duration = state.duration
            }
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            transferPlayback(device_id)
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });
    }

    const transferPlayback = (device_id) => {
        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "device_ids": [device_id],
                "play": false,
            }),
        });
    }

    const togglePlay = () => {
        player.togglePlay().then(() => {
            setPlay(!play)
            playStatus = !playStatus
        })
    }

    const nextTrack = () => {
        player.nextTrack()
    }

    const previousTrack = () => {
        player.previousTrack()
    }


    const [uri, setUri] = useState(null)
    const [play, setPlay] = useState(false)
    const [image, setImage] = useState(null)
    const [author, setAuthor] = useState("None")
    const [title, setTitle] = useState("None")
    const [progress, setProgress] = useState(0)

    //Prosim ubij za to
    const updateProgress = () => {
        if (playStatus) {
            position = position + 100
            setProgress(position / duration * 100)
        }
        setTimeout(() => { updateProgress() }, 100)
    }

    return (
        <div className={classes.mainContainer}>
            <div>
                <h2 className={classes.playerStatus}>{play ? 'Playing now' : 'Currently paused'}</h2>
            </div>
            <div className={classes.albumCoverContainer}>
                {image && <img src={image} className={classes.albumCover} />}
            </div>
            <div className={classes.songInfo}>
                <h1>{title}</h1>
                <p>{author}</p>
            </div>
            <div className={classes.root}>
                <LinearProgress variant="determinate" value={progress} />
            </div>
            <div className={classes.mainContainer}>
                <div className={classes.playerControls}>
                    <IconButton className={classes.iconButton}>
                        <SkipPreviousIcon className={classes.icon} onClick={() => previousTrack()} />
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        {!play ? <PlayArrowIcon className={classes.iconPlay} onClick={togglePlay} /> : <StopIcon className={classes.iconPlay} onClick={togglePlay} />}
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        <SkipNextIcon className={classes.icon} onClick={() => nextTrack()} />
                    </IconButton>
                </div>
            </div>
        </div>
    )
})

export default MusicPlayer
