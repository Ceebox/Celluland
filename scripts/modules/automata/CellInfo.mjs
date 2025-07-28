export class CellInfo {
    
    constructor(rowCount, columnCount, state = 0) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.state = state;
    }
}