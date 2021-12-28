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

ortCamera.position.set(5,5,5);
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



var boxSize = 0.4;
var rows = 15;
var cols = 15;

var boxes = [];

var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
var material = new THREE.MeshLambertMaterial({color:0xffffff});
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
var speed = 0.075;
var scale = 0.8;
var stopped = false;

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, ortCamera);
    if (!stopped) {
        for (let i = 0; i < boxes.length; ++i) {
            for (let j = 0; j < boxes[i].length; ++j) {
                boxes[i][j].scale.y = ((Math.sin(
                    angle + Math.cos(boxes[i][j].position.x*scale) + Math.cos(boxes[i][j].position.z*scale)
                )+1) * (maxH - minH)) + minH;
            }
        }
        angle += speed;
        if (angle === Math.PI) angle = 0;
    }
}

render();