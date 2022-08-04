let camera, scene, renderer, controls, stats
let shroom_height, stipe_vSegments, stipe_rSegments, stipe_points, stipe_indices, stipe_shape, stipe_shape2
let circleValues
const mouse = new THREE.Vector2()
let INTERSECTED
let theta = 0
let meshOk = false
let group2 = new THREE.Object3D()
let cloneGroup
let countMemory


const uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v4", value: new THREE.Vector4() },
  }

function init() {
  scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 )	
  camera.position.x = 0
  camera.position.y = 300
  camera.position.z = 300
  renderer = new THREE.WebGLRenderer( { antialias: true } )
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )
	document.body.appendChild( renderer.domElement )
  controls = new THREE.OrbitControls( camera, renderer.domElement )
  const axesHelper = new THREE.AxesHelper( 10 )
  stats = new Stats()
	document.body.appendChild( stats.dom )
  document.addEventListener( 'mousemove', onDocumentMouseMove )
  scene.add( axesHelper )
}

init()

function onDocumentMouseMove( event ) {

  event.preventDefault()
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

}

const count = 50;
const scale = 5;
const objects = [];
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const geometry = new THREE.SphereGeometry( 70, 32, 16 );

const materialS = new THREE.RawShaderMaterial( {

  uniforms: {
    'time': { value: 1.0 },
    'sineTime': { value: 1.0 }
  },
  vertexShader: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
  side: THREE.DoubleSide,
  transparent: true

} );


for ( let i = 0, l = 12; i < l; i ++ ) {

  addMesh( geometry, material );

}


function addMesh( geometry, material ) {

  const mesh = new THREE.Mesh( geometry, material );
  mesh.color = new THREE.Color( Math.random() * 0xffffff );
  mesh.position.x = ( objects.length % 4 ) * 200 - 200;
  mesh.position.z = Math.floor( objects.length / 4 ) * 200 - 200;
  objects.push( mesh );
  scene.add( mesh );

}

animate(0)
function animate(dt) {
  requestAnimationFrame( animate )
  dt = dt * 0.001
  stats.update()
	renderer.render( scene, camera )
}
