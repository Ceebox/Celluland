import { Cell } from "./Cell.mjs";

export class CellManager {

    #cells = [];

    constructor(rowCount, columnCount) {
        this._rowCount = rowCount;
        this._columnCount = columnCount;

        // Initialize cells with default values
        for (let i = 0; i < this._rowCount; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < this._columnCount; j++) {
                this.#cells[i][j] = new Cell(i, j, 0);
            }
        }
    }

    updateCells(newStates) {
        if (newStates.length !== this._rowCount || newStates[0].length !== this._columnCount) {
            throw new Error("New states do not match the dimensions of the cell grid.");
        }

        for (let i = 0; i < this._rowCount; i++) {
            for (let j = 0; j < this._columnCount; j++) {
                // this.#cells[i][j] = newStates[i][j];
            }
        }
    }

    getCellInfo() {
        return this.#cells;
    }
}