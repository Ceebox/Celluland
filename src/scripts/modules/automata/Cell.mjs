import CellInfo from "./CellInfo.mjs";

export class Cell {

    constructor(row, column, state = 0) {
        this._cellInfo = new CellInfo(row, column, state);
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
}