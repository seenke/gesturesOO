import * as fp from 'fingerpose'

const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

//Drawing function
export const drawHand = (predictions, ctx) => {
    if(predictions.length > 0) {
        predictions.forEach((prediction) => {
            const landmarks = prediction.landmarks

            for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
                let finger = Object.keys(fingerJoints)[j];
                //  Loop through pairs of joints
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                    // Get pairs of joints
                    const firstJointIndex = fingerJoints[finger][k];
                    const secondJointIndex = fingerJoints[finger][k + 1];

                    // Draw path
                    ctx.beginPath();
                    ctx.moveTo(
                        landmarks[firstJointIndex][0],
                        landmarks[firstJointIndex][1]
                    );
                    ctx.lineTo(
                        landmarks[secondJointIndex][0],
                        landmarks[secondJointIndex][1]
                    );
                    ctx.strokeStyle = "plum";
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }


            for (let i=0 ; i< landmarks.length; i++) {
                const x = landmarks[i][0]

                const y = landmarks[i][1]

                ctx.beginPath()
                ctx.arc(x, y, 5, 0, 3 * Math.PI)

                ctx.fillStyle= "indigo"
                ctx.fill()
            }
        })
    }
}

const thumbsDownGesture = new fp.GestureDescription('thumbs_down');

thumbsDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
thumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0);
thumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownLeft, 0.5);
thumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 0.5);


const palmOpenGestureRight = new fp.GestureDescription('palm_open_right')
palmOpenGestureRight.addCurl(fp.Finger.all, fp.FingerCurl.NoCurl, 1.0)
palmOpenGestureRight.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0)

palmOpenGestureRight.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 1.0)
palmOpenGestureRight.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.5)

palmOpenGestureRight.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0)

palmOpenGestureRight.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 1.0)

palmOpenGestureRight.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpLeft, 1.0)


const palmOpenGestureLeft = new fp.GestureDescription('palm_open_left')
palmOpenGestureLeft.addCurl(fp.Finger.all, fp.FingerCurl.NoCurl, 1.0)
palmOpenGestureLeft.addDirection(fp.Finger.Thumb, fp.FingerCurl.DiagonalUpLeft, 1.0)

palmOpenGestureLeft.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 1.0)
palmOpenGestureLeft.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.5)

palmOpenGestureLeft.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0)
palmOpenGestureLeft.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpLeft, 0.4)

palmOpenGestureLeft.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 1.0)

palmOpenGestureLeft.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpRight, 1.0)

const palmOuterRight = new fp.GestureDescription('palm_outer_right')
palmOuterRight.addCurl(fp.Finger.all, fp.FingerCurl.NoCurl, 1.0)
palmOuterRight.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 1.0)

palmOuterRight.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalRight, 1.0)

palmOuterRight.addDirection(fp.Finger.Middle, fp.FingerDirection.HorizontalRight, 1.0)

palmOuterRight.addDirection(fp.Finger.Ring, fp.FingerDirection.HorizontalRight, 1.0)

palmOuterRight.addDirection(fp.Finger.Pinky, fp.FingerDirection.HorizontalRight, 1.0)

const palmOuterLeft = new fp.GestureDescription('palm_outer_left')
palmOuterLeft.addCurl(fp.Finger.all, fp.FingerCurl.NoCurl, 1.0)
palmOuterLeft.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0)

palmOuterLeft.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalLeft, 1.0)

palmOuterLeft.addDirection(fp.Finger.Middle, fp.FingerDirection.HorizontalLeft, 1.0)

palmOuterLeft.addDirection(fp.Finger.Ring, fp.FingerDirection.HorizontalLeft, 1.0)

palmOuterLeft.addDirection(fp.Finger.Pinky, fp.FingerDirection.HorizontalLeft, 1.0)


export {
    palmOpenGestureRight,
    palmOpenGestureLeft,
    palmOuterRight,
    palmOuterLeft
}
