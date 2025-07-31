export class CellInfo {

    /**
     * @param {number} rowCount
     * @param {number} columnCount
     */
    constructor(rowCount, columnCount, state = 0) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.state = state;
    }
}