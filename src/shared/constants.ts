import {DummyControl} from "../controls/dummy/dummyControl.ts";

export const MAX_ZOOM = 6
export const MIN_ZOOM = 0.1
export const SCROLL_SENSITIVITY = 0.0020

export const SELECTION_STROKE_STYLE = 'yellow'
export const DEFAULT_FONT = 'courier'
export const DEFAULT_FONT_SIZE = 14
export const DEFAULT_LINE_WIDTH = 2
export const TITLE_FONT_SIZE = 22
export const SUB_TITLE_FONT_SIZE = 18
export const SUB_TITLE_COLOR = 'black'
export const DEFAULT_BOX_COLOR = "rgba(37,33,133,0.68)"
export const WHITE = "white"
export const BLACK = "black"
export const COLORS: string [] = [
    "#F44336",
    "#E91E63",
    "#673AB7",
    "#FFC107",
    "#3F51B5",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FF9800",
    "#FF5722",
    "#673AB7",
    "#795548",
    "#2196F3",
    "#9E9E9E",
    "#607D8B",
]

export const SIZES: number [] = [
    22, 14, 16, 17, 12, 32
]

export const DEFAULT_DOT_SIZE = SIZES[0]

export const DUMMY_CONTROL = DummyControl.getInstance()