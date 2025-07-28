import { Shader } from "./Shader.mjs";

export class RenderPass {

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {*} resolution 
     */
    constructor(gl, shader) {
        if (!(gl instanceof WebGL2RenderingContext)) {
            throw new Error("Invalid WebGL context");
        }
        if (!(shader instanceof Shader)) {
            throw new Error("Invalid shader type");
        }

        this._gl = gl;
        this._shader = shader;
        this._program = () => shader.getProgram();
    }

    getShader() {
        return this._shader;
    }
    
    render() {}
}
