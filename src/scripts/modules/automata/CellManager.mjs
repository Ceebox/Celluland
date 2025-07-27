import { Cell } from "./Cell.mjs";
import { StrategyController } from "./StrategyController.mjs";

export class CellManager {

    #cells = [];
    #phase = 0;

    constructor(rowCount, columnCount) {
        this._rowCount = rowCount;
        this._columnCount = columnCount;

        this._strategyController = new StrategyController(this);

        // Initialize cells with default values
        for (let i = 0; i < this._rowCount; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < this._columnCount; j++) {
                this.#cells[i][j] = new Cell(i, j, 0);
            }
        }
    }

    updateCells() {
        for (let i = 0; i < this._rowCount; i++) {
            for (let j = 0; j < this._columnCount; j++) {
                this._strategyController.simulateCell(this.#cells[i][j]);
            }
        }

        for (let i = 0; i < this._rowCount; i++) {
            for (let j = 0; j < this._columnCount; j++) {
                this.#cells[i][j].advance();
            }
        }

        this.#phase++;
    }

    /**
     * Get the amount of neighbours of a cell
     * @param {*} row The row of the cell
     * @param {*} column The column of the cell
     * @param {*} state The desired state of the cell, or any
     */
    getNeighbours(row, column, state = 1) {
        const neighbours = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Skip the cell
                const newRow = row + i;
                const newColumn = column + j;
                if (newRow >= 0 && newRow < this._rowCount && newColumn >= 0 && newColumn < this._columnCount) {
                    const cell = this.#cells[newRow][newColumn];
                    const cellState = cell.getState();
                    if (state == cellState) {
                        neighbours.push(cell);
                    }
                }
            }
        }

        return neighbours.length;
    }

    getPhase() {
        return this.#phase;
    }

    getCellInfo() {
        return this.#cells;
    }
}