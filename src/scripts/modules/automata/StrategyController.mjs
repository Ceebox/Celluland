import { Cell } from "./Cell.mjs";

export class StrategyController {

    constructor(cellManager) {
        this._cellManager = cellManager;
    }

    simulateCell(cell, phase) {
        cell.simulate(this, phase);
    }

    createApi(currentCell, phase, strategy) {
        const ctx = this;
        const cellManager = this._cellManager;
        const cellApi = {
            ctx : ctx,
            cellManager : cellManager,
            phase : phase,
            x : currentCell.getColumn(),
            y : currentCell.getRow(),
            state : currentCell.getState(),
            getNeighbours() {
                return cellManager.getNeighbours(
                    currentCell.getRow(),
                    currentCell.getColumn()
                );
            },
        };

        return new Function("cell", `
            return (function() {
                ${strategy}
            })();
        `).bind(null, cellApi);
    }

    /**
     * @param {Cell} cell 
     * @returns 
     */
    executeStrategy(cell, phase) {
        const result = this.createApi(cell, phase, cell.getStrategy())();
        if (typeof result !== "number") {
            throw new Error("Strategy must return a number representing the new state.");
        }

        return result;
    }

    getCellInfo() {
        return this._cellManager.getCellInfo();
    }
}