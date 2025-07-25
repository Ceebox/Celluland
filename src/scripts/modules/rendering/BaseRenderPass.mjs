import { BaseShader } from "./BaseShader.mjs";
import { RenderPass } from "./RenderPass.mjs";

export class BaseRenderPass extends RenderPass {
    constructor(gl) {
        super(gl, new BaseShader());
    }

    render() {
        const gl = this._gl;
        const numInstances = 50;

        const positions = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ]);
        const indices = new Uint16Array([
            0, 1, 2,
            2, 1, 3,
        ]);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        // Position buffer for positioning cells
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionAttrib = gl.getAttribLocation(this._program(), "iPosition");
        gl.enableVertexAttribArray(positionAttrib);
        gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        const offsets = new Float32Array(numInstances * 2);
        for (let i = 0; i < numInstances; ++i) {
            offsets[2 * i + 0] = Math.random() * (gl.canvas.width - 100);
            offsets[2 * i + 1] = Math.random() * (gl.canvas.height - 1);
        }

        const offsetBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);

        const offsetAttrib = gl.getAttribLocation(this._program(), "iOffset");
        gl.enableVertexAttribArray(offsetAttrib);
        gl.vertexAttribPointer(offsetAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(offsetAttrib, 1); // Advance per instance

        const colours = new Float32Array(numInstances * 4); // RGBA
        for (let i = 0; i < numInstances; ++i) {
            colours[4 * i + 0] = i / numInstances;
            colours[4 * i + 1] = i / numInstances;
            colours[4 * i + 2] = i / numInstances;
            colours[4 * i + 3] = 1.0;
        }

        const colourBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colours, gl.STATIC_DRAW);

        const colourAttrib = gl.getAttribLocation(this._program(), "iColour");
        gl.enableVertexAttribArray(colourAttrib);
        gl.vertexAttribPointer(colourAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(colourAttrib, 1); // Advance per instance

        const resolutionUniform = gl.getUniformLocation(this._program(), "uResolution");
        
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this._program());

        gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);

        gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, numInstances);
    }
}
