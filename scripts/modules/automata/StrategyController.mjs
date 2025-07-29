import { COLOURS } from "../rendering/Colours.mjs";
import { Cell } from "./Cell.mjs";
import { DIRECTION } from "./Direction.mjs";

export class StrategyController {

    constructor(cellManager) {
        this._cellManager = cellManager;
    }

    simulateCell(cell) {
        cell.simulate(this);
    }

    createApi(currentCell, strategy) {
        const ctx = this;
        const cellManager = this._cellManager;
        const cellApi = {
            ctx : ctx,
            cellManager : cellManager,
            phase : cellManager.getPhase(),
            x : currentCell.getColumn(),
            y : currentCell.getRow(),
            state : currentCell.getState(),
            getNeighbours() {
                return cellManager.getNeighbours(
                    currentCell.getRow(),
                    currentCell.getColumn()
                );
            },
            // Maybe rename this
            getCell(direction) {
                return cellManager.getCellFromDirection(
                    currentCell,
                    direction
                );
            }
        };

        return new Function("cell", "colours", "direction", `
            \`use strict\`
            return (function() {
                ${strategy}
            })();
        `).bind(null, cellApi, COLOURS, DIRECTION);
    }

    /**
     * @param {Cell} cell 
     * @returns 
     */
    executeStrategy(cell) {
        const result = this.createApi(cell, cell.getStrategy())();

        if (typeof result === "string") {
            const colourToInt = COLOURS.getColourIndex(result);
            if (colourToInt !== null) {
                return colourToInt;
            } else {
                throw new Error(`Invalid colour name: ${result}`);
            }
        }
        else if (typeof result === "boolean") {
            return result ? 1 : 0;
        }
        else if (typeof result !== "number") {
            throw new Error("Strategy must return a number representing the new state.");
        }

        return result;
    }

    getCellInfo() {
        return this._cellManager.getCellInfo();
    }
}