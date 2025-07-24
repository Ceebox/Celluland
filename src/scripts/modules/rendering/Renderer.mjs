import { ShaderManager } from "./ShaderManager.mjs";
import { BaseShader } from "./BaseShader.mjs";

export class Renderer {
    constructor() {
        let canvas = document.getElementById("canvas");
        let gl = canvas.getContext("webgl2");

        // Do people not have WebGL 2 anymore?
        if (!gl) {
            document.querySelector("#main-text").innerHtml =
                "Please aquire a new computer.";
        }   

        let shaderManager = new ShaderManager(gl);
        let baseShader = shaderManager.createShader(new BaseShader());

        let positionAttrib = gl.getAttribLocation(baseShader.getProgram(), "iPosition");

        let resolutionUniform = gl.getUniformLocation(baseShader.getProgram(), "uResolution");

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

        gl.useProgram(baseShader.getProgram());

        gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);

        // gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}