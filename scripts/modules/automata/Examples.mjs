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

const ScrollingNoise = `if (cell.phase == 0) {
  return Math.random() < 0.5 ? 1 : 0;
}

return cell.getCell(direction.CENTRE_LEFT);`

export const EXAMPLES = {
    "Conway's Game of Life": GameOfLife,
    "Scrolling Noise": ScrollingNoise,
}