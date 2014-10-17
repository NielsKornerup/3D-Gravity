var allParticles=[];
var Num = 50;
//var width = canvas.width;
//var height = canvas.height;
var scene = new THREE.Scene();
var maxSize = 10;
var gravConstant = 1;
var PI = 3.141592;
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var startFrame = 0;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

	var renderer;
	if (window.WebGLRenderingContext) {
		renderer = new THREE.WebGLRenderer();
	}
	else {
		renderer = new THREE.CanvasRenderer();
	}

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	function init(){
		for(var i = 0; i < Num; i++){
			var obj = new Object();
			obj.x = 0;
			obj.y = 0;
			obj.z = 0;
			obj.radius = Math.random()*maxSize;
			obj.xSpeed = Math.random()*40-20;
			obj.ySpeed = Math.random()*40-20;
			obj.zSpeed = Math.random()*40-20;
			var geometry = new THREE.SphereGeometry(obj.radius);
			var material = new THREE.MeshBasicMaterial( { color: getRandomColor() } );
			var sphere = new THREE.Mesh( geometry, material );
			obj.material = sphere;
			allParticles.push(obj);
		}
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 600;
		for(var i = 0; i < startFrame; i++){
			move();
		}
		for(var i = 0; i < Num; i++){
			scene.add( allParticles[i].material);
		}
	}

var move = function () {
	for(var x = 0; x < Num; x++){
		for(var y = x+1; y < Num; y++){
			var difX = (allParticles[x].x-allParticles[y].x);
			var difY = (allParticles[x].y-allParticles[y].y);
			var difZ = (allParticles[x].z-allParticles[y].z);
			var dist =Math.sqrt((Math.pow(difX,2)+Math.pow(difY,2)+Math.pow(difZ,2)));
			if(dist>5){
				allParticles[x].xSpeed-=(difX*allParticles[y].radius*gravConstant)/Math.pow(dist,2);
				allParticles[x].ySpeed-=(difY*allParticles[y].radius*gravConstant)/Math.pow(dist,2);
				allParticles[y].xSpeed+=(difX*allParticles[x].radius*gravConstant)/Math.pow(dist,2);
				allParticles[y].ySpeed+=(difY*allParticles[x].radius*gravConstant)/Math.pow(dist,2);
				allParticles[x].zSpeed-=(difZ*allParticles[y].radius*gravConstant)/Math.pow(dist,2);
				allParticles[y].zSpeed+=(difZ*allParticles[x].radius*gravConstant)/Math.pow(dist,2);
				
			}
		}
	}

	var xSum = 0;
	var ySum = 0;
	var zSum = 0;

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
	}
	camera.position.x = xSum/Num;
	camera.position.y = ySum/Num;
	camera.position.z = zSum/Num + 300;
};

init();

function reInit(){
Num = document.getElementById('numparticles').value;
gravConstant = document.getElementById('gravstr').value/100;
maxSize = document.getElementById('maxSize').value;
startFrame = document.getElementById('start').value*100;
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
