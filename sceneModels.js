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
		
		1.00,  0.05,  1.00,

		
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
		
		// FRONT WALL


		// BACK WALL

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

sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.60;

// Model 1 --- Sphere

sceneModels.push( new sphereModel( 3 ) );

sceneModels[1].tx = 0.5; sceneModels[1].ty = 0.09; 

sceneModels[1].sx = 0.06; sceneModels[1].sy = 0.06; sceneModels[1].sz = 0.06;

// Model 1 --- Left wall
/*
sceneModels.push( new simpleCubeModel() );

sceneModels[1].tx = -0.6; sceneModels[1].ty = 0.09;

sceneModels[1].sx = 0.006; sceneModels[1].sy = 0.06; sceneModels[1].sz = 0.6;

// Model 2 --- Right wall

sceneModels.push( new simpleCubeModel() );

sceneModels[2].tx = 0.6; sceneModels[2].ty = 0.09;

sceneModels[2].sx = 0.006; sceneModels[2].sy = 0.06; sceneModels[2].sz = 0.6;

// Model 3 --- Back wall

sceneModels.push( new simpleCubeModel() );

sceneModels[3].ty = 0.09;

sceneModels[3].sx = 0.61; sceneModels[3].sy = 0.06; sceneModels[3].sz = 0.006;
*/


