
import React, {useRef, useEffect, useState} from 'react'

import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam";
import { makeStyles } from '@material-ui/core/styles';

import {drawHand} from './utils'

import * as fp from 'fingerpose'

//Custom gesture definition
import { palmOpenGestureLeft, palmOpenGestureRight} from './utils'

const useStyles = makeStyles((theme) => ({
    camera: {
        position: 'absolute',
        width: '45vw',
        height: 480,
        float: 'right'
    }
}));

function Camera(props) {

    const classes = useStyles()

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const [prediction, setPrediction] = useState(false)

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

            if (hand.length > 0) {
                const GE = new fp.GestureEstimator([
                    palmOpenGestureLeft,
                    palmOpenGestureRight
                ])
                const estimatedGestures = await GE.estimate(hand[0].landmarks, 7);
                // console.log(estimatedGestures)

                let bestGesture = ''
                estimatedGestures.gestures.forEach((gesture) => {
                    if (bestGesture === '') {
                        bestGesture = gesture
                    }
                    if (bestGesture !== '' && bestGesture.confidence < gesture.confidence) {
                        bestGesture = gesture
                    }
                })
                if (bestGesture !== '') {
                    console.log(bestGesture.name)
                    props.onDetection(bestGesture.name)
                    setPrediction(bestGesture)
                }
            }


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
            <h1>
                {prediction ? prediction.name : 'No prediction available'}
            </h1>
        </div>
    )
}

export default Camera
