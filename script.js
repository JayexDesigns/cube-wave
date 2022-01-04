// Scene And Default Background Color
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8f91fe);





// Orthographic Camera, It Has No Perspective, Great For Isometric Projections
const ortCameraDivider = 180;
const ortCamera = new THREE.OrthographicCamera(
    -window.innerWidth/ortCameraDivider,
    window.innerWidth/ortCameraDivider,
    window.innerHeight/ortCameraDivider,
    -window.innerHeight/ortCameraDivider,
    0.01,
    1000
);

ortCamera.position.set(15,15,15);
ortCamera.rotation.set(0,0,0);
ortCamera.lookAt(scene.position);



// Renderer Initialization
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);



window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    ortCamera.left = -window.innerWidth/ortCameraDivider;
    ortCamera.right = window.innerWidth/ortCameraDivider;
    ortCamera.top = window.innerHeight/ortCameraDivider;
    ortCamera.bottom = -window.innerHeight/ortCameraDivider;
    ortCamera.updateProjectionMatrix();
});





// Shaders, Just Puts Each Color In The Respective Face
const _VS = `
varying vec3 v_Normal;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_Normal = normal;
}
`;

const _FS = `
uniform vec3 modelColor1;
uniform vec3 modelColor2;
uniform vec3 modelColor3;

varying vec3 v_Normal;

void main () {
    gl_FragColor = vec4(
        v_Normal[0] * modelColor1[0] + v_Normal[1] * modelColor2[0] + v_Normal[2] * modelColor3[0],
        v_Normal[0] * modelColor1[1] + v_Normal[1] * modelColor2[1] + v_Normal[2] * modelColor3[1],
        v_Normal[0] * modelColor1[2] + v_Normal[1] * modelColor2[2] + v_Normal[2] * modelColor3[2],
    1.0);
}
`;





// Mesh Building Variables
let boxSize = 0.4;
let rows = 15;
let cols = 15;

let color1 = [255, 255, 255];
let color2 = [218, 218, 218];
let color3 = [109, 109, 109];

let boxes = [];

let geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
let material = new THREE.ShaderMaterial({
    uniforms: { // Default Shader Colors
        modelColor1: {value: new THREE.Vector3(color2[0]/255, color2[1]/255, color2[2]/255)},
        modelColor2: {value: new THREE.Vector3(color1[0]/255, color1[1]/255, color1[2]/255)},
        modelColor3: {value: new THREE.Vector3(color3[0]/255, color3[1]/255, color3[2]/255)},
    },
    vertexShader: _VS,
    fragmentShader: _FS,
});

const createBoxes = () => {
    for (let i = 0; i < rows; ++i) {
        boxes.push([]);
        for (let j = 0; j < cols; ++j) {
            let box = new THREE.Mesh(geometry, material);
            box.position.set(
                -(rows*boxSize/2) + boxSize/2 + i*boxSize,
                0,
                -(cols*boxSize/2) + boxSize/2 + j*boxSize
            );
            scene.add(box);
            boxes[i].push(box);
        }
    }
};

const deleteBoxes = () => {
    for (let i = 0; i < boxes.length; ++i) {
        for (let j = 0; j < boxes[i].length; ++j) {
            scene.remove(boxes[i][j]);
        }
    }
    boxes = [];
};

createBoxes();



// Animation Variables
let angle = 0;
let minH = 2;
let maxH = 7;
let speed = 0.065;
let offset = 2.75;
let stopped = false;

// Render Loop
let render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, ortCamera);
    if (!stopped) {
        for (let i = 0; i < boxes.length; ++i) {
            for (let j = 0; j < boxes[i].length; ++j) {
                let distance = boxes[i][j].position.x**2 + boxes[i][j].position.z**2;
                distance = -(distance / offset);
                boxes[i][j].scale.y = ((Math.sin(angle + distance)+1) * (maxH - minH)) + minH;
            }
        }
        angle += speed;
        if (angle === Math.PI) angle = 0;
    }
}

render();





const controller = {
    changeBoxColor: (newColor1, newColor2, newColor3) => {
        color1 = [
            parseInt(newColor1.substr(0, 2), 16),
            parseInt(newColor1.substr(2, 2), 16),
            parseInt(newColor1.substr(4, 2), 16),
        ];
        color2 = [
            parseInt(newColor2.substr(0, 2), 16),
            parseInt(newColor2.substr(2, 2), 16),
            parseInt(newColor2.substr(4, 2), 16),
        ];
        color3 = [
            parseInt(newColor3.substr(0, 2), 16),
            parseInt(newColor3.substr(2, 2), 16),
            parseInt(newColor3.substr(4, 2), 16),
        ];
        for (let i = 0; i < boxes.length; ++i) {
            for (let j = 0; j < boxes[i].length; ++j) {
                boxes[i][j].material.uniforms.modelColor1.value = new THREE.Vector3(color2[0]/255, color2[1]/255, color2[2]/255);
                boxes[i][j].material.uniforms.modelColor2.value = new THREE.Vector3(color1[0]/255, color1[1]/255, color1[2]/255);
                boxes[i][j].material.uniforms.modelColor3.value = new THREE.Vector3(color3[0]/255, color3[1]/255, color3[2]/255);
                // boxes[i][j].material.color.setHex(color); // For Old Simple Color Without Shader
            }
        }
    },

    changeSceneColor: (color) => {
        color = parseInt(color, 16);
        scene.background = new THREE.Color(color);
    },

    palettes: [
        () => {
            controller.changeBoxColor("ffffff", "dadada", "6d6d6d");
            controller.changeSceneColor("8f91fe");
        },
        () => {
            controller.changeBoxColor("77aba5", "e6e4b0", "3f5484");
            controller.changeSceneColor("f9f9f9");
        },
        () => {
            controller.changeBoxColor("ff1233", "da0f2c", "6d0816");
            controller.changeSceneColor("1a1a1a");
        },
        () => {
            controller.changeBoxColor("1dd3b0", "b2ff9e", "086375");
            controller.changeSceneColor("3c1642");
        },
        () => {
            controller.changeBoxColor("5bc0be", "6fffe9", "3a506b");
            controller.changeSceneColor("0b132b");
        },
    ],

    changeMeshBuilding: (callback) => {
        stopped = true;
        deleteBoxes();
        callback();
        createBoxes();
        stopped = false;
    },

    changeBoxSize: (size) => controller.changeMeshBuilding(() => {
        boxSize = size;
        geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    }),

    changeRows: (r) => controller.changeMeshBuilding(() => rows = r),

    changeCols: (c) => controller.changeMeshBuilding(() => cols = c),

    changeMaxHeight: (h) => maxH = h,

    changeMinHeight: (h) => minH = h,

    changeSpeed: (s) => speed = s,

    changeOffset: (o) => offset = o,

    stop: () => stopped = !stopped,

    resetDefaultValues: () => {
        controller.changeBoxColor("ffffff", "dadada", "6d6d6d");
        controller.changeSceneColor("8f91fe");
        controller.changeBoxSize(0.4);
        controller.changeRows(15);
        controller.changeCols(15);
        controller.changeMaxHeight(7);
        controller.changeMinHeight(2);
        controller.changeSpeed(0.065);
        controller.changeOffset(2.75);
    },
};



// Starts With The Default Values
controller.resetDefaultValues();


// TODO
// Delta Time And Frames
// Wallpaper Engine Connection
// Improve Color Functions