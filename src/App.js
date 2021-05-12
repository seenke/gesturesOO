import './App.css';
import React from "react";
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

  return (
    <div className={classes.root}>
        <Grid container>
            <Grid item xs={12} sm={12} lg={6} className={classes.content}>
                <MusicPlayer/>
            </Grid>
            <Grid item xs={12} sm={12} lg={6} className={classes.camera}>
                <Camera/>
            </Grid>
        </Grid>
    </div>
  );
}

export default App;
