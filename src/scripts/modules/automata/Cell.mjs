import { CellInfo } from "./CellInfo.mjs";
import { StrategyController } from "./StrategyController.mjs";

export class Cell {

    constructor(row, column, state = 0) {
        this._cellInfo = new CellInfo(row, column, state);
        this._nextCellInfo = null;
        this._strategy = `
        return cell.phase % 2 === 0 ? 0 + cell.x % 2 == 0 ? 1 : 0 : 1;
        `;
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

    getStrategy() {
        return this._strategy;
    }

    advance() {
        this._cellInfo = this._nextCellInfo;
        this._nextCellInfo = null;
    }

    /**
     * @param {StrategyController} strategyController 
     */
    simulate(strategyController, phase) {
        if (this._strategy !== null) {
            const newState = strategyController.executeStrategy(this, phase);
            this._nextCellInfo = new CellInfo(this._cellInfo.rowCount, this._cellInfo.columnCount, newState);
        } else {
            throw new Error("No strategy set for this cell.");
        }
    }
}