const click_on_cell_action = (clickRowIdx, clickColIdx) => {
    return {
        type: 'CELL_CLICKED',
        rowIdx: clickRowIdx,
        colIdx: clickColIdx
    }
}

const click_on_button_action = (button) => {
    return {
        type: 'BUTTON_CLICKED',
        button: button
    }
}

const reset_timer = () => {
    return {
        type: 'RESET_TIMER'
    }
}
const increment_timer = () => {
    return {
        type: 'TIMER_INCREMENTED',
    }
}

const timer_pause_toggle = () => {
    return{
        type: 'PAUSE_TOGGLED',
    }
}

const add_game_to_history = (mode, time, isWin) => {
    return {
        type: "ADD_TO_HISTORY",
        mode: mode,
        time: time,
        isWin: isWin
    }
}

export {
    click_on_cell_action,
    click_on_button_action,
    reset_timer,
    increment_timer,
    timer_pause_toggle,
    add_game_to_history
};