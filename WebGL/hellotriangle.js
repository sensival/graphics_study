function getWebGLContext(canvas) {
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  }

function initShaders(gl, vshaderSource, fshaderSource) {
    var program = createProgram(gl, vshaderSource, fshaderSource);
    if (!program) {
      console.log('Failed to create program');
      return false;
    }
  
    gl.useProgram(program);
    gl.program = program;
  
    return true;
  }
  
  function createProgram(gl, vshaderSource, fshaderSource) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshaderSource);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshaderSource);
    if (!vertexShader || !fragmentShader) {
      return null;
    }
  
    var program = gl.createProgram();
    if (!program) {
      return null;
    }
  
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var error = gl.getProgramInfoLog(program);
      console.log('Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }
    return program;
  }
  
  function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (shader == null) {
      console.log('unable to create shader');
      return null;
    }
  
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var error = gl.getShaderInfoLog(shader);
      console.log('Failed to compile shader: ' + error);
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }
// HelloTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('helloapicanvas');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}