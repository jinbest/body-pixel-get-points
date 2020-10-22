const img = document.getElementById('photo');
const w = 500, h = 375;


async function loadAndPredict() {
    const net = await bodyPix.load();
    const segmentation = await net.segmentPersonParts(img, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
    });
    console.log("segmentation", segmentation);
    for(let i = 0; i < segmentation.data.length; i++) {
        if ( 
            segmentation.data[i] !== 12 && 
            segmentation.data[i] !== 13 && 
            segmentation.data[i] !== 2 && 
            segmentation.data[i] !== 3 && 
            segmentation.data[i] !== 4 && 
            segmentation.data[i] !== 5
        ) {
            segmentation.data[i] = -1;
        } else {
            segmentation.data[i] = 0;
        }
    }
    const coloredPartImage = bodyPix.toColoredPartMask(segmentation);
    const opacity = 0;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    const canvas = document.getElementById('canvasImage');
    bodyPix.drawMask(canvas, img, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);

    let keypoints = [];
    for(let i = 0; i < segmentation.allPoses[0].keypoints.length; i++) {
        let item = {
            "x": Math.floor(segmentation.allPoses[0].keypoints[i].position.x),
            "y": Math.floor(segmentation.allPoses[0].keypoints[i].position.y)
        }
        keypoints.push(item);
    }
    console.log("keypoints", keypoints);
    for(let i = 0; i < keypoints.length; i++) {
        fillColor(500, 375, keypoints[i].x, keypoints[i].y, 255, 255, 255, 255);
    }
}


function fillColor(width, height, posx, posy, red, green, blue, alpha) {
    var dy = posy * width * 4;
    var pos = dy + posx * 4;
    var element = document.getElementById("canvasImage");
    var ctx = element.getContext("2d");
    var imageData = ctx.getImageData(0, 0, width, height);
    imageData.data[pos++] = red;
    imageData.data[pos++] = green;
    imageData.data[pos++] = blue;
    imageData.data[pos++] = alpha; 
    ctx.putImageData(imageData, 0, 0);
}


/* =========== Segmentation module ==============

==> segmentation.data

-1  background
0	left_face	                12	torso_front
1	right_face	                13	torso_back
2	left_upper_arm_front	    14	left_upper_leg_front
3	left_upper_arm_back	        15	left_upper_leg_back
4	right_upper_arm_front	    16	right_upper_leg_front
5	right_upper_arm_back	    17	right_upper_leg_back
6	left_lower_arm_front	    18	left_lower_leg_front
7	left_lower_arm_back	        19	left_lower_leg_back
8	right_lower_arm_front	    20	right_lower_leg_front
9	right_lower_arm_back	    21	right_lower_leg_back
10	left_hand	                22	left_foot
11	right_hand	                23	right_foot


==> segmentation.allPoses[0].keypoints
0  nose             6  rightShoulder    12 rightHip
1  leftEye          7  leftElbow        13 leftKnee
2  rightEye         8  rightElbow       14 rightKnee
3  leftEar          9  leftWrist        15 leftAnkle
4  rightEar         10 rightWrist       16 rightAnkle
5  leftShoulder     11 leftHip

==================================================== */

