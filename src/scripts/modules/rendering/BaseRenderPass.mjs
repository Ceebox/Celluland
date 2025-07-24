import { BaseShader } from "./BaseShader.mjs";
import { RenderPass } from "./RenderPass.mjs";

export class BaseRenderPass extends RenderPass {
    constructor(gl) {
        super(gl, new BaseShader());
    }
}