import { Cell } from "./Cell.mjs";
import { StrategyController } from "./StrategyController.mjs";

export class CellManager {

    #cells = [];

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
    }

    getCellInfo() {
        return this.#cells;
    }
}