import * as THREE from 'three';

var container;
var camera;
var scene;
var renderer;

init();
animate();

function init() {
	container = document.getElementById('container');
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 );
	scene = new THREE.Scene();

	var geom = new THREE.PlaneGeometry(10, 10);
	var mat = new THREE.MeshBasicMaterial({color: 0xff0000});
	var mesh = new THREE.Mesh( geom, mat );

	scene.add(mesh);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );

	container.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame( animate );
    render();
}

function render() {
	renderer.render( scene, camera );
}