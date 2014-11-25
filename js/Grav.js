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
		obj.position = new Object();
		obj.velocity = new Object();
		obj.newVelocity = new Object(); 
		obj.newPosition = new Object();
		obj.position.x = 0;
		obj.position.y = 0;
		obj.position.z = 0;
		obj.radius =Math.ceil(Math.random()*maxSize);
		obj.mass = Math.pow(obj.radius,3);
		obj.velocity.x = Math.random()*40-20;
		obj.velocity.y = Math.random()*40-20;
		obj.velocity.z = Math.random()*40-20;
		obj.newVelocity.x = obj.velocity.x;
		obj.newVelocity.y = obj.velocity.y;
		obj.newVelocity.z = obj.velocity.z;
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
		allParticles[i].newVelocity.x = allParticles[i].velocity.x;
		allParticles[i].newVelocity.y = allParticles[i].velocity.y;
		allParticles[i].newVelocity.z = allParticles[i].velocity.z;
		allParticles[i].newPosition.x = allParticles[i].position.x;
		allParticles[i].newPosition.y = allParticles[i].position.y;
		allParticles[i].newPosition.z = allParticles[i].position.z;
	}
	for(var x = 0; x < Num; x++){
		for(var y = x+1; y < Num; y++){
			var particleA = allParticles[x];
			var particleB = allParticles[y];
			var difX = (particleA.position.x-particleB.position.x);
			var difY = (particleA.position.y-particleB.position.y);
			var difZ = (particleA.position.z-particleB.position.z);
			var dist =Math.sqrt((Math.pow(difX,2)+Math.pow(difY,2)+Math.pow(difZ,2)));
			if(dist>=particleA.radius + particleB.radius){
				particleA.newVelocity.x-=(difX*particleB.mass*gravConstant)/Math.pow(dist,3);
				particleA.newVelocity.y-=(difY*particleB.mass*gravConstant)/Math.pow(dist,3);
				particleA.newVelocity.z-=(difZ*particleB.mass*gravConstant)/Math.pow(dist,3);
				particleB.newVelocity.x+=(difX*particleA.mass*gravConstant)/Math.pow(dist,3);
				particleB.newVelocity.y+=(difY*particleA.mass*gravConstant)/Math.pow(dist,3);
				particleB.newVelocity.z+=(difZ*particleA.mass*gravConstant)/Math.pow(dist,3);
			}
			else if (collisions&&dist!=0){
				//console.log("Particle #" + x + " (at (" + particleA.position.x + "," + particleA.position.y + "," + particleA.position.z + ")) and particle #" + y + " (at (" + particleB.position.x + "," + particleB.position.y + "," + particleB.position.z + ")) collide. Their radii are " + particleA.radius + " and " + particleB.radius + ". Their distance is " + dist + ".");
				var aSpeed = Math.sqrt(Math.pow(particleA.velocity.x,2)+Math.pow(particleA.velocity.y,2)+Math.pow(particleA.velocity.z,2));
				var bSpeed = Math.sqrt(Math.pow(particleB.velocity.x,2)+Math.pow(particleB.velocity.y,2)+Math.pow(particleB.velocity.z,2));
				var difX2 = (particleA.position.x-particleB.position.x);
				var difY2 = (particleA.position.y-particleB.position.y);
				var difZ2 = (particleA.position.z-particleB.position.z);
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
					difX2 = (particleA.newPosition.x-particleB.newPosition.x);
					difY2 = (particleA.newPosition.y-particleB.newPosition.y);
					difZ2 = (particleA.newPosition.z-particleB.newPosition.z);
					dist2 = Math.sqrt((Math.pow(difX2,2)+Math.pow(difY2,2)+Math.pow(difZ2,2)));
					allParticles[tunnelingObject].newPosition.x=allParticles[tunnelingObject].newPosition.x-allParticles[tunnelingObject].velocity.x/10;
					allParticles[tunnelingObject].newPosition.y=allParticles[tunnelingObject].newPosition.y-allParticles[tunnelingObject].velocity.y/10;
					allParticles[tunnelingObject].newPosition.z=allParticles[tunnelingObject].newPosition.z-allParticles[tunnelingObject].velocity.z/10;
				}

				particleA.newVelocity.x=(((particleA.velocity.x*(particleA.mass-particleB.mass))+(2*particleB.mass*particleB.velocity.x))/(particleA.mass+particleB.mass));

				particleA.newVelocity.y=(((particleA.velocity.y*(particleA.mass-particleB.mass))+(2*particleB.mass*particleB.velocity.y))/(particleA.mass+particleB.mass));

				particleA.newVelocity.z=(((particleA.velocity.z*(particleA.mass-particleB.mass))+(2*particleB.mass*particleB.velocity.z))/(particleA.mass+particleB.mass));


				particleB.newVelocity.x=(((particleB.velocity.x*(particleB.mass-particleA.mass))+(2*particleA.mass*particleA.velocity.x))/(particleB.mass+particleA.mass));

				particleB.newVelocity.y=(((particleB.velocity.y*(particleB.mass-particleA.mass))+(2*particleA.mass*particleA.velocity.y))/(particleB.mass+particleA.mass));

				particleB.newVelocity.z=(((particleB.velocity.z*(particleB.mass-particleA.mass))+(2*particleA.mass*particleA.velocity.z))/(particleB.mass+particleA.mass));
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
		allParticles[i].velocity.x = allParticles[i].newVelocity.x;
		allParticles[i].velocity.y = allParticles[i].newVelocity.y;
		allParticles[i].velocity.z = allParticles[i].newVelocity.z;
		allParticles[i].position.x = allParticles[i].newPosition.x;
		allParticles[i].position.y = allParticles[i].newPosition.y;
		allParticles[i].position.z = allParticles[i].newPosition.z;

		allParticles[i].material.translateX(allParticles[i].velocity.x);
		allParticles[i].material.translateY(allParticles[i].velocity.y);
		allParticles[i].material.translateZ(allParticles[i].velocity.z);
		allParticles[i].position.x+=allParticles[i].velocity.x;
		allParticles[i].position.y+=allParticles[i].velocity.y;
		allParticles[i].position.z+=allParticles[i].velocity.z;

		xSum += allParticles[i].position.x;
		ySum += allParticles[i].position.y;
		zSum += allParticles[i].position.z;
		centerOfXMass += allParticles[i].position.x*allParticles[i].mass;
		centerOfYMass += allParticles[i].position.y*allParticles[i].mass;
		centerOfZMass += allParticles[i].position.z*allParticles[i].mass;
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
	gravConstant = document.getElementById('gravstr').value/100;
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
render();
