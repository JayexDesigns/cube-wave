//Scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
// scene.fog = new THREE.Fog(0x1a1a1a, 3, 20);



//Perspective Camera
var persCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.01,
    1000
);

persCamera.position.set(5,5,5);
persCamera.rotation.set(0,0,0);
persCamera.lookAt(scene.position);

//Orthographic Camera
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



//Renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);


//No Deformation When Resize
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



//Grid Helper
// var gridHelper = new THREE.GridHelper(100, 200, 0xFF0066, 0xFFFFFF);
// scene.add(gridHelper);



//Light
var light = new THREE.DirectionalLight(0xFFFFFF, 1.6);
light.position.set(2, 3, 1);
light.target = scene;
scene.add(light);
// var lightHelper = new THREE.DirectionalLightHelper(light, 0.5, 0xFFCC00);
// scene.add(lightHelper);



var boxSize = 0.4;
var rows = 15;
var cols = 15;

var boxes = [];

var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
var material = new THREE.MeshLambertMaterial({color:0x8f91fe});
for (let i = 0; i < rows; ++i) {
    boxes.push([]);
    for (let j = 0; j < cols; ++j) {
        let box = new THREE.Mesh(geometry, material);
        box.position.set(-Math.floor(rows*boxSize/2)+i*boxSize, 0, -Math.floor(cols*boxSize/2)+j*boxSize);
        scene.add(box);
        boxes[i].push(box);
    }
}



var angle = 0;
var minH = 2;
var maxH = 7;
var speed = 0.075;
var scale = 0.8;

//Drawing Function
var render = function() {
    requestAnimationFrame(render);
    // Choose Camera, ortCamera Or persCamera
    renderer.render(scene, ortCamera);
    for (let i = 0; i < boxes.length; ++i) {
        for (let j = 0; j < boxes[i].length; ++j) {
            boxes[i][j].scale.y = ((Math.sin(
                angle + Math.cos(Math.abs(boxes[i][j].position.x)*scale) + Math.cos(Math.abs(boxes[i][j].position.z)*scale)
            )+1) * (maxH - minH)) + minH;
        }
    }
    angle += speed;
}

render();