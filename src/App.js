import './App.css';
import React, {useRef} from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';


import MusicPlayer from "./Components/MusicPlayer/MusicPlayer";
import Camera from "./Components/Camera/Camera";

const useStyles = makeStyles((theme) => ({
    root: {

    },
    content: {
        color: theme.palette.text.secondary,
        backgroundColor: '#091227',
        textAlign: 'center',
        height: '100vh'
    },
    camera: {
        backgroundColor: '#091227'
    }
}));


function App() {


    const classes = useStyles();
    const musicPlayer = useRef(null)

    const onDetection = (detection) => {
        switch (detection) {
            case 'palm_open_right':
                console.log("APP got palm open right")
                musicPlayer.current.play()
                break
            case 'palm_open_left':
                console.log("APP got palm open left")
                musicPlayer.current.pause()
                break
            case 'palm_outer_right':
                console.log("APP got palm_outer_right")
                musicPlayer.current.next()
                break
            case 'palm_outer_left':
                console.log("APP got palm_outer_left")
                musicPlayer.current.previous()
                break
            case 'thumbs_down':
                console.log("APP got thumbs_down")
                musicPlayer.current.volume_down()
                break
            case 'thumbs_up':
                console.log("APP got thumbs_up")
                musicPlayer.current.volume_up()
                break

        }
    }

    return (
    <div className={classes.root}>
        <Grid container>
            <Grid item xs={12} sm={12} lg={6} className={classes.content}>
                <MusicPlayer ref={musicPlayer}/>
            </Grid>
            <Grid item xs={12} sm={12} lg={6} className={classes.camera}>
                <Camera onDetection={onDetection}/>
            </Grid>
        </Grid>
    </div>
  );
}

export default App;
