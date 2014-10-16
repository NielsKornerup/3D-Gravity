var allParticles=[];
var Num = 50;
//var width = canvas.width;
//var height = canvas.height;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

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

	for(var i = 0; i < Num; i++){
		var obj = new Object();
		obj.x = Math.random()*10-5;
		obj.y = Math.random()*10-5;
		obj.z = Math.random()*10-5;
		obj.radius = Math.random()*10;
		obj.xSpeed = Math.random()*40-20;
		obj.ySpeed = Math.random()*40-20;
		obj.zSpeed = Math.random()*40-20;
		var geometry = new THREE.SphereGeometry(obj.radius);
		var material = new THREE.MeshBasicMaterial( { color: getRandomColor() } );
		var sphere = new THREE.Mesh( geometry, material );
		obj.material = sphere;
		allParticles.push(obj);
	}
	for(var i = 0; i < Num; i++){
		scene.add( allParticles[i].material);
	}

	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 200;
//}
//init();
var move = function () {
	for(var i = 0; i < Num; i++){
		allParticles[i].material.translateX(allParticles[i].xSpeed);
		allParticles[i].material.translateY(allParticles[i].ySpeed);
		allParticles[i].material.translateZ(allParticles[i].zSpeed);
	}
};

var render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	move();
};
render();


/*var canvas = document.getElementById("Collisions-canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var Speed = 2;
var MaxSize= 30;
var Num = 2;
var allParticles=[];
var PI = 3.141592;
var maxSpeed = 10;
var maxDist =900;
var vectors = false;

function initializeParticles() {
    for (var i = 0; i < Num; i++) {
        var particle = new Object();
	particle.radius = Math.random() * MaxSize;
	particle.x = (Math.random() * (width-5))+5;
        particle.y = (Math.random() * (height-particle.radius))+particle.radius;
        particle.xSpeed = Math.random() * maxSpeed;
        particle.ySpeed = Math.random() * maxSpeed;
	particle.mass = particle.radius*particle.radius;
	particle.newXSpeed=particle.xSpeed;
	particle.newYSpeed=particle.ySpeed;
	allParticles.push(particle);
    }
}

function moveParticles(){
for (var a = 0; a < allParticles.length; a++) {
allParticles[a].newYSpeed=allParticles[a].ySpeed;
allParticles[a].newXSpeed=allParticles[a].xSpeed;
allParticles[a].newX=allParticles[a].x;
allParticles[a].newY=allParticles[a].y;
for (var b = 0; b < allParticles.length; b++) {
var difX = (allParticles[a].x-allParticles[b].x);
var difY = (allParticles[a].y-allParticles[b].y);
var dist =Math.sqrt((Math.pow(difX,2)+Math.pow(difY,2)));
var aAngle = 0;
var bAngle = 0;
var caAngle = 0;
var difX2 = (allParticles[a].x-allParticles[b].x);
var difY2 = (allParticles[a].y-allParticles[b].y);
var dist2 =Math.sqrt((Math.pow(difX,2)+Math.pow(difY,2)));




if(dist!=0&&dist<=(allParticles[a].radius+allParticles[b].radius)){


var aSpeed = Math.sqrt(Math.pow(allParticles[a].xSpeed,2)+Math.pow(allParticles[a].ySpeed,2));
var bSpeed = Math.sqrt(Math.pow(allParticles[b].xSpeed,2)+Math.pow(allParticles[b].ySpeed,2));

while(bSpeed<=aSpeed&&dist2<(allParticles[a].radius+allParticles[b].radius)){
	difX2 = (allParticles[a].newX-allParticles[b].x);
	difY2 = (allParticles[a].newY-allParticles[b].y);
	dist2 =Math.sqrt((Math.pow(difX2,2)+Math.pow(difY2,2)));
	allParticles[a].newX=allParticles[a].newX-allParticles[a].xSpeed/10;
	allParticles[a].newY=allParticles[a].newY-allParticles[a].ySpeed/10;
}


 aAngle = Math.atan2(allParticles[a].ySpeed,allParticles[a].xSpeed);

 bAngle = Math.atan2(allParticles[b].ySpeed,allParticles[b].xSpeed);

 caAngle = Math.atan2(difY,difX);
caAngle += Math.PI/2;
 
allParticles[a].newYSpeed=(((allParticles[a].ySpeed*(allParticles[a].mass-allParticles[b].mass))+(2*allParticles[b].mass*allParticles[b].ySpeed))/(allParticles[a].mass+allParticles[b].mass));

allParticles[a].newXSpeed=(((allParticles[a].xSpeed*(allParticles[a].mass-allParticles[b].mass))+(2*allParticles[b].mass*allParticles[b].xSpeed))/(allParticles[a].mass+allParticles[b].mass));



}
}
}

for (var a = 0; a < allParticles.length; a++) {
	allParticles[a].x=allParticles[a].newX;
	allParticles[a].y=allParticles[a].newY;
	allParticles[a].xSpeed=allParticles[a].newXSpeed;
	allParticles[a].ySpeed=allParticles[a].newYSpeed;
}

for (var x = 0; x < allParticles.length; x++) {
allParticles[x].x+=allParticles[x].xSpeed;
allParticles[x].y+=allParticles[x].ySpeed;
if (allParticles[x].x >= canvas.width-(allParticles[x].radius/2)) {
         	allParticles[x].xSpeed=-Math.abs(allParticles[x].xSpeed);
         }
if(allParticles[x].x <= (allParticles[x].radius)){
		allParticles[x].xSpeed=Math.abs(allParticles[x].xSpeed);
	}
         if (allParticles[x].y >= canvas.height-(allParticles[x].radius/2)) {
         allParticles[x].ySpeed = -Math.abs(allParticles[x].ySpeed);
}
if(allParticles[x].y <= (allParticles[x].radius)){
	allParticles[x].ySpeed = Math.abs(allParticles[x].ySpeed);
}
}
}

function drawParticles() {
    ctx.fillStyle = "rgba(255,255,255,.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < allParticles.length; i++) {
        particle = allParticles[i];
        ctx.beginPath();
        var colorString = 'rgb(0,0,255)';
	ctx.strokeStyle = colorString;
        ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * PI);
        ctx.fill();
        ctx.stroke();
	if(vectors){
		ctx.beginPath();-
		ctx.moveTo(particle.x,particle.y);
		ctx.lineTo((particle.x+(particle.xSpeed*particle.radius*particle.radius/3)),(particle.y+(particle.ySpeed*particle.radius*particle.radius/3)));
		ctx.fill();
		ctx.stroke();
	}
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
initializeParticles();

$("#controls-submit").click(function() {
Num = $("#numparticles").val();
vectors = $("#vect").is(":checked");
allParticles = [];
initializeParticles();
});

function main() {
moveParticles();
drawParticles();
requestAnimationFrame(main);
};
requestAnimationFrame(main);*/
