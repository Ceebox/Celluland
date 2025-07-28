import { Shader } from "./Shader.mjs";

export class ShaderManager {
    constructor(gl) {
        this._gl = gl;
        if (!this._gl) {
            throw new Error("WebGL context is required");
        }

        this._shaders = new Map();
    }

    /**
     * @param {Shader} shader 
     * @returns {Shader}
     */
    createShader(shader) {
        if (!(shader instanceof Shader)) {
            throw new Error("Invalid shader type");
        }

        const name = shader.constructor.name;
        if (this.hasShader(name)) {
            throw new Error(`Shader with name ${name} already exists`);
        }

        this.#createProgram(this._gl, shader);

        this._shaders.set(name, shader);

        return shader;
    }

    #createGlShader(gl, type, src) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        const complete = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (complete) {
            return shader;
        }

        // Something has gone wrong
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    #createProgram(gl, shader) {

        const vertex = this.#createGlShader(gl, gl.VERTEX_SHADER, shader.getVertexSource());
        const frag = this.#createGlShader(gl, gl.FRAGMENT_SHADER, shader.getFragSource());

        const program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, frag);
        gl.linkProgram(program);

        shader.setProgram(program);

        const complete = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (complete) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    getShader(name) {
        return this._shaders.get(name);
    }

    hasShader(name) {
        return this._shaders.has(name);
    }

    removeShader(name) {
        this._shaders.delete(name);
    }
}