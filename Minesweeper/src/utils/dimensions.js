import selectBoxes from "../utils/selectBoxes";
import message from "../pages/Message";

const banner = {
    bannerWidth: 990,
    bannerHeight: 80,
}

const messageArea = {
    messageWidth: 300,
    messageHeight: 50,
    buttonHeight: 40,
    buttonWidth: 150
}

const fieldArea = {
    cell_width: 22,
    cell_height: 22,
    borderSize: 1,
    hGap: 1,
    vGap: 1
}

const buttonArea = {
    cell_width: 35,
    cell_height: 35,
    borderSize: 1,
    hGap: 20,
}

const tableArea = {
    cell_width: 100,
    cell_height: 35,
    borderSize: 1
}

const selectionArea = {
    choice_width: 200,
    choice_height: 70,
    borderSize: 1,
    hGap: 40

}

const heightOfTableRow = tableArea.cell_height + tableArea.borderSize;
const widthOfTableRow = 4*(tableArea.cell_width) + 5 * tableArea.borderSize;

const buttonAreaWidth = 3 * buttonArea.cell_width + 6*buttonArea.borderSize + 2 * buttonArea.hGap;
const buttonAreaHeight = buttonArea.cell_height + 2*buttonArea.borderSize + 4;

const fieldAreaHeight = selectBoxes.expert.num_rows * (fieldArea.cell_height + fieldArea.borderSize)
    + (selectBoxes.expert.num_rows - 1) * fieldArea.vGap;

const selectionAreaHeight = selectionArea.choice_height + 2 * selectionArea.borderSize;
const selectionAreaWidth = 3 * (selectionArea.choice_width + 2 * selectionArea.borderSize) + 2 * selectionArea.hGap;

const bannerCellWidth = banner.bannerWidth/3;

const dimensions = {
    width: 990,
    height: banner.bannerHeight + messageArea.messageHeight + heightOfTableRow*11 + fieldAreaHeight + buttonAreaHeight,
    fieldAreaHeight: fieldAreaHeight,
    selectionAreaHeight: selectionAreaHeight,
    selectionAreaWidth: selectionAreaWidth,
    buttonAreaWidth: buttonAreaWidth,
    buttonAreaHeight: buttonAreaHeight,
    heightOfTableRow: heightOfTableRow,
    widthOfTableRow: widthOfTableRow,
    bannerCellWidth: bannerCellWidth,
    banner,
    messageArea,
    selectionArea,
    fieldArea,
    tableArea,
    buttonArea
}

export default dimensions;