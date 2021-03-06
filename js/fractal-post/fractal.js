var gl; // A global variable for the WebGL context

var HUE_SHIFT = 0;
var zoomlevel = 1.0;
var translation = [0.0, 0.0];
var julia_constant = [0.0, 0.8];


function initWebGL(canvas) {
  gl = null;
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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
  gl.compileShader(shader);
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

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }

  gl.useProgram(shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
}

function getPrecision(){
  if(isMobile()){
    return "precision mediump";
  }
  return "precision highp";
}


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

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var u_hue = gl.getUniformLocation(shaderProgram, "HUE_SHIFT");
  gl.uniform1i(u_hue, HUE_SHIFT);
  var u_zoom = gl.getUniformLocation(shaderProgram, "zoomlevel");
  gl.uniform1f(u_zoom, zoomlevel);
  var u_translation = gl.getUniformLocation(shaderProgram, "translation");
  gl.uniform2fv(u_translation, translation);
  var u_julia_constant = gl.getUniformLocation(shaderProgram, "julia_constant");
  gl.uniform2fv(u_julia_constant, julia_constant);


  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}



var Fractal = (function(){

  var start = function(canvas){
    gl = initWebGL(canvas);
    if (!gl) {
      return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    initShaders();
    initBuffers();
    drawScene();
  }

  var update_hue_shift= function(value){
  	HUE_SHIFT = value;
    drawScene();
  }

  var zoom= function(value){
    value = value > 0 ? 0.1 : -0.1;
    if(zoomlevel + value <= 0.1){
      return;
    }

    zoomlevel += value;
    drawScene();
  }

  var translate= function(dx, dy){
    translation[0] += dx;
    translation[1] += dy;

    drawScene();
  }

  var update_julia_constant= function(arg){
    if(arg.x){
      julia_constant[0] = arg.x;
    }
    if(arg.y){
      julia_constant[1] = arg.y;
    }
    drawScene();
  }

  return {
    start: start,
    update_hue_shift: update_hue_shift,
    zoom: zoom,
    translate: translate,
    update_julia_constant: update_julia_constant
  }
})();




var fragmentShaderSource = getPrecision() + ` float;
varying vec3 v_position;
#define MAX_ITERATIONS 256
uniform int HUE_SHIFT;
uniform float zoomlevel;
uniform vec2 translation;
uniform vec2 julia_constant;

vec4 hsv_to_rgb(float h, float s, float v, float a);

void main(){
  int i=0;
  vec2 z = (v_position.xy - translation) / zoomlevel;

  for(int j=0; j < MAX_ITERATIONS; j++){
      z = vec2(z.x*z.x + julia_constant.x - z.y*z.y, 2.0*z.x* z.y + julia_constant.y);
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
