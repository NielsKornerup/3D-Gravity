var allParticles=[];
var Num = 200;
//var width = canvas.width;
//var height = canvas.height;
var scene = new THREE.Scene();
var maxSize = 5;
var gravConstant = 1;
var PI = 3.141592;
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1 , 1000000);
var showArrow = true;
var keyboard = new THREEx.KeyboardState();

var largestSize = 0;

var arrowHelper;

var deltaX;
var deltaY;
var deltaZ;

var renderer;
if (window.WebGLRenderingContext) {
	renderer = new THREE.WebGLRenderer();
}
else {
	renderer = new THREE.CanvasRenderer();
}

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function init(){
	for(var i = 0; i < Num; i++){
		var obj = new Object();
		obj.x = 0;
		obj.y = 0;
		obj.z = 0;
		obj.radius = Math.random()*maxSize;
		obj.mass = Math.pow(obj.radius,3);
		obj.xSpeed = Math.random()*40-20;
		obj.ySpeed = Math.random()*40-20;
		obj.zSpeed = Math.random()*40-20;
		if(obj.radius > largestSize){
			largestSize = obj.radius;
		}
		var geometry = new THREE.SphereGeometry(obj.radius);
		var material = new THREE.MeshBasicMaterial( { color: getRandomColor() } );
		var sphere = new THREE.Mesh( geometry, material );
		obj.material = sphere;
		allParticles.push(obj);
	}
	var dir = new THREE.Vector3( 1, 0, 0 );
	var origin = new THREE.Vector3( 0, 0, 0 );
	var length = 1;
	var hex = 0xcf171d;
	arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
	scene.add(arrowHelper);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 300;
	arrowHelper.position.x = 0;
	arrowHelper.position.y = 0;
	arrowHelper.position.z = 0;
	deltaX=0;
	deltaY=0;
	deltaZ=0;
	for(var i = 0; i < Num; i++){
		scene.add( allParticles[i].material);
	}
}

var move = function () {
	
	

	if( keyboard.pressed("h")){
		alert("This is a three dimensional particles simulator that is run using newton's definition for the force of gravity and three.js. If you want to mess with different settings, enter numbers into the boxes and press reload. The vector at the center of the screen shows the direction that the camera is currently moving. You can move the camera with wasd, and zoom in and out with j and k, respectively. Use l to toggle the camera vector.");
	}
	if( keyboard.pressed("w")){
		deltaY+=5;
	}
	if( keyboard.pressed("s")){
		deltaY-=5;
	}
	if( keyboard.pressed("a")){
		deltaX-=5;
	}
	if( keyboard.pressed("d")){
		deltaX+=5;
	}
	if( keyboard.pressed("j")){
		deltaZ-=5;
	}
	if( keyboard.pressed("k")){
		deltaZ+=5;
	}
	if( keyboard.pressed("l")){
		showArrow = !showArrow;
	}
	
	for(var x = 0; x < Num; x++){
		for(var y = x+1; y < Num; y++){
			var difX = (allParticles[x].x-allParticles[y].x);
			var difY = (allParticles[x].y-allParticles[y].y);
			var difZ = (allParticles[x].z-allParticles[y].z);
			var dist =Math.sqrt((Math.pow(difX,2)+Math.pow(difY,2)+Math.pow(difZ,2)));
			if(dist>allParticles[x].radius + allParticles[y].radius){
				allParticles[x].xSpeed-=(difX*allParticles[y].mass*gravConstant)/Math.pow(dist,3);
				allParticles[x].ySpeed-=(difY*allParticles[y].mass*gravConstant)/Math.pow(dist,3);
				allParticles[y].xSpeed+=(difX*allParticles[x].mass*gravConstant)/Math.pow(dist,3);
				allParticles[y].ySpeed+=(difY*allParticles[x].mass*gravConstant)/Math.pow(dist,3);
				allParticles[x].zSpeed-=(difZ*allParticles[y].mass*gravConstant)/Math.pow(dist,3);
				allParticles[y].zSpeed+=(difZ*allParticles[x].mass*gravConstant)/Math.pow(dist,3);
				
			}
		}
	}

	var xSum = 0;
	var ySum = 0;
	var zSum = 0;
	var totalMass = 0;
	var centerOfXMass = 0;
	var centerOfYMass = 0;
	var centerOfZMass = 0;

	for(var i = 0; i < Num; i++){
		allParticles[i].material.translateX(allParticles[i].xSpeed);
		allParticles[i].material.translateY(allParticles[i].ySpeed);
		allParticles[i].material.translateZ(allParticles[i].zSpeed);
		allParticles[i].x+=allParticles[i].xSpeed;
		allParticles[i].y+=allParticles[i].ySpeed;
		allParticles[i].z+=allParticles[i].zSpeed;
		xSum += allParticles[i].x;
		ySum += allParticles[i].y;
		zSum += allParticles[i].z;
		centerOfXMass += allParticles[i].x*allParticles[i].mass;
		centerOfYMass += allParticles[i].y*allParticles[i].mass;
		centerOfZMass += allParticles[i].z*allParticles[i].mass;
		totalMass += allParticles[i].mass;
	}

	centerOfXMass = centerOfXMass/totalMass;
	centerOfYMass = centerOfYMass/totalMass;
	centerOfZMass = centerOfZMass/totalMass;
	camera.position.x = centerOfXMass + deltaX;
	camera.position.y = centerOfYMass + deltaY;
	camera.position.z = centerOfZMass + deltaZ + largestSize*40;
	arrowHelper.position.x = camera.position.x;
	arrowHelper.position.y = camera.position.y;
	if(showArrow){
		arrowHelper.position.z = camera.position.z - 3;
	}
	else{
		arrowHelper.position.z = camera.position.z + 600;
	}
	var direction = new THREE.Vector3(centerOfXMass + deltaX, centerOfYMass + deltaY, centerOfZMass + deltaZ);
	arrowHelper.setDirection(direction.normalize());
	arrowHelper.setLength(direction.length());
};

init();

function reInit(){
Num = document.getElementById('numparticles').value;
gravConstant = document.getElementById('gravstr').value;
maxSize = document.getElementById('maxSize').value;
allParticles = [];
scene = new THREE.Scene();
init();
}


var render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	move();
};
render();
