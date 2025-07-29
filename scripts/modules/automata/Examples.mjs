const GameOfLife = `const neighbours = cell.getNeighbours();
if (neighbours < 2) {
    return 0;
}

if (neighbours > 3) {
    return 0;
}

if (cell.state == 0 && neighbours == 3) {
    return colours.WHITE;
}

return cell.state;
`

export const EXAMPLES = {
    "Conway's Game of Life": GameOfLife,
}