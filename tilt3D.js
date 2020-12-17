//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;


// Player input
var drag = false;
var old_x = 0, old_y = 0;


// Physics vars
var g = 9.81;
var Vx = 0;
var Vz = 0;
var alphaX = 0;
var alphaZ = 0;

// Buffers

var cubeVertexPositionBuffer = null;

var cubeVertexNormalBuffer = null;

var cubeVertexTextureCoordBuffer = null;

// The global transformation parameters

// The translation vector
var globalTx = 0.0;
var globalTy = 0.0;
var globalTz = 0.0;

// The rotation angles in degrees
var globalAngleXX = 30.0;
var globalAngleYY = 0.0;
var globalAngleZZ = 0.0;

// The scaling factors
var globalSx = 0.117;
var globalSy = 0.117;
var globalSz = 0.117;

// Animation controls
var globalRotationXX_ON = 0;
var globalRotationXX_DIR = 1;
var globalRotationXX_SPEED = 1;

var globalRotationYY_ON = 0;
var globalRotationYY_DIR = 1;
var globalRotationYY_SPEED = 1;

var globalRotationZZ_ON = 0;
var globalRotationZZ_DIR = 1;
var globalRotationZZ_SPEED = 1;

var primitiveType = null;		// To allow choosing the way of drawing the model triangles

var projectionType = 0;			// To allow choosing the projection type

// It has to be updated according to the projection type

var pos_Viewer = [0.0, 0.0, 0.0, 1.0];

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();

function countFrames() {

    var now = new Date().getTime();

    frameCount++;

    elapsedTime += (now - lastfpsTime);

    lastfpsTime = now;

    if (elapsedTime >= 1000) {

        fps = frameCount;

        frameCount = 0;

        elapsedTime -= 1000;

        document.getElementById('fps').innerHTML = 'fps:' + fps;
    }
}

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Textures

// From www.learningwebgl.com

function handleLoadedTexture(texture) {

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


var woodTexture;
var color_texture;

function initTexture() {

    woodTexture = gl.createTexture();
    woodTexture.image = new Image();
    woodTexture.image.onload = function () {
        handleLoadedTexture(woodTexture)
    };

    woodTexture.image.src = "texture/wood.jpg";

    color_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, color_texture);
    var whitePixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);

}

//----------------------------------------------------------------------------

// Handling the Buffers

function initBuffers(model) {

    // Coordinates

    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = model.vertices.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        cubeVertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);


    cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
    cubeVertexNormalBuffer.itemSize = 3;
    cubeVertexNormalBuffer.numItems = model.normals.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
        cubeVertexNormalBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

    // Textures
    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexNormalBuffer.numItems = 24;

    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel(model,
    mvMatrix,
    primitiveType,
    image) {

    // Pay attention to transformation order !!

    mvMatrix = mult(mvMatrix, translationMatrix(model.tx, model.ty, model.tz));

    mvMatrix = mult(mvMatrix, rotationZZMatrix(model.rotAngleZZ));

    mvMatrix = mult(mvMatrix, rotationYYMatrix(model.rotAngleYY));

    mvMatrix = mult(mvMatrix, rotationXXMatrix(model.rotAngleXX));

    mvMatrix = mult(mvMatrix, scalingMatrix(model.sx, model.sy, model.sz));

    // Passing the Model View Matrix to apply the current transformation

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    initBuffers(model);

    // Material properties

    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_ambient"),
        flatten(model.kAmbi));

    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff));

    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec));

    gl.uniform1f(gl.getUniformLocation(shaderProgram, "shininess"),
        model.nPhong);

    // Light Sources

    var numLights = lightSources.length;

    gl.uniform1i(gl.getUniformLocation(shaderProgram, "numLights"),
        numLights);

    //Light Sources

    for (let i = 0; i < lightSources.length; i++) {
        gl.uniform1i(gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].isOn"),
            lightSources[0].isOn);

        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].position"),
            flatten(lightSources[0].getPosition()));

        gl.uniform3fv(gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].intensities"),
            flatten(lightSources[0].getIntensity()));
    }

    //Textures

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, image);

    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // NEW --- Blending
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.uniform1f(shaderProgram.alphaUniform, model.TextureAlpha);
    gl.uniform4fv(shaderProgram.vertexColorUniform, model.TextureColor);

    gl.drawArrays(gl.TRIANGLES, 0, cubeVertexPositionBuffer.numItems);

    // primitiveType allows drawing as filled triangles / wireframe / vertices

    if (primitiveType == gl.LINE_LOOP) {

        // To simulate wireframe drawing!

        // No faces are defined! There are no hidden lines!

        // Taking the vertices 3 by 3 and drawing a LINE_LOOP

        var i;

        for (i = 0; i < cubeVertexPositionBuffer.numItems / 3; i++) {

            gl.drawArrays(primitiveType, 3 * i, 3);
        }
    }
    else {

        gl.drawArrays(primitiveType, 0, cubeVertexPositionBuffer.numItems);

    }
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene


function drawScene() {

    var pMatrix;

    var mvMatrix;

    // Clearing with the background color

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (projectionType == 0) {

        // A standard view volume.

        // Viewer is at (0,0,0)

        // Ensure that the model is "inside" the view volume

        pMatrix = perspective(45, 1, 0.05, 15);

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

        pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);

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

    gl.uniform4fv(gl.getUniformLocation(shaderProgram, "viewerPosition"), flatten(pos_Viewer));

    mvMatrix = translationMatrix(0, 0, globalTz);

    mvMatrix = mult(mvMatrix,
        rotationZZMatrix(globalAngleZZ));

    mvMatrix = mult(mvMatrix, rotationYYMatrix(globalAngleYY));
    mvMatrix = mult(mvMatrix, rotationXXMatrix(globalAngleXX));

    for (var i = 0; i < lightSources.length; i++) {
        // Animating the light source, if defined

        var lightSourceMatrix = mat4();

        if (!lightSources[i].isOff()) {

            // COMPLETE THE CODE FOR THE OTHER ROTATION AXES

            if (lightSources[i].isRotYYOn()) {
                lightSourceMatrix = mult(
                    lightSourceMatrix,
                    rotationYYMatrix(lightSources[i].getRotAngleYY()));
            }
        }

        // NEW Passing the Light Souree Matrix to apply

        var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].lightSourceMatrix");

        gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
    }

    labirinth_colors = [1.0, 1.0, 1.0, 0.8];

    var lab = sceneModels[0];
    lab.TextureColor = labirinth_colors;

    drawModel(lab,
        mvMatrix,
        primitiveType,
        woodTexture);

    var sphere = sceneModels[1];
    sphere.TextureColor = [1.0, 0.0, 0.0, 0.8];
    drawModel(sphere,
        mvMatrix,
        primitiveType,
        color_texture);

    var cube1 = sceneModels[2];
    cube1.TextureColor = [0.0, 0.0, 0.0, 0.8];
    drawModel(cube1,
        mvMatrix,
        primitiveType,
        color_texture);

    var cube2 = sceneModels[3];
    cube2.TextureColor = [0.0, 0.0, 0.0, 0.8];
    drawModel(cube2,
        mvMatrix,
        primitiveType,
        color_texture);


    for (let i = 4; i < sceneModels.length; i++) {
        sceneModels[i].TextureColor = labirinth_colors;
        drawModel(sceneModels[i],
            mvMatrix,
            primitiveType,
            woodTexture);

    }

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

    if (lastTime != 0) {

        var elapsed = timeNow - lastTime;

        // Global rotation

        if (globalRotationYY_ON) {

            globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
        }

        if (globalRotationXX_ON) {
            globalAngleXX += globalRotationXX_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
        }

        // Physics

        if(alphaZ != 0 || Vz != 0)
        {
            // Calculate acceleration
            var aZ = g * Math.sin(radians(alphaZ));
            // Calculate speed by integrating aZ
            Vz += aZ * 90 * elapsed / 15000000;
    
            // X collision with right wall
            if(sceneModels[1].tx >= 0.54) 
            {
                Vz = -0.5 * Vz;
                sceneModels[1].tx -= 0.01;
            }
    
            // X collision with left wall
            if(sceneModels[1].tx <= -0.55) 
            {
                Vz = -0.5 * Vz;
                sceneModels[1].tx += 0.01;
            }
    
            //X collision with 3rd obstacle
            if(sceneModels[1].tz <= 0.35 && sceneModels[1].tz >= 0.19)
            {
                if(sceneModels[1].tx <= 0.35 && sceneModels[1].tx >= 0.34)
                {
                    Vz = -0.5 * Vz;
                    sceneModels[1].tx += 0.01;
                }
            }
    
            //X collision with 2nd obstacle
            if(sceneModels[1].tz <= 0.09 && sceneModels[1].tz >= -0.04)
            {
                if(sceneModels[1].tx >= -0.35 && sceneModels[1].tx <= -0.32)
                {
                    Vz = -0.5 * Vz;
                    sceneModels[1].tx -= 0.01;
                }
            }
    
            //X collision with 1st obstacle
            if(sceneModels[1].tz <= -0.18 && sceneModels[1].tz >= -0.32)
            {
                if(sceneModels[1].tx <= 0.35 && sceneModels[1].tx >= 0.34)
                {
                    Vz = -0.5 * Vz;
                    sceneModels[1].tx += 0.01;
                }
            }
            
            // Calculate position by integrating Vz
            var Sx = Vz * 90 * elapsed / 1000;
            sceneModels[1].tx += Sx;
    
            if(Math.abs(Vz - 0.0001) < 0.0001)
            {
                colision = false;
                Vz = 0; 
            }
            else if(Vz > 0) 
            {
                Vz -= 0.0001;
            }
            else
            {
                Vz += 0.0001;
            }
    
        }
    
        if(alphaX != 0 || Vx != 0)
        {
            // Calculate acceleration
            var aX = g * Math.sin(radians(alphaX));
            // Calculate speed by integrating aX
            Vx += aX * 90 * elapsed / 15000000;
    
            // Z Collision with front wall
            if(sceneModels[1].tz >= 0.55) 
            {
                Vx = -0.5 * Vx;
                sceneModels[1].tz -= 0.01;
            }
    
            // Z collision with back wall
            if(sceneModels[1].tz <= -0.55) 
            {
                Vx = -0.5 * Vx;
                sceneModels[1].tz += 0.01;
            }
    
            // First section of the board
            // Z collision with 3rd obstacle
    
            if(sceneModels[1].tz <= 0.55 && sceneModels[1].tz >= 0.28)
            {
                if(sceneModels[1].tz <= 0.34)
                {
                    if(sceneModels[1].tx <= 0.36)
                    {
                        Vx = -0.5 * Vx;
                        sceneModels[1].tz += 0.01;
                    }
                }
            }
    
            // Second section of the board
            // Z collision with 3rd obstacle
            // Z collision with 2nd obstacle
            if(sceneModels[1].tz <= 0.28 && sceneModels[1].tz >= 0.02)
            {
                if(sceneModels[1].tz >= 0.22)
                {
                    if(sceneModels[1].tx <= 0.36)
                    {
    
                        Vx = -0.5 * Vx;
                        sceneModels[1].tz -= 0.01;
                    }
                }
                if(sceneModels[1].tz <= 0.08)
                {
                    if(sceneModels[1].tx >= -0.35)
                    {
                        Vx = -0.5 * Vx;
                        sceneModels[1].tz += 0.01;
                    }
                }
            }
    
            // Third section of the board
            // Z collision with 2nd obstacle
            // Z collision with 1st obstacle
            if(sceneModels[1].tz <= 0.02 && sceneModels[1].tz >= -0.25)
            {
                if(sceneModels[1].tz >= -0.04)
                {
                    if(sceneModels[1].tx >= -0.35)
                    {
    
                        Vx = -0.5 * Vx;
                        sceneModels[1].tz -= 0.01;
                    }
                }
                if(sceneModels[1].tz <= -0.19)
                {
                    if(sceneModels[1].tx <= 0.36)
                    {
    
                        Vx = -0.5 * Vx;
                        sceneModels[1].tz += 0.01;
                    }
                }
            }
    
            // Fourth section of the board
            // Z collision with 1st obstacle
            if(sceneModels[1].tz <= -0.25 && sceneModels[1].tz >= -0.60)
            {
                
                if(sceneModels[1].tz >= -0.31)
                {
                    if(sceneModels[1].tx <= 0.36)
                    {
                        console.log("colision");
                        Vx = -0.5 * Vx;
                        sceneModels[1].tz -= 0.01;
                    }
                }
            }
            
            // Calculate position by integrating Vx
            var Sz = Vx * 90 * elapsed / 1000;
            sceneModels[1].tz += Sz;
    
            if(Math.abs(Vx - 0.0001) < 0.0001)
            {
                Vx = 0; 
            }
            else if(Vx > 0) 
            {
                Vx -= 0.0001;
            }
            else
            {
                Vx += 0.0001;
            }
    
        }

        if(sceneModels[1].tz >= -0.44 && sceneModels[1].tz <= -0.36)
        {
            if(sceneModels[1].tx >= -0.47 && sceneModels[1].tx <= -0.38)
            {
                alert("Game over! Congratulations!");
                window.location.reload();
                
            }
        }
        
        // For every model --- Local rotations

        for (var i = 0; i < sceneModels.length; i++) {
            if (sceneModels[i].rotXXOn) {

                sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
            }

            if (sceneModels[i].rotYYOn) {

                sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
            }

            if (sceneModels[i].rotZZOn) {

                sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
            }
        }

        // Rotating the light sources

        for (var i = 0; i < lightSources.length; i++) {
            if (lightSources[i].isRotYYOn()) {

                var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;

                lightSources[i].setRotAngleYY(angle);
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

function setEventListeners() {

    // Button events

    document.getElementById("XX-on-off-button").onclick = function(){

    	// Switching on / off

    	// For every model

        if( globalRotationXX_ON) {

            globalRotationXX_ON = false;
        }
        else {
            globalRotationXX_ON = true;
        }	
    };

    document.getElementById("XX-direction-button").onclick = function(){

    	// Switching the direction

    	// For every model

        if( globalRotationXX_DIR == 1 ) {

            globalRotationXX_DIR = -1;
        }
        else {
            globalRotationXX_DIR = 1;
        }	
    };      

    document.getElementById("XX-slower-button").onclick = function(){

    	// For every model

    	globalRotationXX_SPEED *= 0.75; 
    };      

    document.getElementById("XX-faster-button").onclick = function(){

        // For every model
        
    	globalRotationXX_SPEED *= 1.25; 
    };      

    document.getElementById("YY-on-off-button").onclick = function(){

    	// Switching on / off

    	// For every model
    	
        if( globalRotationYY_ON ) {

            globalRotationYY_ON = false;
        }
        else {
            globalRotationYY_ON = true;
        }
    };

    document.getElementById("YY-direction-button").onclick = function(){

    	// Switching the direction

    	// For every model

        if( globalRotationYY_DIR == 1 ) {

            globalRotationYY_DIR = -1;
        }
        else {
            globalRotationYY_DIR = 1;
        }	
    };      

    document.getElementById("YY-slower-button").onclick = function(){

    	// For every model
    	globalRotationYY_SPEED *= 0.75; 
    };      

    document.getElementById("YY-faster-button").onclick = function(){

    	// For every model
        globalRotationYY_SPEED *= 1.25; 
    };

    // Dropdown list

    var restart = document.getElementById("restart-button");

    restart.addEventListener("click", function () {

        window.location.reload();
    });

    // ----------------------------------------------------------------------
    // Mouse movements
    //
    var mouseDown = function (e) {
        drag = true;
        old_x = e.pageX;
        old_y = e.pageY;
        e.preventDefault();
        return false;
    }

    var mouseUp = function (e) {
        drag = false;

        globalRotationXX_ON = 0;
        globalRotationYY_ON = 0;
    }

    var mouseMove = function (e) {

        if (!drag) return false;
        var factor = 100 / document.getElementById("game-canvas").height;
        var dY = factor * (e.pageX - old_x);
        var dX = factor * (e.pageY - old_y);

        if (dY != 0) {
            globalRotationYY_DIR = dY;
            globalRotationYY_ON = 1;
        }

        if (dX != 0) {
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
				alphaX -= 20;
				globalAngleXX -= value;
				last_key = e.key;
				break;
			case 's':
				alphaX += 20;
				globalAngleXX += value;
				last_key = e.key;
				break;
			case 'a':
				alphaZ -= 20;
				globalAngleZZ += value;
				last_key = e.key;
				break;
			case 'd':
				alphaZ += 20;
				globalAngleZZ -= value;
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
				alphaX += 20;
				globalAngleXX += value;
				break;
			case 's':
				alphaX -= 20;
				globalAngleXX -= value;
				break;
			case 'a':
				alphaZ += 20;	
				globalAngleZZ -= value;
				break;
			case 'd':
				alphaZ -= 20;
				globalAngleZZ += value;
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

function initWebGL(canvas) {
    try {

        // Create the WebGL context

        // Some browsers still need "experimental-webgl"

        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        primitiveType = gl.TRIANGLES;

        gl.enable(gl.CULL_FACE);

        gl.cullFace(gl.BACK);

        gl.enable(gl.DEPTH_TEST)

    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry! :-(");
    }
}

//----------------------------------------------------------------------------

function runWebGL() {

    var canvas = document.getElementById("game-canvas");

    initWebGL(canvas);

    shaderProgram = initShaders(gl);

    setEventListeners();

    initTexture();

    tick();		// A timer controls the rendering / animation
}