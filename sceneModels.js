//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//  J. Madeira - November 2018
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	this.textureCoords = [];

	// Transformation parameters

	// Displacement vector

	this.tx = 0.0;

	this.ty = 0.0;

	this.tz = 0;

	// Rotation angles	

	this.rotAngleXX = 0.0;

	this.rotAngleYY = 0.0;

	this.rotAngleZZ = 0.0;

	// Scaling factors

	this.sx = 1.0;

	this.sy = 1.0;

	this.sz = 1.0;

	// Animation controls

	this.rotXXOn = false;

	this.rotYYOn = false;

	this.rotZZOn = false;

	this.rotXXSpeed = 1.0;

	this.rotYYSpeed = 1.0;

	this.rotZZSpeed = 1.0;

	this.rotXXDir = 1;

	this.rotYYDir = 1;

	this.rotZZDir = 1;

	// Material features
	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];
	
	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;

	// Textures Atributes

	this.TextureAlpha = 1;

	this.TextureColor = [1.0, 1.0, 1.0, 1.0];

	this.texture_size = 4;
}

function Plane() {

	var plane = new emptyModelFeatures();

	plane.vertices = [

		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,

		-1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1, 0,
	];

	plane.textureCoords = [
		0.0, 9.0,
		1.0, 9.0,
		1.0, 0.0,

		0.0, 9.0,
		1.0, 0.0,
		0.0, 0.0,

	];

	plane.texture_size = 2;

	computeVertexNormals(plane.vertices, plane.normals);

	return plane;
}

function simpleCubeModel() {

	var cube = new emptyModelFeatures();

	cube.vertices = [
		-1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		-1.000000, 1.000000, 1.000000,

		-1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		///////////////// done
		1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,

		1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, 1.000000, 1.000000,
		///////////////////////////// done
		-1.000000, -1.000000, -1.000000,
		-1.000000, 1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,

		-1.000000, -1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, -1.000000, -1.000000,
		///////////////////////////////////// done
		-1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		-1.000000, 1.000000, -1.000000,

		-1.000000, -1.000000, 1.000000,
		-1.000000, 1.000000, 1.000000,
		-1.000000, 1.000000, -1.000000,
		/////////////////////////////// done
		-1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,

		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		////////////////////////////////done
		-1.000000, -1.000000, 1.000000,
		-1.000000, -1.000000, -1.000000,
		1.000000, -1.000000, -1.000000,

		-1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, -1.000000,
		1.000000, -1.000000, 1.000000,
	];

	cube.textureCoords = [
		1.0, 0.0,
		0.0, 1.0,
		0.0, 0.0,
		//
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		//////// done
		1.0, 0.0,
		1.0, 2.0,
		0.0, 2.0,
		//
		1.0, 0.0,
		0.0, 2.0,
		0.0, 0.0,
		//////// done
		1.0, 0.0,
		0.0, 0.0,
		0.0, 1.0,

		1.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		///////// done
		1.0, 0.0,
		1.0, 2.0,
		0.0, 0.0,

		1.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
		//////// done
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,

		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		////////
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,

		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		///////
	];

	computeVertexNormals(cube.vertices, cube.normals);

	return cube;
}


function cubeModel(subdivisionDepth = 0) {

	var cube = new simpleCubeModel();

	midPointRefinement(cube.vertices, subdivisionDepth);

	computeVertexNormals(cube.vertices, cube.normals);

	return cube;
}

function sphereModel(subdivisionDepth = 4) {

	var sphere = new simpleCubeModel();

	midPointRefinement(sphere.vertices, subdivisionDepth);

	moveToSphericalSurface(sphere.vertices);

	computeVertexNormals(sphere.vertices, sphere.normals);

	sphere.textureCoords = new Array(sphere.vertices.length * 3).fill(0);

	return sphere;
}

function Star2D(subdivisionDepth = 0) {
	var cylinder = new emptyModelFeatures();

	cylinder.vertices = [
-1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,

		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		
	];

	cylinder.textureCoords = [
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,

		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
	];

	computeVertexNormals(cylinder.vertices, cylinder.normals);

	return cylinder;
}

function cylinderModel(subdivisionDepth = 0) {

	var cylinder = new Star2D();

	midPointRefinement(cylinder.vertices, subdivisionDepth);

	computeVertexNormals(cylinder.vertices, cylinder.normals);

	return cylinder;
}

//----------------------------------------------------------------------------
//
//  Instantiating scene models
//
var sceneModels = [];

// Model 0 --- Labirinth base

sceneModels.push(new simpleCubeModel());

sceneModels[0].ty = -0.3;

sceneModels[0].sx = 0.6; sceneModels[0].sy = 0.03; sceneModels[0].sz = 0.6;

// Model 1 --- Sphere

sceneModels.push( new sphereModel( 3 ) );

sceneModels[1].tx = -0.5; sceneModels[1].ty = -0.21; sceneModels[1].tz = 0.45; 

sceneModels[1].sx = 0.06; sceneModels[1].sy = 0.06; sceneModels[1].sz = 0.06;

// Model 2 --- Game over 

sceneModels.push( new Star2D() );

sceneModels[2].tx = -0.45; sceneModels[2].ty = -0.335; sceneModels[2].tz = -0.425;

sceneModels[2].sx = 0.07; sceneModels[2].sy = 0.07; sceneModels[2].sz = 0.07;

sceneModels[2].rotAngleYY = 45;

// Model 3 --- Game over 

sceneModels.push( new Star2D() );

sceneModels[3].tx = -0.45; sceneModels[3].ty = -0.335; sceneModels[3].tz = -0.425;

sceneModels[3].sx = 0.07; sceneModels[3].sy = 0.07; sceneModels[3].sz = 0.07;

// Model 4 --- Left wall

sceneModels.push( new simpleCubeModel() );

sceneModels[4].tx = -0.6; sceneModels[4].ty = -0.25; sceneModels[4].tz = 0.00;

sceneModels[4].sx = 0.006; sceneModels[4].sy = 0.08; sceneModels[4].sz = 0.6;

// Model 5 --- Right wall

sceneModels.push( new simpleCubeModel() );

sceneModels[5].tx = 0.6; sceneModels[5].ty = -0.25; sceneModels[5].tz = 0.00;

sceneModels[5].sx = 0.006; sceneModels[5].sy = 0.08; sceneModels[5].sz = 0.6;

// Model 6 --- Back wall

sceneModels.push( new simpleCubeModel() );

sceneModels[6].ty = -0.25; sceneModels[6].tz = -0.60;

sceneModels[6].sx = 0.6; sceneModels[6].sy = 0.08; sceneModels[6].sz = 0.006;

// Model 7 --- Front wall

sceneModels.push( new simpleCubeModel() );

sceneModels[7].ty = -0.25; sceneModels[7].tz = 0.6;

sceneModels[7].sx = 0.6; sceneModels[7].sy = 0.08; sceneModels[7].sz = 0.006;

// Model 8 --- Obstacle wall 1

sceneModels.push( new simpleCubeModel() );

sceneModels[8].tx = -0.15; sceneModels[8].ty = -0.25; sceneModels[8].tz = -0.25;

sceneModels[8].sx = 0.45; sceneModels[8].sy = 0.08; sceneModels[8].sz = 0.006;

// Model 9 --- Obstacle wall 2

sceneModels.push( new simpleCubeModel() );

sceneModels[9].tx = 0.15; sceneModels[9].ty = -0.25; sceneModels[9].tz = 0.02;

sceneModels[9].sx = 0.45; sceneModels[9].sy = 0.08; sceneModels[9].sz = 0.006;

// Model 10 --- Obstacle wall 3

sceneModels.push( new simpleCubeModel() );

sceneModels[10].tx = -0.15; sceneModels[10].ty = -0.25; sceneModels[10].tz = 0.28;

sceneModels[10].sx = 0.45; sceneModels[10].sy = 0.08; sceneModels[10].sz = 0.006;

