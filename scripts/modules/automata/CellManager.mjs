import { Cell } from "./Cell.mjs";
import { DIRECTION } from "./Direction.mjs";
import { StrategyController } from "./StrategyController.mjs";

export class CellManager {

    #cells = [];
    #phase = 0;

    constructor(rowCount, columnCount, initialState = []) {
        this._rowCount = rowCount;
        this._columnCount = columnCount;
        this._initialState = initialState;

        this._strategyController = new StrategyController(this);

        this.setToInitialState();
    }

    clearInitialState() {
        this._initialState = [];
    }

    setToInitialState() {

        // TODO: Support setting up the whole board
        const initialLength = this._initialState.length;
        let initialStateValue = 0;
        if (initialLength > 0) {
            if (initialLength === 1) {
                initialStateValue = this._initialState[0];
            }
        }

        // Initialize cells with default values
        for (let i = 0; i < this._rowCount; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < this._columnCount; j++) {
                if (initialLength > 1) {
                    initialStateValue = this._initialState[i][j];
                } else {
                    this._initialState[i] = [];
                }

                this.#cells[i][j] = new Cell(i, j, initialStateValue);
                this._initialState[i][j] = initialStateValue;
            }
        }
    }

    setScript(text) {
        for (let i = 0; i < this._rowCount; i++) {
            for (let j = 0; j < this._columnCount; j++) {
                this.#cells[i][j].setStrategy(text);
            }
        }
    }

    resize(newRowCount, newColumnCount) {
        this._rowCount = newRowCount;
        this._columnCount = newColumnCount;

        const initialLength = this._initialState.length;
        let initialStateValue = 0;
        if (initialLength > 0) {
            if (initialLength === 1) {
                initialStateValue = this._initialState[0];
            }
        }

        for (let i = 0; i < this._rowCount; i++) {

            if (!this.#cells[i]) {
                this.#cells[i] = [];
            } else if (this._columnCount < this.#cells[i].length - 1) {
                this.#cells = this.#cells.slice(0, this.#cells.length - 1);
            }

            for (let j = 0; j < this._columnCount; j++) {
                if (initialLength > 1) {
                    initialStateValue = this._initialState[i][j];
                } else {
                    this._initialState[i] = [];
                }

                if (!this.#cells[i][j]) {
                    this.#cells[i][j] = new Cell(i, j, initialStateValue);
                    this._initialState[i][j] = initialStateValue;
                }
            }
        }

        if (this._rowCount < this.#cells.length - 1) {
            this.#cells = this.#cells.slice(0, this.#cells.length - 1);
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

    getCell(row, column) {
        if (row < 0 || row >= this._rowCount || column < 0
            || column >= this._columnCount) {
            return null;
        }

        return this.#cells[row][column];
    }

    /**
     * @param {Cell} initialCell 
     * @param {Direction} direction 
     */
    getCellFromDirection(initialCell, direction) {
        let x = initialCell.getColumn();
        let y = initialCell.getRow();

        switch (direction) {
            case (DIRECTION.TOP_LEFT):
                x -= 1;
                y -= 1;
                break;
            case (DIRECTION.TOP_MIDDLE):
                y -= 1;
                break;
            case (DIRECTION.TOP_RIGHT):
                x += 1;
                y -= 1;
                break;
            case (DIRECTION.CENTRE_LEFT):
                x -= 1;
                break;
            case (DIRECTION.CENTRE_MIDDLE):
                break;
            case (DIRECTION.CENTRE_RIGHT):
                x += 1;
                break;
            case (DIRECTION.BOTTOM_LEFT):
                x -= 1;
                y += 1;
                break;
            case (DIRECTION.BOTTOM_MIDDLE):
                y += 1;
                break;
            case (DIRECTION.BOTTOM_RIGHT):
                x += 1;
                y += 1;
                break;
            default:
                break;
        }

        if (y >= this.#cells.length) {
            y = 0;
        }

        if (y < 0) {
            y = this.#cells.length - 1;
        }

        if (x >= this.#cells[y].length) {
            x = 0;
        }

        if (x < 0) {
            x = this.#cells[y].length - 1;
        }

        const cell = this.#cells[y][x];
        if (!cell) {
            throw new Error(`Cell does not exist at: ${x}, ${y}`);
        }

        return cell.getState();
    }

    // I guess technically this can be called from the API, but probably don't?
    setCell(row, column, state) {
        if (row < 0 || row >= this._rowCount || column < 0
            || column >= this._columnCount) {
            throw new Error("Cell coordinates out of bounds");
        }

        if (typeof state !== "number") {
            throw new Error("State must be a number");
        }

        this.#cells[row][column].setState(state);
        if (this.#phase == 0) {
            this._initialState[row][column] = state;
        }
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

    resetPhase() {
        this.#phase = 0;
    }

    getPhase() {
        return this.#phase;
    }

    getCellInfo() {
        return this.#cells;
    }
}