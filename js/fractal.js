var gl; // A global variable for the WebGL context

function start() {
  var canvas = document.getElementById("glcanvas");

  // Initialize the GL context
  gl = initWebGL(canvas);

  // Only continue if WebGL is available and working
  if (!gl) {
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color as well as the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT);
}


function initWebGL(canvas) {
  gl = null;

  // Try to grab the standard context. If it fails, fallback to experimental.
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }

  return gl;
}


function getShader(gl, source, type) {
  var shaderScript,
      theSource,
      currentChild,
      shader;

  shader = gl.createShader(type);

  gl.shaderSource(shader, source);

  // Compile the gl_FragCoord.xyzer program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
  }

  return shader;

}

function initShaders() {
  var fragmentShader = getShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  var vertexShader = getShader(gl, vertexShaderSource, gl.VERTEX_SHADER);

  // Create the shader program

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }

  gl.useProgram(shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
}


var fragmentShaderSource = `precision highp float;
varying vec3 v_position;
#define MAX_ITERATIONS 256
uniform int HUE_SHIFT;
#define zoomlevel 0.7
#define translation vec2(0.0, 0.0)

vec4 hsv_to_rgb(float h, float s, float v, float a);

void main(){
  int i=0;
  vec2 z = (v_position.xy - translation) / zoomlevel;
  vec2 C = vec2(0.0, 0.8);

  for(int j=0; j < MAX_ITERATIONS; j++){
      z = vec2(z.x*z.x + C.x - z.y*z.y, 2.0*z.x* z.y + C.y);
      i=j;
      if(length(z) > 2.0){
        break;
      }
  }
  vec4 color;
  if(i==MAX_ITERATIONS){
      color = vec4(0.1, 0.1, 0.1, 1.0);
  }else{
      i += HUE_SHIFT;
      float hue =  (mod(float(i),256.0)/255.0);
      color = hsv_to_rgb(hue, 1.0, 1.0, 1.0);
  }
  gl_FragColor = color;
}

vec4 hsv_to_rgb(float h, float s, float v, float a){
	float c = v * s;
	h = mod((h * 6.0), 6.0);
	float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));
	vec4 color;

	if (0.0 <= h && h < 1.0) {
		color = vec4(c, x, 0.0, a);
	} else if (1.0 <= h && h < 2.0) {
		color = vec4(x, c, 0.0, a);
	} else if (2.0 <= h && h < 3.0) {
		color = vec4(0.0, c, x, a);
	} else if (3.0 <= h && h < 4.0) {
		color = vec4(0.0, x, c, a);
	} else if (4.0 <= h && h < 5.0) {
		color = vec4(x, 0.0, c, a);
	} else if (5.0 <= h && h < 6.0) {
		color = vec4(c, 0.0, x, a);
	} else {
		color = vec4(0.0, 0.0, 0.0, a);
	}

	color.rgb += v - c;

	return color;
}
`;
var vertexShaderSource = `attribute vec3 aVertexPosition;
                          varying vec3 v_position;
                          void main(void) {
                              gl_Position = vec4(aVertexPosition, 1.0);
                              v_position = aVertexPosition;
                          }`;

start();
initShaders();



function initBuffers() {
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

var HUE_SHIFT = 0;

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var pUniform = gl.getUniformLocation(shaderProgram, "HUE_SHIFT");
  gl.uniform1i(pUniform, HUE_SHIFT);


  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

initBuffers();
drawScene();


function showValue(newValue){
	HUE_SHIFT = newValue;
  drawScene();
}
