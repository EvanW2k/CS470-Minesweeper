import React, {Fragment, useEffect, useState, useReducer} from "react";
import Box from "@mui/material/Box"
import {Grid} from "@mui/material";
import dimensions from "../utils/dimensions";
import {add_game_to_history, reset_timer} from "./actions";
import selectBoxes from "../utils/selectBoxes";


const Row = props => {

    const {onReplayClick, timerPause, isWin} = props;

    let isClickEnabled = true;
    let color = 'red';

    let leftMessage = "You lost...";
    let rightMessage = "Play Again";

    if (isWin) {
        leftMessage = "You Won!!!";
        color = 'green';
    }
    else if (isWin === undefined) {
        leftMessage = "Give up?";
        rightMessage = "Reset";
        color = 'black';
        if (timerPause) {
            leftMessage = "";
            rightMessage = "";
            isClickEnabled = false;
        }
    }

    return (
        <Fragment>
            <Box sx={{
                width:dimensions.messageArea.messageWidth/2,
                height:dimensions.messageArea.messageHeight,
                border: 0,
                m: .1,
                padding: 0,
                display: "flex",
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '25px',
                fontFamily: selectBoxes.font.font,
                color: color,
                fonWeight: 'bold'
            }}>

                {leftMessage}

            </Box>
            <Box
                sx={{
                    width:dimensions.messageArea.messageWidth/2,
                    height:dimensions.messageArea.messageHeight,
                    border: 0,
                    m: .1,
                    padding: 0,
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Box onClick={isClickEnabled ? () => onReplayClick() : null}
                    sx={{
                        width:dimensions.messageArea.buttonWidth,
                        height:dimensions.messageArea.buttonHeight,
                        border: isClickEnabled ? 1 : 0,
                        borderRadius:'15px',
                        m: .1,
                        padding: 0,
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '25px',
                        fontFamily: selectBoxes.font.font,
                    }}>

                        {rightMessage}

                </Box>
            </Box>
        </Fragment>
    )
}

const Message = props => {

    const {mode, isWin, setWin, timerState, dispatchTimer, dispatchGameHistory} = props;

    const onReplayClick = () => {
        console.log('Starting new game');
            //add a won game to table
            if (isWin) {
                dispatchGameHistory(add_game_to_history(mode, timerState.time, true));
            }
            // add a lost game to table
            else {
                dispatchGameHistory(add_game_to_history(mode, timerState.time, false));
            }

            setWin(undefined);
            dispatchTimer(reset_timer());
    };


    return (
        <Fragment>
            <Box margin="auto"
                 sx={{
                     width: dimensions.messageArea.messageWidth+10,
                     height: dimensions.messageArea.messageHeight,
                     mt: 1,
                     alignItems: "center",
                     justifyContent: "center",
                     border: 0,
                 }}>
                <Grid container columns = {2}
                      sx={{
                          width: dimensions.messageArea.messageWidth+10,
                          height: dimensions.messageArea.messageHeight,
                          border: 0,
                          alignItems: "center",
                          justifyContent: "center",
                      }}
                >
                    {
                        <Row isWin={isWin} timerPause={timerState.isPaused} onReplayClick={() => onReplayClick()}/>
                    }
                </Grid>
            </Box>
        </Fragment>
    );
}


export default Message;