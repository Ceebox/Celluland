import { CellInfo } from "./CellInfo.mjs";

export class Cell {

    constructor(row, column, state = 0) {
        this._cellInfo = new CellInfo(row, column, state);
        this._nextCellInfo = null;
        this._strategy = "return 1;";
    }

    /**
     * {@returns {CellInfo} The cell information.
     */
    getCellInfo() {
        return this._cellInfo;
    }

    getColumn() {
        return this._cellInfo.columnCount;
    }

    getRow() {
        return this._cellInfo.rowCount;
    }

    getState() {
        return this._cellInfo.state;
    }

    advance() {
        this._cellInfo = this._nextCellInfo;
        this._nextCellInfo = null;
    }

    simulate() {
        if (this._strategy !== null) {
            const newState = this.executeStrategy();
            this._nextCellInfo = new CellInfo(this._cellInfo.rowCount, this._cellInfo.columnCount, newState);
        } else {
            throw new Error("No strategy set for this cell.");
        }
    }

    executeStrategy() {
        const result = eval(this._strategy);
        if (typeof result !== "number") {
            throw new Error("Strategy must return a number representing the new state.");
        }

        return result;
    }
}