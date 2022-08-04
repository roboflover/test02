var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
camera.position.set(0, 0, 40);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
var canvas = renderer.domElement
document.body.appendChild(canvas);

var controls = new THREE.OrbitControls(camera, canvas);

function CustomSinCurve( scale ) {

	THREE.Curve.call( this );

	this.scale = ( scale === undefined ) ? 1 : scale;

}

CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function ( t ) {

	var tx = t * 3 - 1.5;
	var ty = Math.sin( 2 * Math.PI * t ) * 0.5;
	var tz = 0;

	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

};

var tubularSegments = 200;
var path = new CustomSinCurve( 10 );
var geometry = new THREE.TubeBufferGeometry( 1.0, tubularSegments, 2, 32, false );
var material = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide } );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

var normal = new THREE.Vector3();
var vertex = new THREE.Vector3();
var P = new THREE.Vector3();
var normals = [];
var vertices = [];

for ( i = 0; i <= tubularSegments; i ++ ) {

			generateSegment( i );

}

function generateSegment( i ) {

		// we use getPointAt to sample evenly distributed points from the given path
    var pointAt = i / tubularSegments;
		P = path.getPointAt( pointAt, P );
    console.log(pointAt);

		// retrieve corresponding normal and binormal

		var N = geometry.normals[ i ];
		var B = geometry.binormals[ i ];

		// generate normals and vertices for the current segment

		for ( j = 0; j <= geometry.parameters.radialSegments; j ++ ) {

			var v = j / geometry.parameters.radialSegments * Math.PI * 2;

			var sin = Math.sin( v );
			var cos = - Math.cos( v );

			// normal

			normal.x = ( cos * N.x + sin * B.x );
			normal.y = ( cos * N.y + sin * B.y );
			normal.z = ( cos * N.z + sin * B.z );
			normal.normalize();

			// vertex
      var radius = geometry.parameters.radius;
      
      radius += Math.abs(Math.sin(v * 2.5)); // radial half-waves
      radius += Math.sin(pointAt * Math.PI * 4); // wave along the path
      normal.applyAxisAngle(geometry.tangents[ i ], pointAt * Math.PI * 2); // twisting
			
      vertex.x = P.x + radius * normal.x;
	    vertex.y = P.y + radius * normal.y;
	    vertex.z = P.z + radius * normal.z;
      
      

			vertices.push( vertex.x, vertex.y, vertex.z );

		}

}

console.log(geometry.tangents);

geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
geometry.computeVertexNormals();



render();

function render() {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
