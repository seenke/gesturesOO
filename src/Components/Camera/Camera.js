
import React, {useRef, useEffect} from 'react'

import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam";
import { makeStyles } from '@material-ui/core/styles';

import {drawHand} from './utils'

import fp from 'fingerpose'

const useStyles = makeStyles((theme) => ({
    camera: {
        position: 'absolute',
        width: '45vw',
        height: 480,
        float: 'right'
    }
}));

function Camera() {

    const classes = useStyles()

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const GE = new fp.GestureEstimator([
        fp.Gestures.VictoryGesture,
        fp.Gestures.ThumbsUpGesture
    ])

    const runHandpose = async () => {
        const net = await handpose.load()
        console.log('Handpose model loaded')

        // Loop and detect hands
        setInterval(() => {
            detect(net)
        }, 100)
    }

    const detect = async (net) => {
        if (typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null
            && webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video
            const videoWidth = webcamRef.current.video.videoWidth
            const videoHeight = webcamRef.current.video.videoHeight

            webcamRef.current.video.width = videoWidth
            webcamRef.current.video.height = videoHeight

            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight

            const hand = await net.estimateHands(video)
            console.log(hand)

            // const estimatedGestures = GE.estimate(hand.landmarks, 7,5)

            //Draw mesh
            const ctx = canvasRef.current.getContext("2d")
            drawHand(hand, ctx)
        }
    }

    useEffect(() =>{
        runHandpose()
    }, [])

    return(
        <div>
            <Webcam ref={webcamRef}
                    className={classes.camera}
            />

            <canvas
                ref={canvasRef}
                className={classes.camera}
            />
        </div>
    )
}

export default Camera
