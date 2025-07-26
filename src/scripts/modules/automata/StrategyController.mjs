export class StrategyController {

    constructor(cellManager) {
        this.cellManager = cellManager;
    }

    updateStrategy(newStates) {
        this.cellManager.updateCells(newStates);
        this.renderPass.updateCellInfo(this.cellManager.getCellInfo());
    }

    simulateCell(cell) {
        cell.simulate();
    }

    getCellInfo() {
        return this.cellManager.getCellInfo();
    }
}