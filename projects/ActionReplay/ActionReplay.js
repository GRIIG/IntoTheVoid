if (!Detector.webgl) { Detector.addGetWebGLMessage() }

        
// THREEJS VARIABLES
var content =  document.getElementById('content');
var camera, scene, raycaster, renderer;

var bgColor = 0x000000;
var memorycardMesh, sphereMesh, textMesh;
var staticMeshes;


// MATERIAL VARIABLES
var materials = {};
var textures = {};

// OTHER VARIABLES
var mouse;
var mouseX = 0, mouseY = 0;

var menuHeight = document.getElementById("menu").clientHeight;

var canvasHeight = window.innerHeight - menuHeight;
var canvasWidth = window.innerWidth;
var windowHalfX = canvasWidth / 2;
var windowHalfY = canvasHeight / 2;

var modal = document.getElementById('downloadModal');
var span = document.getElementsByClassName("close")[0];

span.addEventListener("click", close);
// modal.addEventListener("click",close);

var backgroundIndex = 0;
var slideIndex = 1;
showSlides(slideIndex);

init();
mat();
static();
animate();


// INITIALISATION THREEJS - LOAD TOOLS AND SCENE
function init() {


    //  SCENE //
    scene = new THREE.Scene();
    scene.background = new THREE.Color ( bgColor );

    // CAMERA //
    camera = new THREE.PerspectiveCamera(70, canvasWidth / canvasHeight, 0.1, 30000);
    camera.position.set(0, -400, 1200);             

    //  LIGHT //

    // AMBIENT
    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );


    // HEMI
//            var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
//            hemiLight.groundColor.setHSL( 0.1, 0, 0.5 );
//            hemiLight.position.set( 0, 200, 0 );
//            scene.add( hemiLight );
//            
//            hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
//            scene.add( hemiLightHelper );

    //POINT LIGHT
//            var pointLight = new THREE.PointLight( 0xffffff, 1, 5000 );
//            pointLight.position.set (0,-50,0);
////            light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
//            scene.add( pointLight );

    //DIRECTIONAL
    var directionalLight = new THREE.DirectionalLight (0xffffff, 0.5);
    directionalLight.position.set ( -500, 600, 1000 );
    scene.add(directionalLight);
//            

//            // SPOT
//            var spotLight = new THREE.SpotLight( 0xffffff, 100000 );
//            spotLight.position.set( 0, 1000, 0 );
//            spotLight.angle = Math.PI / 4;
//            spotLight.penumbra = 0.05;
//            spotLight.decay = 2;
//            spotLight.distance = 200;            


    //RAYCASTER
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 100 ;
    mouse = new THREE.Vector2();


    //RENDERER 

    renderer = new THREE.WebGLRenderer( {antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasHeight);
//            document.getElementById("ActionReplayCanvas").appendChild(renderer.domElement);
    content.appendChild(renderer.domElement);


    //EVENT LISTENERS 
    content.addEventListener('mousemove', onDocumentMouseMove, false);
    content.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);

    // POSTPROCESSING
    initPostprocessing();

}

//materials function - create materials library
function mat(){

    // TEXTURES

    var textureLoader = new THREE.TextureLoader();

    textures = {

        "hall1": textureLoader.load ( "/projects/ActionReplay/img/360/360_hall1.jpg"),

        "hall2": textureLoader.load ( "/projects/ActionReplay/img/360/360_hall2.jpg"),

        "hall3": textureLoader.load ( "/projects/ActionReplay/img/360/360_hall3.jpg"),

        "hall4": textureLoader.load ( "/projects/ActionReplay/img/360/360_hall4.jpg"),

        "controller1": textureLoader.load ( "/projects/ActionReplay/img/360/360_controller1.jpg"),

        "aku1": textureLoader.load ( "/projects/ActionReplay/img/360/360_aku1.jpg"),

        "aku2": textureLoader.load ( "/projects/ActionReplay/img/360/360_aku2.jpg"),

        "xen1": textureLoader.load ( "/projects/ActionReplay/img/360/360_xen1.jpg"),

        "xen2": textureLoader.load ( "/projects/ActionReplay/img/360/360_xen2.jpg"),

        "xen3": textureLoader.load ( "/projects/ActionReplay/img/360/360_xen3.jpg")

    }

    for (var key in textures) {
            textures[key].mapping = THREE.EquirectangularRefractionMapping;
            textures[key].magFilter = THREE.LinearFilter;
            textures[key].minFilter = THREE.LinearMipMapLinearFilter;
    }


    //MATERIALS

    materials = {

        "Emissive 1":       new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0xffffff } ),


        "360": new THREE.MeshBasicMaterial( {
            map: textures["hall1"]
        }),

        "memorycard": new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: textures["hall1"], refractionRatio: 1})

    }

}



// static function - add geometry to scene
function static(){

    staticMeshes = new THREE.Group();


    // --- ADD CUBEMAP SPHERE ---
    var sphere = new THREE.SphereBufferGeometry (5000,60,40);
    sphere.scale (1, 1, -1);
    sphereMesh = new THREE.Mesh(sphere, materials["360"]);
    staticMeshes.add (sphereMesh);


    //--- ADD TEST SPHERE ---
//            var sphere2 = new THREE.SphereBufferGeometry (300,60,40);
//            sphere2.scale (1, 1, 1);
////            sphere.rotation.set(0,0,0);
//            var sphereMesh2 = new THREE.Mesh(sphere2, materials["memorycard"]);
//            staticMeshes.add (sphereMesh2);

    // --- ADD MEMORYCARD ---

    var loader = new THREE.OBJLoader ();
    loader.load ( 
        // Resource URL
        "/projects/ActionReplay/obj/memorycard.obj", 
        //Function when resource is loaded
        function (loadedObject) {

            var geometry = loadedObject.children[0].geometry;
            geometry.center();
            geometry.scale (1,1,1);

            memorycardMesh = new THREE.Mesh(geometry, materials [ "memorycard" ]);

            memorycardMesh.scale.multiplyScalar (0.8);
            memorycardMesh.rotation.set(-0.8,-0.7854,0.4);
            memorycardMesh.position.set(0,50,0);
            staticMeshes.add (memorycardMesh);
    }); 

    // end add memorycard //



    // ---- ADD TEXT  ----
    loader.load ( 
        // Resource URL
        "/projects/ActionReplay/obj/actionreplayOutline.obj", 
//                "./obj/actionreplaySrf.obj", 
        //Function when resource is loaded
        function (group) {

            var geometry = group.children[0].geometry;
            geometry.center();

            textMesh = new THREE.Mesh(geometry, materials [ "White" ]);
            textMesh = new THREE.Mesh(geometry, materials [ "Emissive 1" ]);
            textMesh.scale.multiplyScalar(150);
            textMesh.rotation.set(1.5708,0,0);
            textMesh.position.set(0,-300, 0);
            staticMeshes.add (textMesh);               

    }); //end add text


    // ADD ALL MESHES TO SCENE
    scene.add( staticMeshes );

}



// Postprocessing initialization function
function initPostprocessing() {            


}


//animation function - animate the scene
function animate() {

    requestAnimationFrame( animate );

    //Camera animation
    camera.position.x += ( mouseX - camera.position.x ) * .05; //0.05 is mouvement amplitude
    camera.position.y += ( - mouseY - camera.position.y ) * .05; //0.05 is mouvement amplitude
    camera.lookAt (scene.position);

    // Geometry animation
    memorycardMesh.rotation.x += 0.005;
//            sphereMesh.rotation.z += 0.005;

    render();
}

//rendering function
function render() {

    renderer.clear();
    renderer.setFaceCulling( THREE.CullFaceNone );
    renderer.render( scene, camera );

}



// window resize function
function onWindowResize() {

    canvasHeight = window.innerHeight - menuHeight;
    canvasWidth = window.innerWidth;
    windowHalfX = canvasWidth / 2;
    windowHalfY = canvasHeight / 2;

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    renderer.setSize (canvasWidth, canvasHeight);            


}    


//Mouse movement input function
function onDocumentMouseMove(event) {

    // Set camera amplitude
    mouseX = (event.clientX - windowHalfX)*2;
    mouseY = (event.clientY - windowHalfY)*2;


    // Change mouse cursor when hover
    mouse.x = ( event.clientX / canvasWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY - menuHeight)/ canvasHeight ) * 2 + 1;

    // Find raycaster interactions
    raycaster.setFromCamera ( mouse, camera );
    var intersects = raycaster.intersectObjects ([textMesh, memorycardMesh]);

    if ( intersects.length > 0 ) {
        $('html,body').css('cursor', 'pointer');
    } else {
        $('html,body').css('cursor', 'default');
    }

}

// Mouse click input function - when user clicks on download, open the popup
function onDocumentMouseDown(event) {

    event.preventDefault();

    mouse.x = ( event.clientX / canvasWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY - menuHeight)/ canvasHeight ) * 2 + 1;

    // Find raycaster intersections
    raycaster.setFromCamera ( mouse, camera );
    var intersectCanvas = raycaster.intersectObject( sphereMesh );
    // STAN - changer fond que quand souris dans canvas??

    if ( intersectCanvas.length > 0) {

        var intersects = raycaster.intersectObjects ([textMesh, memorycardMesh]);

        if ( intersects.length > 0 ) {

            //Action on click 
            modal.style.display = "block";

        } else {
//STAN : rajouter condition pour si click dans canvas

            if (backgroundIndex < Object.keys(textures).length-1) {

                backgroundIndex++;
                var key = Object.keys(textures)[backgroundIndex];
                materials["360"].map = textures[key];
                materials["memorycard"].envMap = textures[key];
                materials["360"].needsUpdate = true;
                materials["memorycard"].needsUpdate = true;

            } else {

                backgroundIndex=0;
                var key = Object.keys(textures)[backgroundIndex];
                materials["360"].map = textures[key];
                materials["memorycard"].envMap = textures[key];
                materials["360"].needsUpdate = true;
                materials["memorycard"].needsUpdate = true;
            }


        }   
    }

}

//When the user clicks on close (x), close the modal
function close() {
    modal.style.display = "none";
}

// Slideshow : next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

//Slideshow
function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("imgSlide");
    if (n>slides.length) {slideIndex = 1}
    if (n<1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";                
    }
    slides[slideIndex-1].style.display = "block";
}