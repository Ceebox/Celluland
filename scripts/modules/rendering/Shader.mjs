export class Shader {

    #program = null;

    /**
     * {@returns {string} The vertex shader source code.
     */
    getVertexSource() {}

    /**
     * {@returns {string} The fragment shader source code.
     */
    getFragSource() {}

    /**
     * {@returns {WebGLProgram} The compiled shader program.
     */
    getProgram() {
        if (!this.#program) {
            throw new Error("Shader program has not been created yet.");
        }
        
        return this.#program;
    }

    setProgram(program) {
        if (!(program instanceof WebGLProgram)) {
            throw new Error("Invalid program type. Expected WebGLProgram.");
        }

        this.#program = program;
    }
}