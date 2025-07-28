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

    hasRenderPass(passType) {
        if (!passType) {
            return this.#passes.length > 0;
        }

        return this.#passes.some(pass => pass instanceof passType);
    }

    /**
     * @param {typeof} passType
     */
    getRenderPass(passName) {
        const pass = this.#passes.find(p => p.constructor.name === passName);
        if (!pass) {
            throw new Error(`No render pass of type ${passName.name} found.`);
        }

        return pass;
    }
    
    render() {
        for (const pass of this.#passes) {
            pass.render();
        }
    }

}