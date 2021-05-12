import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";

import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import logo from '../../tracks/placeholder.jpeg';

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
    albumCover: {
        maxWidth: 600,
        maxHeight: 800
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
    }
}));



const MusicPlayer = forwardRef((props, ref) => {

    const classes = useStyles()

    useImperativeHandle(ref, () => ({

        play() {
            if(!play) {
                togglePlay()
            }
        },
        pause() {
            if(play) {
                togglePlay()
            }
        },
        next() {
            console.log('next')
        },
        previous() {
            console.log('previous')
        }
    }))

    const songs = [
        {
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            image: '/tracks/placeholder.jpeg'
        }
    ]

    const calculateProgress = () => {
        setProgress(() => {
            return song.currentTime / song.duration
        })
    }

    // State for knowing if music player is playing or not
    const [play, setPlay] = useState(false)

    //State for currently playing song
    const [song, setSong] = useState(new Audio(songs[0].url))

    //State for progress
    const [progress, setProgress] = useState(30)

    useEffect(() => {
        song.addEventListener('ended', () => {
            setPlay(false)
        })
        setTimeout(() => {
            calculateProgress()
        }, 100)
    }, [])

    const togglePlay = () => {
        setPlay(previousPlay => {
            previousPlay ? song.pause() : song.play()
            return !previousPlay
        })
    }



    return (
        <div className={classes.mainContainer}>
            <div>
                <h2 className={classes.playerStatus}>{play? 'Playing now' : 'Currently paused'}</h2>
            </div>
            <div>
                <img src={logo} className={classes.albumCover}/>
            </div>
            <div className={classes.songInfo}>
                <h1>Kid Cudi</h1>
                <p>Day'n Night</p>
            </div>
            <div className={classes.root}>
                <LinearProgress variant="determinate" value={progress} />
            </div>
            <div className={classes.mainContainer}>
                <div className={classes.playerControls}>
                    <IconButton className={classes.iconButton}>
                        <SkipPreviousIcon className={classes.icon}/>
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        { play ? <PlayArrowIcon className={classes.iconPlay} onClick={togglePlay}/> : <StopIcon className={classes.iconPlay} onClick={togglePlay}/> }
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        <SkipNextIcon className={classes.icon}/>
                    </IconButton>
                </div>
            </div>
        </div>
    )
})

export default MusicPlayer
