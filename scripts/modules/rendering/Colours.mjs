export const COLOURS_ARRAY = [
    { r: 0 / 255, g: 0 / 255, b: 0 / 255 },       // BLACK
    { r: 255 / 255, g: 255 / 255, b: 255 / 255 },     // WHITE
    { r: 128 / 255, g: 128 / 255, b: 128 / 255 },     // GRAY
    { r: 255 / 255, g: 0 / 255, b: 0 / 255 },       // RED
    { r: 0 / 255, g: 255 / 255, b: 0 / 255 },       // GREEN
    { r: 0 / 255, g: 0 / 255, b: 255 / 255 },     // BLUE
    { r: 255 / 255, g: 255 / 255, b: 0 / 255 },       // YELLOW
    { r: 255 / 255, g: 165 / 255, b: 0 / 255 },       // ORANGE
    { r: 165 / 255, g: 0 / 255, b: 165 / 255 },     // PURPLE
    { r: 0 / 255, g: 255 / 255, b: 255 / 255 },     // CYAN
    { r: 255 / 255, g: 192 / 255, b: 203 / 255 },     // PINK
    { r: 165 / 255, g: 42 / 255, b: 42 / 255 },      // BROWN
    { r: 0 / 255, g: 128 / 255, b: 0 / 255 },       // DARK_GREEN
    { r: 0 / 255, g: 0 / 255, b: 128 / 255 },     // NAVY_BLUE
];

export const COLOURS = {
    BLACK: 0,
    WHITE: 1,
    GRAY: 2,
    RED: 3,
    GREEN: 4,
    BLUE: 5,
    YELLOW: 6,
    ORANGE: 7,
    PURPLE: 8,
    CYAN: 9,
    PINK: 10,
    BROWN: 11,
    DARK_GREEN: 12,
    NAVY_BLUE: 13,

    /**
     * @param {string} colourString
     */
    getColourIndex(colourString) {
        const index = this[colourString.toUpperCase()];
        return (index !== undefined) ? index : null;
    },

    /**
     * @param {string | number} nameOrIndex
     */
    getColour(nameOrIndex) {
        if (typeof nameOrIndex === 'string') {
            const index = this[nameOrIndex.toUpperCase()];
            return (index !== undefined) ? COLOURS_ARRAY[index] : COLOURS_ARRAY[0];
        }

        if (typeof nameOrIndex === 'number') {
            return COLOURS_ARRAY[nameOrIndex] || COLOURS_ARRAY[0];
        }

        // I probably shouldn't do this but eh
        return COLOURS_ARRAY[0];
    }
};