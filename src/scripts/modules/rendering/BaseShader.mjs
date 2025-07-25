import { Shader } from "./Shader.mjs";

export class BaseShader extends Shader {

    #vertexSource = `#version 300 es
in vec2 iPosition;
in vec2 iOffset;
in vec4 iColour;

uniform int uCellSize;
uniform vec2 uResolution;

out vec4 vColour;

void main() {
    // Scale and offset
    vec2 pos = iPosition * vec2(uCellSize, uCellSize) + iOffset;
    gl_Position = vec4(
        (pos / uResolution) * 2.0 - 1.0,
        0,
        1
    );

    // Pass this over to the fragment shader
    vColour = iColour;
}`;

    #fragSource = `#version 300 es
precision highp float;
in vec4 vColour;
out vec4 outColour;

void main() {
    outColour = vColour;
}`;

    /**
     * {@returns {string} The vertex shader source code.
     */
    getVertexSource() {
        return this.#vertexSource;
    }

    /**
     * {@returns {string} The fragment shader source code.
     */
    getFragSource() {
        return this.#fragSource;
    }
}