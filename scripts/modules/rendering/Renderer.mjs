import { ShaderManager } from "./ShaderManager.mjs";
import { RenderPassManager } from "./RenderPassManager.mjs";
import { BaseRenderPass } from "./BaseRenderPass.mjs";

export class Renderer {

    #shaderManager = null;
    _renderPassManager = null;

    #currentCellInfo = null;

    constructor(canvas, cellSize) {
        const gl = canvas.getContext("webgl2", {
            desynchronized: true,
            antialias: false,
            powerPreference: "low-power",
        });

        // Do people still not have WebGL 2?
        if (!gl) {
            document.querySelector("#error-text").innerHtml =
                "Please aquire a new computer.";

            throw new Error("WebGL 2 is not supported by this browser.");
        }

        // The idea here was that there was going to be multiple render passes
        // (Bloom, etc)
        // This probably ain't gonna happen (at least for a while)
        this.#shaderManager = new ShaderManager(gl);
        this._renderPassManager = new RenderPassManager(this.#shaderManager);
        this._renderPassManager.addRenderPass(new BaseRenderPass(gl, cellSize));
    }

    render(timestamp) {
        this._renderPassManager.render();
    }

    setCellInfo(cellInfo) {
        if (!cellInfo) {
            throw new Error("Cell info is required");
        }

        this.#currentCellInfo = cellInfo;
        const pass = this._renderPassManager.getRenderPass(BaseRenderPass.prototype.constructor.name); 
        
        pass.setCellInfo(cellInfo);
    }
}