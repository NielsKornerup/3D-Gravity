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
var time = 0;
var largestSize = 0;
var collisions=false;

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
		obj.radius =Math.ceil(Math.random()*maxSize);
		obj.mass = Math.pow(obj.radius,3);
		obj.xSpeed = Math.random()*40-20;
		obj.ySpeed = Math.random()*40-20;
		obj.zSpeed = Math.random()*40-20;
		obj.newXSpeed = obj.xSpeed;
		obj.newYSpeed = obj.ySpeed;
		obj.newZSpeed = obj.zSpeed;
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
		alert("This is a three dimensional particles simulator that is run using newton's definition for the force of gravity and three.js. If you want to mess with different settings, enter numbers into the boxes and press reload. The vector at the center of the screen shows the direction that the camera is currently moving. You can move the camera with wasd, and zoom in and out with j and k, respectively. Use l to toggle the camera vector. The elastic collisions are a little bit buggy, and I plan to fix them soon.");
	}
	if( keyboard.pressed("w")){
		deltaY+=10;
	}
	if( keyboard.pressed("s")){
		deltaY-=10;
	}
	if( keyboard.pressed("a")){
		deltaX-=10;
	}
	if( keyboard.pressed("d")){
		deltaX+=10;
	}
	if( keyboard.pressed("j")){
		deltaZ-=10;
	}
	if( keyboard.pressed("k")){
		deltaZ+=10;
	}
	if( keyboard.pressed("l")){
		showArrow = !showArrow;
	}
	for(var i = 0; i < Num; i++){
		allParticles[i].newXSpeed = allParticles[i].xSpeed;
		allParticles[i].newYSpeed = allParticles[i].ySpeed;
		allParticles[i].newZSpeed = allParticles[i].zSpeed;
		allParticles[i].newX = allParticles[i].x;
		allParticles[i].newY = allParticles[i].y;
		allParticles[i].newZ = allParticles[i].z;
	}
	for(var x = 0; x < Num; x++){
		for(var y = x+1; y < Num; y++){
			var particleA = allParticles[x];
			var particleB = allParticles[y];
			var difX = (particleA.x-particleB.x);
			var difY = (particleA.y-particleB.y);
			var difZ = (particleA.z-particleB.z);
			var dist =Math.sqrt((Math.pow(difX,2)+Math.pow(difY,2)+Math.pow(difZ,2)));
			if(dist>=particleA.radius + particleB.radius){
				particleA.newXSpeed-=(difX*particleB.mass*gravConstant)/Math.pow(dist,3);
				particleA.newYSpeed-=(difY*particleB.mass*gravConstant)/Math.pow(dist,3);
				particleA.newZSpeed-=(difZ*particleB.mass*gravConstant)/Math.pow(dist,3);
				particleB.newXSpeed+=(difX*particleA.mass*gravConstant)/Math.pow(dist,3);
				particleB.newYSpeed+=(difY*particleA.mass*gravConstant)/Math.pow(dist,3);
				particleB.newZSpeed+=(difZ*particleA.mass*gravConstant)/Math.pow(dist,3);
			}
			else if (collisions){
				//console.log("Particle #" + x + " (at (" + particleA.x + "," + particleA.y + "," + particleA.z + ")) and particle #" + y + " (at (" + particleB.x + "," + particleB.y + "," + particleB.z + ")) collide. Their radii are " + particleA.radius + " and " + particleB.radius + ". Their distance is " + dist + ".");
				var aSpeed = Math.sqrt(Math.pow(particleA.xSpeed,2)+Math.pow(particleA.ySpeed,2)+Math.pow(particleA.zSpeed,2));
				var bSpeed = Math.sqrt(Math.pow(particleB.xSpeed,2)+Math.pow(particleB.ySpeed,2)+Math.pow(particleB.zSpeed,2));
				var difX2 = (particleA.x-particleB.x);
				var difY2 = (particleA.y-particleB.y);
				var difZ2 = (particleA.z-particleB.z);
				var dist2 =Math.sqrt((Math.pow(difX2,2)+Math.pow(difY2,2)+Math.pow(difZ2,2)));
				var tunnelingObject=0;
				var nonTunnelingObject=0;
				if(aSpeed>bSpeed){
					tunnelingObject = y;
					nonTunnelingObject = x;
				}
				else{
					tunnelingObject = x;
					nonTunnelingObject = y;
				}
				while(dist2<(allParticles[tunnelingObject].radius+allParticles[nonTunnelingObject].radius)){
					difX2 = (particleA.newX-particleB.newX);
					difY2 = (particleA.newY-particleB.newY);
					difZ2 = (particleA.z-particleB.z);
					dist2 = Math.sqrt((Math.pow(difX2,2)+Math.pow(difY2,2)+Math.pow(difZ2,2)));
					allParticles[tunnelingObject].newX=allParticles[tunnelingObject].newX-allParticles[tunnelingObject].xSpeed/10;
					allParticles[tunnelingObject].newY=allParticles[tunnelingObject].newY-allParticles[tunnelingObject].ySpeed/10;
					allParticles[tunnelingObject].newZ=allParticles[tunnelingObject].newZ-allParticles[tunnelingObject].zSpeed/10;
				}

				particleA.newXSpeed=(((particleA.xSpeed*(particleA.mass-particleB.mass))+(2*particleB.mass*particleB.xSpeed))/(particleA.mass+particleB.mass));

				particleA.newYSpeed=(((particleA.ySpeed*(particleA.mass-particleB.mass))+(2*particleB.mass*particleB.ySpeed))/(particleA.mass+particleB.mass));

				particleA.newZSpeed=(((particleA.zSpeed*(particleA.mass-particleB.mass))+(2*particleB.mass*particleB.zSpeed))/(particleA.mass+particleB.mass));


				particleB.newXSpeed=(((particleB.xSpeed*(particleB.mass-particleA.mass))+(2*particleA.mass*particleA.xSpeed))/(particleB.mass+particleA.mass));

				particleB.newYSpeed=(((particleB.ySpeed*(particleB.mass-particleA.mass))+(2*particleA.mass*particleA.ySpeed))/(particleB.mass+particleA.mass));

				particleB.newZSpeed=(((particleB.zSpeed*(particleB.mass-particleA.mass))+(2*particleA.mass*particleA.zSpeed))/(particleB.mass+particleA.mass));
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
		allParticles[i].xSpeed = allParticles[i].newXSpeed;
		allParticles[i].ySpeed = allParticles[i].newYSpeed;
		allParticles[i].zSpeed = allParticles[i].newZSpeed;
		allParticles[i].x = allParticles[i].newX;
		allParticles[i].y = allParticles[i].newY;
		allParticles[i].z = allParticles[i].newZ;

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
	time++;
};

init();

function reInit(){
time=0;
Num = document.getElementById('numparticles').value;
gravConstant = document.getElementById('gravstr').value;
maxSize = document.getElementById('maxSize').value;
collisions = $("#Collisions").is(":checked");

allParticles = [];
scene = new THREE.Scene();
init();
}


var render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	move();
};
//setInterval(move, 100);
render();
