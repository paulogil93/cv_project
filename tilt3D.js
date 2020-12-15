//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_24_GPU_per_vertex.js 
//
//  Phong Illumination Model on the GPU - Per vertex shading - Several light sources
//
//  Reference: E. Angel examples
//
//  J. Madeira - November 2017 + November 2018
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

// Mouse variables

var drag = false;
var old_x = 0, old_y = 0;

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexNormalBuffer = null;	

// The global transformation parameters ################################################################################

// The translation vector
var globalTx = 0.0;
var globalTy = 0.0;
var globalTz = 0.0;

// The rotation angles in degrees
var globalAngleXX = 0.0;
var globalAngleYY = 0.0;
var globalAngleZZ = 0.0;

// The scaling factors
var globalSx = 0.117;
var globalSy = 0.117;
var globalSz = 0.117;

// Animation controls
var globalRotationXX_ON = 0;
var globalRotationXX_DIR = 0;
var globalRotationXX_SPEED = 1;

var globalRotationYY_ON = 0;
var globalRotationYY_DIR = 0;
var globalRotationYY_SPEED = 1;
 
var globalRotationZZ_ON = 0;
var globalRotationZZ_DIR = 1;
var globalRotationZZ_SPEED = 1;

var primitiveType = null;		// To allow choosing the way of drawing the model triangles

var projectionType = 0;			// To allow choosing the projection type

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();;


function countFrames() {
	
   var now = new Date().getTime();

   frameCount++;
   
   elapsedTime += (now - lastfpsTime);

   lastfpsTime = now;

   if(elapsedTime >= 1000) {
	   
       fps = frameCount;
       
       frameCount = 0;
       
       elapsedTime -= 1000;
	   
	   document.getElementById('fps').innerHTML = 'fps:' + fps;
   }
}



//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers( model ) {	
	
	var colors = sceneModels.colors;
	// Vertex Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			triangleVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	

	// Colors
	var base_color_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, base_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
					 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers(model);
	
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		globalTz = -2.5;

		// NEW --- The viewer is on (0,0,0)
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTz = 0.0;
		
		// NEW --- The viewer is on the ZZ axis at an indefinite distance
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( 0, 0, globalTz );

	mvMatrix = mult( mvMatrix,
	                  rotationZZMatrix( globalAngleZZ ));

	mvMatrix = mult(mvMatrix, rotationYYMatrix( globalAngleYY ));
	mvMatrix = mult(mvMatrix, rotationXXMatrix( globalAngleXX ));
	
	// NEW - Updating the position of the light sources, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}
	           
	// NEW - Counting the frames
	
	countFrames();
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
		}
		
		if( globalRotationXX_ON) {
			globalAngleXX += globalRotationXX_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
		}
		

		// For every model --- Local rotations
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {

				sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotYYOn ) {

				sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
			}
		}
		
		// Rotating the light sources
	
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {

				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleYY( angle );
			}
		}
}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
    
}

//----------------------------------------------------------------------------

function setEventListeners(){
	
    // Dropdown list
	
	var projection = document.getElementById("projection-selection");
	
	projection.addEventListener("click", function(){
				
	// Getting the selection
		
		var p = projection.selectedIndex;
					
		switch(p){
				
			case 0 : projectionType = 0;
				break;
				
			case 1 : projectionType = 1;
				break;
		}  	
	});      

	// Dropdown list
	
	var list = document.getElementById("rendering-mode-selection");
	
	list.addEventListener("click", function(){
				
		// Getting the selection
			
		var mode = list.selectedIndex;
					
		switch(mode){
				
			case 0 : primitiveType = gl.TRIANGLES;
					break;
				
			case 1 : primitiveType = gl.LINE_LOOP;
					break;
				
			case 2 : primitiveType = gl.POINTS;
					break;
		}
	});      

	// // Button events
	
	// document.getElementById("XX-on-off-button").onclick = function(){
		
	// 	// Switching on / off
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		if( sceneModels[i].rotXXOn ) {

	// 			sceneModels[i].rotXXOn = false;
	// 		}
	// 		else {
	// 			sceneModels[i].rotXXOn = true;
	// 		}	
	// 	}
	// };

	// document.getElementById("XX-direction-button").onclick = function(){
		
	// 	// Switching the direction
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		if( sceneModels[i].rotXXDir == 1 ) {

	// 			sceneModels[i].rotXXDir = -1;
	// 		}
	// 		else {
	// 			sceneModels[i].rotXXDir = 1;
	// 		}	
	// 	}
	// };      

	// document.getElementById("XX-slower-button").onclick = function(){
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		sceneModels[i].rotXXSpeed *= 0.75; 
	// 	}
	// };      

	// document.getElementById("XX-faster-button").onclick = function(){
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		sceneModels[i].rotXXSpeed *= 1.25; 
	// 	}
	// };      

	// document.getElementById("YY-on-off-button").onclick = function(){
		
	// 	// Switching on / off
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		if( sceneModels[i].rotYYOn ) {

	// 			sceneModels[i].rotYYOn = false;
	// 		}
	// 		else {
	// 			sceneModels[i].rotYYOn = true;
	// 		}	
	// 	}
	// };

	// document.getElementById("YY-direction-button").onclick = function(){
		
	// 	// Switching the direction
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		if( sceneModels[i].rotYYDir == 1 ) {

	// 			sceneModels[i].rotYYDir = -1;
	// 		}
	// 		else {
	// 			sceneModels[i].rotYYDir = 1;
	// 		}	
	// 	}
	// };      

	// document.getElementById("YY-slower-button").onclick = function(){

	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		sceneModels[i].rotYYSpeed *= 0.75; 
	// 	}
	// };      

	// document.getElementById("YY-faster-button").onclick = function(){
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		sceneModels[i].rotYYSpeed *= 1.25; 
	// 	}
	// };      

	// document.getElementById("ZZ-on-off-button").onclick = function(){
		
	// 	// Switching on / off
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		if( sceneModels[i].rotZZOn ) {

	// 			sceneModels[i].rotZZOn = false;
	// 		}
	// 		else {
	// 			sceneModels[i].rotZZOn = true;
	// 		}	
	// 	}
	// };

	// document.getElementById("ZZ-direction-button").onclick = function(){
		
	// 	// Switching the direction
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		if( sceneModels[i].rotZZDir == 1 ) {

	// 			sceneModels[i].rotZZDir = -1;
	// 		}
	// 		else {
	// 			sceneModels[i].rotZZDir = 1;
	// 		}	
	// 	}
	// };      

	// document.getElementById("ZZ-slower-button").onclick = function(){
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		sceneModels[i].rotZZSpeed *= 0.75; 
	// 	}
	// };      

	// document.getElementById("ZZ-faster-button").onclick = function(){
		
	// 	// For every model
		
	// 	for(var i = 0; i < sceneModels.length; i++ )
	//     {
	// 		sceneModels[i].rotZZSpeed *= 1.25; 
	// 	}
	// }; 

	// ----------------------------------------------------------------------
	// Mouse movements
	//
	var mouseDown = function(e)
	{
		drag = true;
		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault();
		return false;
	}

	var mouseUp = function(e)
	{
		drag = false;
		
		globalRotationXX_ON = 0;
		globalRotationYY_ON = 0;
	}

	/*
	var mouseMove = function(e)
	{
		if(!drag) return false;
		var factor = 100 / document.getElementById("game-canvas").height;
		var dY = factor * (e.pageX - old_x);
		var dX = factor * (e.pageY - old_y);

		sceneModels[0].rotAngleXX += dX;
		sceneModels[1].rotAngleXX += dX;
		sceneModels[0].rotAngleYY += dY;
		sceneModels[1].rotAngleYY += dY;

		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault()
	}
	*/

	var mouseMove = function(e)
	{
		//var sphere = sceneModels[1];
		//var base = sceneModels[0];

		//var walls = [sceneModels[2],sceneModels[3],sceneModels[4],sceneModels[5],sceneModels[6],sceneModels[7],sceneModels[8]]

		if(!drag) return false;
		var factor = 100 / document.getElementById("game-canvas").height;
		var dY = factor * (e.pageX - old_x);
		var dX = factor * (e.pageY - old_y);

		if(dY != 0)
		{
			globalRotationYY_DIR = dY;
			globalRotationYY_ON = 1;
		}

		if(dX != 0)
		{
			globalRotationXX_DIR = dX;
			globalRotationXX_ON = 1;
		}		

		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault()
	}

	document.getElementById("game-canvas").addEventListener("mousedown", mouseDown, false);
	document.getElementById("game-canvas").addEventListener("mouseup", mouseUp, false);
	document.getElementById("game-canvas").addEventListener("mouseout", mouseUp, false);
	document.getElementById("game-canvas").addEventListener("mousemove", mouseMove, false);

	var released = true;
	var last_key = '';
	document.onkeypress = function(e)
	{
		if(!released) return false;
		const value = 10;
		last_key = e.key;
		switch(e.key)
		{
			case 'w':
				sceneModels[0].rotAngleXX -= value;
				sceneModels[1].rotAngleXX -= value;
				last_key = e.key;
				break;
			case 's':
				sceneModels[0].rotAngleXX += value;
				sceneModels[1].rotAngleXX += value;
				last_key = e.key;
				break;
			case 'a':
				sceneModels[0].rotAngleZZ += value;
				sceneModels[1].rotAngleZZ += value;
				last_key = e.key;
				break;
			case 'd':
				sceneModels[0].rotAngleZZ -= value;
				sceneModels[1].rotAngleZZ -= value;
				last_key = e.key;
				break;
			default:
				
		}

		released = false;
	}

	document.onkeyup = function(e) 
	{
		if(e.key != last_key) return false;

		const value = 10;

		switch(last_key)
		{
			case 'w':
				sceneModels[0].rotAngleXX += value;
				sceneModels[1].rotAngleXX += value;
				break;
			case 's':
				sceneModels[0].rotAngleXX -= value;
				sceneModels[1].rotAngleXX -= value;
				break;
			case 'a':
				sceneModels[0].rotAngleZZ -= value;
				sceneModels[1].rotAngleZZ -= value;
				break;
			case 'd':
				sceneModels[0].rotAngleZZ += value;
				sceneModels[1].rotAngleZZ += value;
				break;
			default:
				
		}
		released = true;
		
	}     
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
		
		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("game-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}

