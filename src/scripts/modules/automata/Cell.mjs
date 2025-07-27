import { CellInfo } from "./CellInfo.mjs";
import { StrategyController } from "./StrategyController.mjs";

export class Cell {

    constructor(row, column, state = 0) {
        this._cellInfo = new CellInfo(row, column, state);
        this._nextCellInfo = null;
        this._strategy = `

        if (cell.phase == 0) {
            return Math.random() < 0.5 ? 1 : 0; // Randomly set state to 0 or 1
        }

        const neighbours = cell.getNeighbours();
        if (neighbours < 2) {
            return 0;
        }

        if (neighbours > 3) {
            return 0;
        }

        if (cell.state == 0 && neighbours == 3) {
            return 1;
        }

        return cell.state;
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
    simulate(strategyController) {
        if (this._strategy !== null) {
            const newState = strategyController.executeStrategy(this);
            this._nextCellInfo = new CellInfo(this._cellInfo.rowCount, this._cellInfo.columnCount, newState);
        } else {
            throw new Error("No strategy set for this cell.");
        }
    }
}