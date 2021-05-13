import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";

import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import coverGam from '../../tracks/childishGambion/cover.jpeg';
import songGam from '../../tracks/childishGambion/song.mp3'

import coverKid from '../../tracks/kidCudi/cover.jpeg';
import songKid from '../../tracks/kidCudi/song.mp3';

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
        maxHeight: 600,
        minWidth: 200,
        minHeight: 200
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
            loadSong('next')
        },
        previous() {
            loadSong('previous')
        }
    }))

    const songs = [
        {
            song: songKid ,
            image: coverKid,
            author: 'Kid Cudi',
            title: "Day 'N' Nite"
        },
        {
            song: songGam,
            image: coverGam,
            author: 'Chidlish Gambino',
            title: 'Redbone'
        }
    ]

    const calculateProgress = () => {
        setProgress(() => {
            console.log("UPDATING", (song.currentTime / song.duration) * 100)
            return (song.currentTime / song.duration) * 100
        })
        setTimeout(() => {
            calculateProgress()
        }, 100)
    }

    const loadSong = async (position) => {
        let offset = position === 'next' ? 1 : -1
        const newIndex = Math.abs ((songIndex + offset) % songs.length)

        console.log(songs[offset])

        await setSongIndex(newIndex)

        await song.pause()
        await setPlay(false)



        await setSong(new Audio(songs[newIndex].song))
        await setProgress(0)

        console.log(play, songIndex, progress)
    }

    // State for knowing if music player is playing or not
    const [play, setPlay] = useState(false)


    // State for pointer in playlist
    const [songIndex, setSongIndex] = useState(0)

    //State for currently playing song
    const [song, setSong] = useState(new Audio(songs[songIndex].song))

    //State for progress
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        console.log("USE EFFECT")
        song.addEventListener('ended', () => {
            setPlay(false)
        })
        calculateProgress()
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
                <img src={songs[songIndex].image} className={classes.albumCover}/>
            </div>
            <div className={classes.songInfo}>
                <h1>{songs[songIndex].author}</h1>
                <p>{songs[songIndex].title}</p>
            </div>
            <div className={classes.root}>
                <LinearProgress variant="determinate" value={progress} />
            </div>
            <div className={classes.mainContainer}>
                <div className={classes.playerControls}>
                    <IconButton className={classes.iconButton}>
                        <SkipPreviousIcon className={classes.icon} onClick={() => loadSong('previous')}/>
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        { play ? <PlayArrowIcon className={classes.iconPlay} onClick={togglePlay}/> : <StopIcon className={classes.iconPlay} onClick={togglePlay}/> }
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        <SkipNextIcon className={classes.icon} onClick={()=> loadSong('next')}/>
                    </IconButton>
                </div>
            </div>
        </div>
    )
})

export default MusicPlayer
