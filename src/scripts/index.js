let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl2");

// Do people not have WebGL 2 anymore?
if (!gl) {
  document.querySelector("#main-text").innerHtml =
    "Please aquire a new computer.";
}

let vtxSource = `#version 300 es
  precision highp float;

  in vec2 iPosition;
  uniform vec2 uResolution;

  void main() {
    // vec2 clipPos = ((iPosition / uResolution) * 2.0) - 1.0;
    vec2 zeroToOne = iPosition / uResolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipPos = zeroToTwo - 1.0;
    gl_Position = vec4(clipPos * vec2(1, -1), 0.0, 1.0);
  }`;

let fragSource = `#version 300 es
  precision highp float;

  out vec4 outColour;

  void main() {
    outColour = vec4(0.8, 0.3, 0.1, 1.0);
  }`;

function createShader(gl, type, src) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  let complete = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (complete) {
    return shader;
  }

  // Something has gone wrong
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertex, frag) {
  var program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  var complete = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (complete) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

let vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxSource);
let fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);
let program = createProgram(gl, vtxShader, fragShader);

let positionAttrib = gl.getAttribLocation(program, "iPosition");

let resolutionUniform = gl.getUniformLocation(program, "uResolution");

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
let positions = [
  gl.canvas.width,
  gl.canvas.height,
  -gl.canvas.width,
  -gl.canvas.height,
  -gl.canvas.width,
  gl.canvas.height,
  -gl.canvas.width,
  -gl.canvas.height,
  gl.canvas.width,
  gl.canvas.height,
  gl.canvas.width,
  -gl.canvas.height,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

let vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttrib);
gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.useProgram(program);

gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);

// gl.bindVertexArray(vao);
gl.drawArrays(gl.TRIANGLES, 0, 6);
