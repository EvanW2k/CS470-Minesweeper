import selectBoxes from "../utils/selectBoxes";

// Timer functions
const createInitialTimer = () => {
    return {
        time: 0,
        isPaused: true
    };
}

const incrementTimer = (timerState) => {
    if (!timerState.isPaused)
        return {
          ...timerState,
          time: timerState.time+1
        };

    return timerState;
}

const timerPauseToggle = (timerState) => {

    return {
        ...timerState,
        isPaused: !timerState.isPaused
    };

}

// game history functions
const createInitialHistory = () => {
    return {
        games: [],
        gameCount: 0
    }
}
const addGameToHistory = (state, action) => {

    const {games, gameCount} = state;
    const {mode, time, isWin} = action;

    const newHistory = games.slice();

    newHistory.push({
        mode: mode,
        time: time,
        isWin: isWin
    });

    return {
        ...state,
        games: newHistory,
        gameCount: gameCount+1
    }
}

// Field functions
const createInitialState = (mode) => {
    // The field is a 2D array of Objects. Each Object holds the state of the "cell" that it represents.
    const fieldConditions = fieldMaker(mode);

    let field = Array(fieldConditions.num_rows)
        .fill(Array(fieldConditions.num_columns)
            .fill({color: 'lightgrey', mine: false, number: 0, hidden: true, flag: false})
        );

    return {
        field,
        fieldConditions: fieldConditions,
        haveWinner: false,
        foundMine: false,
        flagMode: false,
        doneFirstClick: false,
        flagsPlaced: 0,
        boxesLeft: -1
    };
}

const fieldMaker = (mode) => {

    let fieldConditions = {
        num_rows: 0,
        num_columns: 0,
        mine_percentage: 0
    };

    switch (mode) {
        case 0:
            fieldConditions.num_rows = selectBoxes.beginner.num_rows;
            fieldConditions.num_columns = selectBoxes.beginner.num_columns;
            fieldConditions.mine_percentage = selectBoxes.beginner.mine_percentage;
            break;
        case 1:
            fieldConditions.num_rows = selectBoxes.intermediate.num_rows;
            fieldConditions.num_columns = selectBoxes.intermediate.num_columns;
            fieldConditions.mine_percentage = selectBoxes.intermediate.mine_percentage;
            break;
        case 2:
            fieldConditions.num_rows = selectBoxes.expert.num_rows;
            fieldConditions.num_columns = selectBoxes.expert.num_columns;
            fieldConditions.mine_percentage = selectBoxes.expert.mine_percentage;
            break;
        default:
            console.error(`ERROR: Can't calculate dimensions with mode: ${mode}`);
            process.exit(1);
    }

    return fieldConditions;
};

const unHideMines = (field) => {

    const newField = field.slice();

    for (let rowIdx = 0; rowIdx < field.length; ++rowIdx) {
        let curRow = newField[rowIdx].slice();  // create copy of row
        for (let colIdx = 0; colIdx < field[rowIdx].length; ++colIdx) {
            // reveal mine if there is a mine and no flag
            if (curRow[colIdx]['mine'] && !curRow[colIdx]['flag']) {
                curRow[colIdx] = {
                    ...curRow[colIdx],
                    color: selectBoxes.revealed.backgroundColor,
                    hidden: false
                }
            }
        }
        newField[rowIdx] = curRow;
    }

    return newField;
}
const unHideCells = (field, clickRowIdx, clickColIdx) => {
    let newField = field.slice();
    let boxesRevealed = 0;

    // in case of mine
    if (field[clickRowIdx][clickColIdx]['mine']) {

        // reveal all mines
       newField = unHideMines(field);

        // color clicked mine red
        let curRow = newField[clickRowIdx].slice();
        curRow[clickColIdx] = {
            ...curRow[clickColIdx],
            color: selectBoxes.foundMine.backgroundColor,
        }
        newField[clickRowIdx] = curRow;
    }

    // case clicked on number
    else if (field[clickRowIdx][clickColIdx]['number'] > 0) {
        let curRow = newField[clickRowIdx].slice();
        curRow[clickColIdx] = {
            ...curRow[clickColIdx],
            color: selectBoxes.revealed.backgroundColor,
            hidden: false
        }
        boxesRevealed++;

        newField[clickRowIdx] = curRow; // place new row
    }

    // case clicked on empty box
    else if (field[clickRowIdx][clickColIdx]['number'] === 0) {
        const stack = [{row: clickRowIdx, col: clickColIdx}];

        while (stack.length !== 0) {
            // pop top of stack
            const {row, col} = stack.pop();

            // look at adjacent cells adding empty ones to stack
            for (let rowIdx = row - 1; rowIdx <= row + 1; ++rowIdx) {

                // check row bounds
                if (0 <= rowIdx && rowIdx < field.length) {

                    let curRow = newField[rowIdx].slice();
                    for (let colIdx = col - 1; colIdx <= col + 1; ++colIdx) {

                        // check col bounds
                        if (0 <= colIdx && colIdx < field[rowIdx].length) {

                            // case of adjacent and hidden
                            if (curRow[colIdx]['hidden'] && !curRow[colIdx]['flag']) {

                                // push empty boxes on stack
                                if (curRow[colIdx]['number'] === 0)
                                    stack.push({row: rowIdx, col: colIdx});
                                // un hide all hidden adjacent cells
                                curRow[colIdx] = {
                                    ...newField[rowIdx][colIdx],
                                    hidden: false,
                                    color: selectBoxes.revealed.backgroundColor
                                }

                                boxesRevealed++;
                            }
                        }
                    }

                    newField[rowIdx] = curRow; // place new row
                }
            }

        }
    }

    return {newField, boxesRevealed};
}

const adjacentTo = (row1, col1, row2, col2) => {

    for (let curRow = row1 - 1; curRow <= row1 + 1; ++curRow) {
        for (let currCol = col1 - 1; currCol <= col1 + 1; ++currCol) {
            if (curRow === row2 && currCol === col2)
                return true;
        }
    }

    return false;
}
const placeMinesAndNums = (field, fieldConditions, clickRow = -1, clickCol = -1) => {
    const freshField = field.slice();
    const totalCells = fieldConditions.num_rows * fieldConditions.num_columns;
    const totalMines = Math.floor(fieldConditions.mine_percentage * totalCells);

    const numNonBombs = totalCells - totalMines;

    let placedMines = 0;

    while(placedMines < totalMines) {
        const randRow = Math.floor(Math.random() * fieldConditions.num_rows);
        const randCol = Math.floor(Math.random() * fieldConditions.num_columns);

        // place mine only if cell has no mine and it's adjacent to the first clicked cell
        if (!freshField[randRow][randCol].mine && !(adjacentTo(randRow, randCol, clickRow, clickCol))) {

            let curRow = freshField[randRow].slice();

            // populate object with mine
            curRow[randCol] = {
                ...field[randRow][randCol],
                mine: true,
            }
            placedMines++;

            freshField[randRow] = curRow;

            // populate 9 squares centered at mine with increment to number of mines
            for (let rowIdx = randRow - 1; rowIdx <= randRow + 1; ++rowIdx) {
                // check rowIdx is in bounds
                if (0 <= rowIdx && rowIdx < fieldConditions.num_rows) {
                    curRow = freshField[rowIdx].slice();  // create copy of row
                    for (let colIdx = randCol - 1; colIdx <= randCol + 1; ++colIdx) {
                        // check colIdx is in bounds
                        if (0 <= colIdx && colIdx < fieldConditions.num_columns) {
                            curRow[colIdx] = {
                                ...freshField[rowIdx][colIdx],
                                number: freshField[rowIdx][colIdx].number + 1
                            }
                        }
                    }
                    freshField[rowIdx] = curRow;  // place copy of row
                }
            }
        }
    }
    return {freshField, numNonBombs};
};

const integrateCellClick = (state, action) => {
    const { field, doneFirstClick, fieldConditions,
        haveWinner, foundMine, boxesLeft, flagMode} = state;

    const { rowIdx, colIdx} = action;


    // don't do anything if game is won or lost
    if (haveWinner)
        return state;
    if (foundMine)
        return state;

    // for first click in flag mode
    if (!doneFirstClick && flagMode) {
        console.log("HERE");

        const {freshField, numNonBombs} = placeMinesAndNums(field, fieldConditions, rowIdx, colIdx);
        const newField = freshField.slice();
        const curRow = newField[rowIdx].slice();

        curRow[colIdx] = {
            ...newField[rowIdx][colIdx],
            flag: true
        }

        newField[rowIdx] = curRow;

        return {
            ...state,
            field: newField,
            boxesLeft: numNonBombs,
            doneFirstClick: true,
            flagsPlaced: 1
        }
    }

    // for first click
    if (!doneFirstClick) {
        const {freshField, numNonBombs} = placeMinesAndNums(field, fieldConditions, rowIdx, colIdx);
        const {newField, boxesRevealed} = unHideCells(freshField, rowIdx, colIdx);

        const remainingBoxes = numNonBombs - boxesRevealed;
        const won = remainingBoxes === 0;

        return {
            ...state,
            field: newField,
            doneFirstClick: true,
            haveWinner: won,
            boxesLeft: remainingBoxes
        }
    }

    // if the cell has a flag, and you're not in flag mode do nothing
    if (field[rowIdx][colIdx]['flag'] && !flagMode)
        return state;

    // if in flagMode and the block is hidden toggle flag for the cell
    if (flagMode && field[rowIdx][colIdx]['hidden']) {
        const newField = field.slice();
        const curRow = newField[rowIdx].slice()

        // toggle flag
        curRow[colIdx] = {
            ...curRow[colIdx],
            flag: !curRow[colIdx].flag
        }

        newField[rowIdx] = curRow;

        // add change to field and dec/inc flag counter
        console.log(`Toggled flag at (${rowIdx}, ${colIdx})`);
        return {
            ...state,
            field: newField,
            flagsPlaced: curRow[colIdx].flag ? state.flagsPlaced+1 : state.flagsPlaced-1
        }
    }

    // for clicking unhidden block that is a mine
    if(!field[rowIdx][colIdx]['hidden'] && field[rowIdx][colIdx]['mine'] && !flagMode) {

        const newField = field.slice();
        // color clicked mine red
        let curRow = newField[rowIdx].slice();
        curRow[colIdx] = {
            ...curRow[colIdx],
            color: selectBoxes.foundMine.backgroundColor,
        }
        newField[rowIdx] = curRow;
        return{
            ...state,
            field: newField,
            foundMine: true,
        }
    }


    // clicking on hidden box that is not flag
    if (field[rowIdx][colIdx]['hidden']) {
        const {newField, boxesRevealed} = unHideCells(field, rowIdx, colIdx);
        const remainingBoxes = boxesLeft - boxesRevealed;
        if (field[rowIdx][colIdx]['mine'])
            return{
                ...state,
                field: newField,
                foundMine: true,
                boxesLeft: remainingBoxes
            }

        const won = remainingBoxes === 0.0;

        return{
            ...state,
            field: newField,
            haveWinner: won,
            boxesLeft: remainingBoxes
        }

    }


    return state;
}

// game button function
const integrateButtonClick = (state, button) => {

    const {field, foundMine,haveWinner, doneFirstClick, fieldConditions} = state;

    switch (button) {
        case 'flag':
            if (foundMine || haveWinner)
                return state;
            state.flagMode ? console.log('Exiting Flag Mode') : console.log('Entering Flag Mode');
            return {
                ...state,
                flagMode: !state.flagMode
            }
        case 'showMines':
            if (foundMine)
                return state;

            if (haveWinner) {
                const newField = unHideMines(field);
                return {
                    ...state,
                    field: newField,
                    doneFirstClick: true,
                }
            }

            // load a board if first click hasn't happened
            if (!doneFirstClick){
                console.log("mines:",  field);
                const {freshField, numNonBombs} = placeMinesAndNums(field, fieldConditions);
                const newField = unHideMines(freshField);
                return {
                    ...state,
                    field: newField,
                    boxesLeft: numNonBombs,
                    doneFirstClick: true
                }
            }

            const newField = unHideMines(field);

            return {
                ...state,
                field: newField,
            }

        case 'showAll':
            let unhiddenField = field.slice()
            // load a board if first click hasn't happened
            if (!doneFirstClick)
                unhiddenField = placeMinesAndNums(field, fieldConditions).freshField;

            for (let rowIdx = 0; rowIdx < field.length; ++rowIdx) {
                let curRow = unhiddenField[rowIdx].slice();  // create copy of row
                for (let colIdx = 0; colIdx < field[rowIdx].length; ++colIdx) {
                    // reveal each cell
                    curRow[colIdx] = {
                        ...curRow[colIdx],
                        color: selectBoxes.revealed.backgroundColor,
                        hidden: false
                    }
                }
                unhiddenField[rowIdx] = curRow;
            }

            // change field and change foundMine to true essentially ending game
            return {
                ...state,
                foundMine: true,
                field: unhiddenField
            }
        default:
            return state;
    }


}

function reducers(state, action) {
    if( state === undefined )
        return state;

    if (action.type === 'TIMER_INCREMENTED') {
        return incrementTimer(state);
    }

    if (action.type === 'CELL_CLICKED') {
        return integrateCellClick (state, action);
    }

    if (action.type === 'BUTTON_CLICKED') {
        return integrateButtonClick (state, action.button);
    }

    if (action.type === 'PAUSE_TOGGLED') {
        return timerPauseToggle(state);
    }

    if (action.type === 'RESET_TIMER') {
        return createInitialTimer();
    }

    if (action.type === 'ADD_TO_HISTORY') {
        return addGameToHistory(state, action);
    }

    return state;

}

export {
    reducers,
    createInitialState,
    createInitialTimer,
    createInitialHistory
};