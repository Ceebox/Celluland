import { BaseShader } from "./BaseShader.mjs";
import { COLOURS } from "./Colours.mjs";
import { RenderPass } from "./RenderPass.mjs";

export class BaseRenderPass extends RenderPass {

    constructor(gl, cellSize) {
        super(gl, new BaseShader());

        this._cellSize = cellSize;
        this._cellInfo = [];
    }

    render() {
        const gl = this._gl;
        const numCells = this._cellInfo.length * this._cellInfo[0].length;

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

        const offsets = new Float32Array(numCells * 2);
        for (let i = 0; i < this._cellInfo.length; i++) {
            for (let j = 0; j < this._cellInfo[i].length; j++) {
                const index = i * this._cellInfo[i].length + j;
                offsets[2 * index + 0] = j * this._cellSize;
                offsets[2 * index + 1] = i * this._cellSize;
            }
        }

        const offsetBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);

        const offsetAttrib = gl.getAttribLocation(this._program(), "iOffset");
        gl.enableVertexAttribArray(offsetAttrib);
        gl.vertexAttribPointer(offsetAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(offsetAttrib, 1); // Advance per instance

        const colours = new Float32Array(numCells * 4);
        for (let i = 0; i < this._cellInfo.length; i++) {
            for (let j = 0; j < this._cellInfo[i].length; j++) {
                const index = i * this._cellInfo[i].length + j;
                const state = this._cellInfo[i][j].getState();
                const colour = COLOURS.getColour(state);

                colours[4 * index + 0] = colour.r;
                colours[4 * index + 1] = colour.g;
                colours[4 * index + 2] = colour.b;
                colours[4 * index + 3] = 1.0;
            }
        }

        const colourBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colours, gl.STATIC_DRAW);

        const colourAttrib = gl.getAttribLocation(this._program(), "iColour");
        gl.enableVertexAttribArray(colourAttrib);
        gl.vertexAttribPointer(colourAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(colourAttrib, 1); // Advance per instance

        const resolutionUniform = gl.getUniformLocation(this._program(), "uResolution");
        const cellSizeUniform = gl.getUniformLocation(this._program(), "uCellSize");
        
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this._program());

        gl.uniform1i(cellSizeUniform, this._cellSize);
        gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);

        gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, numCells);
    }

    setCellInfo(cellInfo) {
        this._cellInfo = cellInfo;
    }
}
