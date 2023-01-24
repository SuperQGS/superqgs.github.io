import * as THREE from 'three';
import { GridHelper, PointLight, RGB_PVRTC_2BPPV1_Format } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {Text} from 'troika-three-text'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#worldCanvas"),
});
renderer.shadowMap.enabled = true;

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.setZ(30);

renderer.render( scene, camera );

//load texture
scene.background = new THREE.TextureLoader().load('resources/imgs/sky.png');
const bricks = new THREE.TextureLoader().load('resources/imgs/bricks.png');
const sand = new THREE.TextureLoader().load('resources/imgs/sand.bmp');
const dirt = new THREE.TextureLoader().load('resources/imgs/dirt.png');
const grass = new THREE.TextureLoader().load('resources/imgs/grass.png');
const tree = new THREE.TextureLoader().load('resources/imgs/tree.png');

//torus
const geometry = new THREE.SphereGeometry( 2, 10, 10);
const material = new THREE.MeshStandardMaterial( {color: "grey", roughness: 0, map:bricks} );
const torus = new THREE.Mesh( geometry, material );
torus.position.y = 1;

//plane
const planegeo = new THREE.PlaneGeometry(10000,10000);
const planemat = new THREE.MeshStandardMaterial( {color: "grey", map: sand} );
const plane = new THREE.Mesh( planegeo, planemat );
plane.rotation.x = plane.rotation.x = -Math.PI / 2;;
plane.rotation.y = 0;
plane.rotation.z = 0;
plane.receiveShadow = true;


//point light
const pointLight = new THREE.PointLight( "white",1);
pointLight.position.set(0,10,0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 512;
pointLight.shadow.mapSize.height = 512;

//ambient light
const ambientLight = new THREE.AmbientLight( "white", 1);

//grid helper
const gridHelper = new THREE.GridHelper(50,50);




function addChar() {
    const myText = new Text();
    myText.material = new THREE.MeshStandardMaterial( {color: "white", roughness: 0});
    myText.text = '&';
    myText.font = "cour.ttf";
    myText.fontWeight = "bold";
    myText.color = "black";
    myText.fontSize = 2;
    myText.side = THREE.DoubleSide;

    const [x,y,z] = Array(3).fill().map(() => Math.floor(THREE.MathUtils.randFloatSpread( 50 ) ));

    myText.position.set(x, y, z);

    myText.position.y = 1.25;

    scene.add(myText);
}
var chars = Array(10).fill().forEach(addChar);

//bricks
function addBricks() {
    const myText = new Text();
    myText.material = new THREE.MeshStandardMaterial( {color: "white", map: bricks});
    myText.text = '#';
    myText.font = "cour.ttf";
    myText.fontWeight = "bold";
    myText.color = "white";
    myText.fontSize = 2;
    myText.side = THREE.DoubleSide;

    const [x,y,z] = Array(3).fill().map(() => Math.floor(THREE.MathUtils.randFloatSpread( 50 ) ));

    myText.position.set(x, y/3, z);

    myText.position.y += 10;

    scene.add(myText);
}
var chars = Array(100).fill().forEach(addBricks);

//grass
function addGrass() {
    const myText = new Text();
    myText.material = new THREE.MeshStandardMaterial( {color: "white", map: grass});
    myText.text = ',';
    myText.font = "cour.ttf";
    myText.fontWeight = "bold";
    myText.color = "white";
    myText.fontSize = 2;
    myText.side = THREE.DoubleSide;

    const [x,y,z] = Array(3).fill().map(() => Math.floor(THREE.MathUtils.randFloatSpread( 50 ) ));

    myText.position.set(x, y, z);

    myText.position.y = 2;

    scene.add(myText);
}
var chars = Array(200).fill().forEach(addGrass);

//grass
function addTrees() {
    const myText = new Text();
    myText.material = new THREE.MeshStandardMaterial( {color: "white", map: tree});
    myText.text = 't';
    myText.font = "cour.ttf";
    myText.fontWeight = "bold";
    myText.color = "white";
    myText.fontSize = 2;
    myText.side = THREE.DoubleSide;

    const [x,y,z] = Array(3).fill().map(() => Math.floor(THREE.MathUtils.randFloatSpread( 50 ) ));

    myText.position.set(x, y, z);

    myText.position.y = 2;

    scene.add(myText);
}
var chars = Array(200).fill().forEach(addTrees);



//add all
scene.add(torus, pointLight, ambientLight, plane);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.1;

    //pointLight.position.z += 0.05;
    //pointLight.position.x += 0.05;

    var cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    //myText.lookAt(cameraPosition);

    //myText.sync()

    renderer.render( scene, camera );
}

animate();