import { CellInfo } from "./CellInfo.mjs";
import { StrategyController } from "./StrategyController.mjs";

export class Cell {

    /**
     * @param {number} row
     * @param {number} column
     */
    constructor(row, column, state = 0) {
        this._cellInfo = new CellInfo(row, column, state);
        this._nextCellInfo = null;
        this._strategy = null;
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

    /**
     * @param {number} state
     */
    setState(state) {
        this._cellInfo.state = state;
    }

    getStrategy() {
        return this._strategy || "return cell.state;";
    }

    /**
     * @param {string} text
     */
    setStrategy(text) {
        this._strategy = text;
    }

    advance() {
        this._cellInfo = this._nextCellInfo
            ?? new CellInfo(this._cellInfo.rowCount, this._cellInfo.columnCount, this._cellInfo.state);
        this._nextCellInfo = null;
    }

    /**
     * @param {StrategyController} strategyController 
     */
    simulate(strategyController) {
        if (this._strategy !== null) {
            const newState = strategyController.executeStrategy(this);
            this._nextCellInfo = new CellInfo(this._cellInfo.rowCount, this._cellInfo.columnCount, newState);
        } else {
            // throw new Error("No strategy set for this cell.");
            this._nextCellInfo = new CellInfo(this._cellInfo.rowCount, this._cellInfo.columnCount, this._cellInfo.state);
        }
    }
}