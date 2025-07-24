import { BaseShader } from "./BaseShader.mjs";
import { RenderPass } from "./RenderPass.mjs";

export class BaseRenderPass extends RenderPass {
    constructor(gl) {
        super(gl, new BaseShader());
    }

    render() {
        const gl = this._gl;

        let positionAttrib = gl.getAttribLocation(this._program(), "iPosition");

        let resolutionUniform = gl.getUniformLocation(this._program(), "uResolution");

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

        gl.useProgram(this._program());

        gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);

        // gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}