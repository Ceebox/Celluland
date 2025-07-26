import { Cell } from "./Cell.mjs";

export class StrategyController {

    constructor(cellManager) {
        this._cellManager = cellManager;
    }

    updateStrategy(newStates) {
        this.cellManager.updateCells(newStates);
        this.renderPass.updateCellInfo(this.cellManager.getCellInfo());
    }

    simulateCell(cell) {
        cell.simulate(this);
    }

    createApi(currentCell, strategy) {
        const cellApi = {
            x : currentCell.getColumn(),
            y : currentCell.getRow(),
            state : currentCell.getState(),
            getNeighbours() {
                return this._cellManager.getNeighbours(
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
    executeStrategy(cell) {
        const result = this.createApi(cell, cell.getStrategy())();
        if (typeof result !== "number") {
            throw new Error("Strategy must return a number representing the new state.");
        }

        return result;
    }

    getCellInfo() {
        return this._cellManager.getCellInfo();
    }
}