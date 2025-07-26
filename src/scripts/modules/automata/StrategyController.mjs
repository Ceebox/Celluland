export class StrategyController {

    constructor(cellManager) {
        this._cellManager = cellManager;
    }

    updateStrategy(newStates) {
        this.cellManager.updateCells(newStates);
        this.renderPass.updateCellInfo(this.cellManager.getCellInfo());
    }

    simulateCell(cell) {
        cell.simulate(this);
    }

    getApi() {
        return "";
    }

    executeStrategy(strategy) {
        const result = new Function(this.getApi(), strategy)();
        if (typeof result !== "number") {
            throw new Error("Strategy must return a number representing the new state.");
        }

        return result;
    }

    getCellInfo() {
        return this.cellManager.getCellInfo();
    }
}