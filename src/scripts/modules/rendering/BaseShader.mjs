import { Shader } from "./Shader.mjs";

export class BaseShader extends Shader {

    #vertexSource = `#version 300 es
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

    #fragSource = `#version 300 es
precision highp float;

out vec4 outColour;

void main() {
outColour = vec4(0.8, 0.3, 0.1, 1.0);
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