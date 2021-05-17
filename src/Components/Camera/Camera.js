
import React, {useRef, useEffect, useState} from 'react'

import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam";
import { makeStyles } from '@material-ui/core/styles';

import {drawHand, thumbsDownGesture, thumbsUpGesture} from './utils'

import * as fp from 'fingerpose'

import { Wave, Random } from 'react-animated-text';


//Custom gesture definition
import { palmOpenGestureLeft, palmOpenGestureRight, palmOuterRight, palmOuterLeft} from './utils'

const useStyles = makeStyles((theme) => ({
    camera: {
        position: 'absolute',
        width: '45vw',
        height: 480,
        float: 'right'
    },
    predictionTextContainer: {
        position: 'absolute',
        top: 500,
        width: '45vw',
        height: 200,
        float: 'right',
        color: 'white',
        textAlign: 'center'
    },
    predictionText: {
        fontSize: '10rem',
        fontWeight: 100
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
                    palmOpenGestureRight,
                    palmOuterRight,
                    palmOuterLeft,
                    thumbsUpGesture,
                    thumbsDownGesture
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
                    if (prediction.name !== bestGesture.name) {
                        setPrediction(bestGesture)
                    }
                }
            }


            //Draw mesh
            const ctx = canvasRef.current.getContext("2d")
            drawHand(hand, ctx)
        }
    }

    const predictionBeautify = (prediction) => {
        let text = ''
        switch (prediction){
            case 'palm_open_right':
                text = 'PLAY'
                break
            case 'palm_open_left':
                text = 'STOP'
                break
            case 'palm_outer_right':
                text = 'PREVIOUS'
                break
            case 'palm_outer_left':
                text = 'NEXT'
                break
            case 'thumbs_down':
                text = 'VOLUME_DOWN'
                break
            case 'thumbs_up':
                text = 'VOLUME_UP'
        }

        return text
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
            {
             prediction.name ? (
                 <div className={classes.predictionTextContainer}>
                     <h1 className={classes.predictionText}>
                         <Random
                             text={predictionBeautify(prediction.name)}
                             iterations={1}
                             effect="verticalFadeIn"
                             effectChange={1}
                             effectDirection="up"
                         />
                     </h1>
                 </div>
             ): null
            }
        </div>
    )
}

export default Camera
