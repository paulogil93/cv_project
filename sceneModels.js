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

	this.colors = [];

	//this.texture_coords = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0.0;	
	
	// Rotation angles	
	
	this.rotAngleXX = 30.0;
	
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

	// NEW --- Point Light Source Features

	// Directional --- Homogeneous coordinate is ZERO

	var pos_Light_Source = [ 0.0, 0.0, 1.0, 0.0 ];

	// White light

	var int_Light_Source = [ 1.0, 1.0, 1.0 ];

	// Low ambient illumination

	var ambient_Illumination = [ 0.3, 0.3, 0.3 ];
	
	// Material features
	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];
	
	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;

	// Textures Atributes
	/*
	this.TextureAlpha = 1;

	this.TextureColor = [1.0,1.0,1.0,1.0];

	this.texture_size = 4;*/
}


function labirinth_base( ) {
	
	var base = new emptyModelFeatures();
	
	base.vertices = [
		// FRONT FACE
		 
		-1.00, -0.05,  1.00,
		1.00, -0.05,  1.00,
		1.00, 0.05,  1.00,
		
		1.00,  0.05,  1.00,
	   -1.00,  0.05,  1.00,
	   -1.00, -0.05,  1.00,
	   
	   // TOP FACE
	   
	   -1.00,  0.05,  1.00,
		1.00,  0.05,  1.00,
		1.00,  0.05, -1.00,
		
		1.00,  0.05, -1.00,
	   -1.00,  0.05, -1.00,
	   -1.00,  0.05,  1.00,
	   
	   // BOTTOM FACE 
	   
	   -1.00, -0.05, -1.00,
		1.00, -0.05, -1.00,
		1.00, -0.05,  1.00,
		
		1.00, -0.05,  1.00,
	   -1.00, -0.05,  1.00,
	   -1.00, -0.05, -1.00,
	   
	   // LEFT FACE 
	   
	   -1.00,  0.05,  1.00,
	   -1.00, -0.05, -1.00,
	   -1.00, -0.05,  1.00,
		
	   -1.00,  0.05,  1.00,
	   -1.00,  0.05, -1.00,
	   -1.00, -0.05, -1.00,
	   
	   // RIGHT FACE 
	   
		1.00,  0.05, -1.00,
		1.00, -0.05,  1.00,
		1.00, -0.05, -1.00,
		
		1.00,  0.05, -1.00,
		1.00,  0.05,  1.00,
		1.00, -0.05,  1.00,
	   
	   // BACK FACE 
	   
	   -1.00,  0.05, -1.00,
		1.00, -0.05, -1.00,
	   -1.00, -0.05, -1.00,
		
	   -1.00,  0.05, -1.00,
		1.00, 0.05, -1.00,
		1.00, -0.05, -1.00, 
	];

	base.colors = [
		// FRONT FACE
			
		1.00,  0.50,  0.50,
		1.00,  0.50,  0.50,
		1.00,  0.50,  0.50,
			
		0.50,  1.00,  0.50,
		0.50,  1.00,  0.50,
		0.50,  1.00,  0.50,
					 
		// TOP FACE
			
		0.50,  0.50,  1.00,
		0.50,  0.50,  1.00,
		0.50,  0.50,  1.00,
			
		0.50,  0.50,  0.50,
		0.50,  0.50,  0.50,
		0.50,  0.50,  0.50,
					 
		// BOTTOM FACE
			
		0.00,  1.00,  0.00,
		0.00,  1.00,  0.00,
		0.00,  1.00,  0.00,
			
		0.00,  1.00,  1.00,
		0.00,  1.00,  1.00,
		0.00,  1.00,  1.00,
					 
		// LEFT FACE
			
		0.00,  0.00,  1.00,
		0.00,  0.00,  1.00,
		0.00,  0.00,  1.00,
			
		1.00,  0.00,  1.00,
		1.00,  0.00,  1.00,
		1.00,  0.00,  1.00,
					 
		// RIGHT FACE
			
		0.25,  0.50,  0.50,
		0.25,  0.50,  0.50,
		0.25,  0.50,  0.50,
			
		0.50,  0.25,  0.00,
		0.50,  0.25,  0.00,
		0.50,  0.25,  0.00,
					 
					 
		// BACK FACE
			
		0.25,  0.00,  0.75,
		0.25,  0.00,  0.75,
		0.25,  0.00,  0.75,
			
		0.50,  0.35,  0.35,
		0.50,  0.35,  0.35,
		0.50,  0.35,  0.35,
	];

	computeVertexNormals( base.vertices, base.normals );

	return base;
}


function baseModel( subdivisionDepth = 0 ) {
	
	var base = new labirinth_base();
	
	midPointRefinement( base.vertices, subdivisionDepth );
	
	computeVertexNormals( base.vertices, base.normals );
	
	return base;
}


function simpleCubeModel( ) {
	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [
		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 

		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 

         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 

         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
		 1.000000,  1.000000, -1.000000, 
		 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 

		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000,

		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 

		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 

		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 

		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000,
	];

	cube.colors = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}

function cubeModel( subdivisionDepth = 0 ) {
	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}

function sphereModel( subdivisionDepth = 2 ) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}

//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// Model 0 --- Labirinth base

sceneModels.push( new labirinth_base() );

sceneModels[0].ty = -0.3;

sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.60;

// Model 1 --- Sphere

sceneModels.push( new sphereModel( 3 ) );

sceneModels[1].tx = -0.5; sceneModels[1].ty = -0.46; sceneModels[1].tz = 0.45; 

sceneModels[1].sx = 0.06; sceneModels[1].sy = 0.06; sceneModels[1].sz = 0.06;

// Model 2 --- Left wall

sceneModels.push( new simpleCubeModel() );

sceneModels[2].tx = -0.6; sceneModels[2].ty = -0.255; sceneModels[2].tz = 0.025;

sceneModels[2].sx = 0.006; sceneModels[2].sy = 0.08; sceneModels[2].sz = 0.6;

// Model 3 --- Right wall

sceneModels.push( new simpleCubeModel() );

sceneModels[3].tx = 0.6; sceneModels[3].ty = -0.255; sceneModels[3].tz = 0.025;

sceneModels[3].sx = 0.006; sceneModels[3].sy = 0.08; sceneModels[3].sz = 0.6;

// Model 4 --- Back wall

sceneModels.push( new simpleCubeModel() );

sceneModels[4].ty = 0.045; sceneModels[4].tz = -0.49;

sceneModels[4].sx = 0.6; sceneModels[4].sy = 0.08; sceneModels[4].sz = 0.006;

// Model 5 --- Front wall

sceneModels.push( new simpleCubeModel() );

sceneModels[5].ty = -0.55; sceneModels[5].tz = 0.54;

sceneModels[5].sx = 0.6; sceneModels[5].sy = 0.08; sceneModels[5].sz = 0.006;

// Model 6 --- Obstacle wall 1

sceneModels.push( new simpleCubeModel() );

sceneModels[6].tx = -0.15; sceneModels[6].ty = -0.095; sceneModels[6].tz = -0.25;

sceneModels[6].sx = 0.45; sceneModels[6].sy = 0.08; sceneModels[6].sz = 0.006;

// Model 7 --- Obstacle wall 2

sceneModels.push( new simpleCubeModel() );

sceneModels[7].tx = 0.15; sceneModels[7].ty = -0.25; sceneModels[7].tz = 0.02;

sceneModels[7].sx = 0.45; sceneModels[7].sy = 0.08; sceneModels[7].sz = 0.006;

// Model 8 --- Obstacle wall 3

sceneModels.push( new simpleCubeModel() );

sceneModels[8].tx = -0.15; sceneModels[8].ty = -0.4; sceneModels[8].tz = 0.28;

sceneModels[8].sx = 0.45; sceneModels[8].sy = 0.08; sceneModels[8].sz = 0.006;
