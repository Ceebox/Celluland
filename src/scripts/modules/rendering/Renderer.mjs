import { ShaderManager } from "./ShaderManager.mjs";
import { RenderPassManager } from "./RenderPassManager.mjs";
import { BaseRenderPass } from "./BaseRenderPass.mjs";

export class Renderer {

    #shaderManager = null;
    _renderPassManager = null;

    constructor(canvas) {
        let gl = canvas.getContext("webgl2", {
            desynchronized: true,
            antialias: false,
            powerPreference: "low-power",
        });

        // Do people not have WebGL 2 anymore?
        if (!gl) {
            document.querySelector("#main-text").innerHtml =
                "Please aquire a new computer.";

            throw new Error("WebGL 2 is not supported by this browser.");
        }   

        this.#shaderManager = new ShaderManager(gl);
        this._renderPassManager = new RenderPassManager(this.#shaderManager);
        this._renderPassManager.addRenderPass(new BaseRenderPass(gl));

        window.requestAnimationFrame(this.render.bind(this));
    }

    render(timestamp) {
        this._renderPassManager.render();
        window.requestAnimationFrame(() => this.render);
    }
}