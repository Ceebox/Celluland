import { ShaderManager } from "./ShaderManager.mjs";
import { RenderPass } from "./RenderPass.mjs";

export class RenderPassManager {

    #shaderManager = null;
    #passes = [];

    /**
     * @param {ShaderManager} shaderManager 
     */
    constructor(shaderManager) {
        this.#shaderManager = shaderManager;
    }

    /**
     * @param {RenderPass} pass 
     */
    addRenderPass(pass) {
        if (!(pass instanceof RenderPass)) {
            throw new Error("Invalid render pass type");
        }

        this.#shaderManager.createShader(pass.getShader());

        this.#passes.push(pass);
    }
    
    render() {
        for (const pass of this.#passes) {
            pass.render();
        }
    }

}