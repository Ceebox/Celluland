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

const SimpleScroll = `if (cell.getCell(direction.LEFT)) {
   return 1;
}

return 0;`

const ScrollingNoise = `if (cell.phase == 0) {
  return Math.random() < 0.5 ? 1 : 0;
}

return cell.getCell(direction.CENTRE_LEFT);`

const Waves = `if (cell.x < 4) {
   return 6;
}

if (cell.getCell(direction.LEFT) != 6) {
      return 5;
}

if (cell.getNeighbours(6) > 0) {

   const expand = Math.random() < 0.1;
   const retract = Math.random() < 0.4;
   if (expand) {
      return 6;
   }
   else if (retract) {
      return 5;
   }

if (Math.random() < 0.2) {
   return 9;
}

   return cell.state;
}

return 5;`

export const EXAMPLES = {
    "Conway's Game of Life": GameOfLife,
    "Scrolling Noise": ScrollingNoise,
    "Simple Scrolling": SimpleScroll,
    "Waves": Waves,
}