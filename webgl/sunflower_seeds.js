/* Global */
var camera, scene, renderer;
var keyState = {};
var particleCount = 5000;
var particles = [];

function setRenderer() {

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}


function setCamera() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
	
	camera.position.x = 700;
	camera.position.y = 700;
	camera.position.z = 700;
}


function setControls() {

	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;
}


function setScene() {

	scene = new THREE.Scene();
}

// zuckenforf rappresetation of n
function remove( element, index, array ){
	return element <= this;
}

function get_fibonacci_sequence_less_than( n ){
	var fib = [0, 1];
    
	while(fib[fib.length - 1] < n){
		fib.push( fib[fib.length - 1] + fib[fib.length - 2] );
	}
    
	return fib.filter( remove, n );
}

function get_zeckendorf_of(n){
	var fib = get_fibonacci_sequence_less_than(n);
	var sol = [];
	var i = 0;
	var sum = n;

	while( true ){
		n = n - fib[fib.length - 1];
		sol.push( fib[fib.length - 1] );
		
		fib = fib.filter(remove, n);       

		if(sol.reduce(function(a,b){return a+b}) == sum)
			break;
	}
	return sol;
}


function setWorld() {
	var zeckendorf;
    var len_of_zeck;
    var color;

	pGeometry = new THREE.Geometry();
	pMaterial = new THREE.PointsMaterial({
		size:15,
		map: THREE.ImageUtils.loadTexture( "images/disc.png" ),
		sizeAttenuation : true,
		vertexColors : true,
		alphaTest : 0.5,
	});

	//creo le particelle
	for( var p = 0; p < particleCount; p++ ){

		zeckendorf = get_zeckendorf_of( p+1 );
		
		switch( zeckendorf.length ){
		    case 1:
		    	color = new THREE.Color(0xffff80);
		    	break;
		    case 2:
			    color = new THREE.Color(0xdd944a);
			    break;
		    case 3:
			    color = new THREE.Color(0xc1552b);
			    break;
		    case 4:
			    color = new THREE.Color(0xa93119);
			    break;
		    case 5:
			    color = new THREE.Color(0x951d0e);
			    break;
		    default:
		    	color = new THREE.Color(0x951d0e);   
		}    

		//aggiungo alla geometria e inizializzo
		particles[p] = {
			position:new THREE.Vector3( 0 ),
			color:color,
		};

		pGeometry.vertices.push( particles[p].position );
		pGeometry.colors.push( particles[p].color );
	}

	var particleSystem = new THREE.Points( pGeometry, pMaterial );
	scene.add( particleSystem );
}


function setCameraHelper() {
	
	var helperCamera = new THREE.CameraHelper( camera );
	scene.add( helperCamera );
}


function setDrawHelpers( size ) {

	var axisHelper = new THREE.AxisHelper( size );
	scene.add( axisHelper );
}	

// define the temporal step
	var distance = 100;
	var molt = 2.0;
   	var step =- 0.0000000001;
	//var step = 0;

function animate() {

	requestAnimationFrame( animate );
	
	var pCount = particleCount;
		while (pCount--) {

			molt+=step;
			var particle = particles[pCount];
			var r  = Math.sqrt(pCount*distance);
			var angle = molt * Math.PI * ((Math.sqrt(5) + 1) / 2) * pCount;

			/* Aggiorno la posizione */
			particle.position.x=r * Math.cos(angle);
			particle.position.z=r * Math.sin(angle);
			
			pGeometry.vertices[pCount].x = particle.position.x;
			pGeometry.vertices[pCount].y = particle.position.y;
			pGeometry.vertices[pCount].z = particle.position.z;
			pGeometry.verticesNeedUpdate=true;
		}


	renderer.render( scene, camera );
}


function setEventListenerHandler(){
	
	window.addEventListener('keydown',function(e){
	    keyState[e.keyCode || e.which] = true;
	},true); 

	window.addEventListener('keyup',function(e){
	    keyState[e.keyCode || e.which] = false;
	},true);
	
	window.addEventListener( 'resize', onWindowResize, false );
}


function setKeyboardControls() {
    
    if( keyState[87] ){ // W
    	
    }

    if( keyState[83] ){ // S
        
    }

    if( keyState[65] ){ // A
    	
    }

    if( keyState[68] ){ // D
    	
    }

    setTimeout( setKeyboardControls, 10 );
}    

function setLights(){

	var light = new THREE.AmbientLight( 0xffffff );
	scene.add( light );

	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 0.5, 0.5, 0.5 );

	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = window.innerWidth;
	spotLight.shadow.mapSize.height = window.innerHeight;

	scene.add( spotLight );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function main() {

	setRenderer();
	setCamera();
	setControls();
	setEventListenerHandler();
	setKeyboardControls();
	setScene();
	setLights();
	//setCameraHelper()
	setDrawHelpers( 5 )
	setWorld();
	animate();
}
