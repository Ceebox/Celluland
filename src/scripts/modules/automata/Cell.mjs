import { CellInfo } from "./CellInfo.mjs";
import { StrategyController } from "./StrategyController.mjs";

export class Cell {

    constructor(row, column, state = 0) {
        this._cellInfo = new CellInfo(row, column, state);
        this._nextCellInfo = null;
        this._strategy = "return Math.random() < 0.5 ? 1 : 0;";
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

    /**
     * @param {StrategyController} strategyController 
     */
    simulate(strategyController) {
        if (this._strategy !== null) {
            const newState = strategyController.executeStrategy(this._strategy);
            this._nextCellInfo = new CellInfo(this._cellInfo.rowCount, this._cellInfo.columnCount, newState);
        } else {
            throw new Error("No strategy set for this cell.");
        }
    }
}