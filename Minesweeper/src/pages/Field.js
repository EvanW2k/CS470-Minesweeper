import React, {Fragment, useEffect, useState, useReducer} from "react";
import Box from "@mui/material/Box"
import {Grid} from "@mui/material";

import Buttons from "./Buttons";

import dimensions from "../utils/dimensions";
import selectBoxes from "../utils/selectBoxes";

import { reducers, createInitialState } from './reducers';
import {click_on_cell_action, increment_timer, timer_pause_toggle} from './actions';


const getWidthField = (mode) => {
    const num_cols = getGameDim(mode).num_columns;

    return num_cols * (dimensions.fieldArea.cell_width + 2*dimensions.fieldArea.borderSize)
        + (num_cols - 1) * dimensions.fieldArea.hGap;

}
const getHeightField = (mode) => {
    const num_rows = getGameDim(mode).num_rows;

    return num_rows * (dimensions.fieldArea.cell_height + 2*dimensions.fieldArea.borderSize)
        + (num_rows - 1) * dimensions.fieldArea.vGap;

}
const getGameDim = (mode) => {

    const fieldDims = {
        num_rows: 0,
        num_columns: 0
    }

    switch (mode) {
        case 0:
            fieldDims.num_rows = selectBoxes.beginner.num_rows;
            fieldDims.num_columns = selectBoxes.beginner.num_columns;
            break;
        case 1:
            fieldDims.num_rows = selectBoxes.intermediate.num_rows;
            fieldDims.num_columns = selectBoxes.intermediate.num_columns;
            break;
        case 2:
            fieldDims.num_rows = selectBoxes.expert.num_rows;
            fieldDims.num_columns = selectBoxes.expert.num_columns;
            break;
        default:
            console.error(`ERROR: Can't calculate dimensions with mode: ${mode}`);
            process.exit(1);
    }

    return fieldDims;
}


const Cell = props => {

    const {cellContent, onFieldClickCallback} = props;

    let symbol = "";
    let color = 'black';
    let fontsize = '20px';

    if (!cellContent.hidden){
        if (cellContent.mine){
            cellContent.color === 'white' ? symbol = "💣" : symbol = "💥";
            fontsize = '15px';
        }
        else if (cellContent.number > 0) {
            symbol = cellContent.number.toString();
            switch (cellContent.number) {
                case (1):
                    color = 'blue';
                    break;
                case (2):
                    color = 'green';
                    break;
                case (3):
                    color = 'red';
                    break;
                case (4):
                    color = 'darkblue';
                    break;
                case (5):
                    color = 'darkred';
                    break;
                case (6):
                    color = 'darkcyan';
                    break;
                case (7):
                    color = 'black';
                    break;
                default:
                    color = 'lightgrey';
            }
        }
    }
    else if (cellContent.flag) {
        symbol = "🚩";
        fontsize = '15px';
    }

    return (
        <Box  onClick={() => onFieldClickCallback() }
              sx={{
                  width: dimensions.fieldArea.cell_width,
                  height: dimensions.fieldArea.cell_height,
                  border: 1,
                  backgroundColor: cellContent.color,
                  m: .1,
                  padding: 0,
                  display: "flex",
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: fontsize,
                  fontFamily: selectBoxes.font.font,
                  fontWeight: 'bold',
                  color: color,
                  borderColor: 'black',

              }}
        >
            {symbol}
        </Box>
    )
}

const Row = props => {

    const {row, mode, onFieldClickCallback} = props;

    return (
        <Fragment>
            <Grid container columns={getGameDim(mode).num_columns}>
                {
                    row.map((cellContent, colIdx) =>
                        <Grid item xs={1} key={colIdx}>
                            <Cell cellContent={cellContent} onFieldClickCallback={() => onFieldClickCallback(colIdx)} />
                        </Grid>
                    )
                }
            </Grid>
        </Fragment>

    )
}


const Field = props => {
    const {mode, setWin, setFlagsPlaced, dispatchTimer, timerState} = props;
    const [state, dispatch] = useReducer(reducers, mode, createInitialState);
    const {field} = state;


    const onFieldClickCallback = (rowIdx, colIdx) => {
        dispatch(click_on_cell_action(rowIdx, colIdx));
        console.log(`idx:(${rowIdx}, ${colIdx})`);
    }

    // for changing the Number of mines the player hasn't found
    useEffect(() => {
        setFlagsPlaced(state.flagsPlaced);
    }, [setFlagsPlaced, state.flagsPlaced]);

    // timer increments
    useEffect(() => {
        // stop incrementing if time reaches 999
        if (timerState.time === 999)
            return;
        if (!timerState.isPaused) {
            // every second increment time
            const timeoutID = setTimeout(() =>  {
                dispatchTimer(increment_timer());
            }, 1000);

            return () => clearTimeout(timeoutID);
        }
    }, [dispatchTimer, timerState.time, timerState.isPaused]);

    // timer reset and stop
    useEffect(() => {

        if (state.haveWinner)
            setWin(true);
        else if (state.foundMine)
            setWin(false);

        if (!state.doneFirstClick && (state.haveWinner || state.foundMine)){
            return;
        }

        dispatchTimer(timer_pause_toggle());

    }, [dispatchTimer, state.doneFirstClick, state.haveWinner, state.foundMine]);



    const widthField = getWidthField(mode);
    const heightField = getHeightField(mode);

    return (
        <Fragment>
            <Box  margin="auto"
                  sx={{
                      width: widthField,
                      height: heightField,
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: 0
                  }}>
                <Grid container columns={1}
                      sx={{
                          width: widthField,
                          height: heightField,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                      }}
                >
                    {
                        field.map((row, rowIdx) =>
                            <Grid item key={rowIdx} xs={1}>
                                <Row row={row} mode={mode} onFieldClickCallback={(colIdx) => onFieldClickCallback(rowIdx, colIdx)} />
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
            <Buttons dispatch={dispatch} flagMode={state.flagMode}/>
        </Fragment>


    );
};
export default Field;