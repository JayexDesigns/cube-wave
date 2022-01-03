var scene = new THREE.Scene();
scene.background = new THREE.Color(0x8f91fe);



var persCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.01,
    1000
);

persCamera.position.set(5,5,5);
persCamera.rotation.set(0,0,0);
persCamera.lookAt(scene.position);



const ortCameraDivider = 180;
var ortCamera = new THREE.OrthographicCamera(
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



var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);



window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    persCamera.aspect = window.innerWidth / window.innerHeight;
    persCamera.updateProjectionMatrix();
    ortCamera.left = -window.innerWidth/ortCameraDivider;
    ortCamera.right = window.innerWidth/ortCameraDivider;
    ortCamera.top = window.innerHeight/ortCameraDivider;
    ortCamera.bottom = -window.innerHeight/ortCameraDivider;
    ortCamera.updateProjectionMatrix();
});



var light = new THREE.DirectionalLight(0xffffff, 1.6);
light.position.set(2, 3, 1);
light.target = scene;
scene.add(light);





//Shaders
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





var boxSize = 0.4;
var rows = 15;
var cols = 15;

var boxes = [];

var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
var material = new THREE.ShaderMaterial({
    uniforms: {
        modelColor1: {value: new THREE.Vector3(0.8549019607843137, 0.8549019607843137, 0.8549019607843137)},
        modelColor2: {value: new THREE.Vector3(1, 1, 1)},
        modelColor3: {value: new THREE.Vector3(0.4274509803921568, 0.4274509803921568, 0.4274509803921568)},
    },
    vertexShader: _VS,
    fragmentShader: _FS,
});
// var material = new THREE.MeshLambertMaterial({color:0xffffff}); // Old Simple Color Without Shader
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



var angle = 0;
var minH = 2;
var maxH = 7;
var speed = 0.065;
var scale = 2.75;
var stopped = false;

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, ortCamera);
    if (!stopped) {
        for (let i = 0; i < boxes.length; ++i) {
            for (let j = 0; j < boxes[i].length; ++j) {
                let distance = boxes[i][j].position.x**2 + boxes[i][j].position.z**2;
                distance = -(distance / scale);
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
        newColor1 = [
            parseInt(newColor1.substr(0, 2), 16),
            parseInt(newColor1.substr(2, 2), 16),
            parseInt(newColor1.substr(4, 2), 16),
        ];
        newColor2 = [
            parseInt(newColor2.substr(0, 2), 16),
            parseInt(newColor2.substr(2, 2), 16),
            parseInt(newColor2.substr(4, 2), 16),
        ];
        newColor3 = [
            parseInt(newColor3.substr(0, 2), 16),
            parseInt(newColor3.substr(2, 2), 16),
            parseInt(newColor3.substr(4, 2), 16),
        ];
        for (let i = 0; i < boxes.length; ++i) {
            for (let j = 0; j < boxes[i].length; ++j) {
                boxes[i][j].material.uniforms.modelColor1.value = new THREE.Vector3(newColor2[0]/255, newColor2[1]/255, newColor2[2]/255);
                boxes[i][j].material.uniforms.modelColor2.value = new THREE.Vector3(newColor1[0]/255, newColor1[1]/255, newColor1[2]/255);
                boxes[i][j].material.uniforms.modelColor3.value = new THREE.Vector3(newColor3[0]/255, newColor3[1]/255, newColor3[2]/255);
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

    resetDefaultValues: () => {
        controller.palettes[0]();
    },
};



controller.resetDefaultValues();