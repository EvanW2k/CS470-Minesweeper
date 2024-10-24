import React, {Fragment, useEffect, useState, useReducer} from "react";
import Box from "@mui/material/Box"
import {Grid} from "@mui/material";
import dimensions from "../utils/dimensions";
import selectBoxes from "../utils/selectBoxes";

const height = (length) => {
    return dimensions.heightOfTableRow * (length + 1);
}

const Cell = props => {

    const {type, value} = props;

    let message = "";

    switch (type) {
        case(0):
            // display game number
            message = value.toString();
            break;
        case(1):
            // output letter for mode
            switch (value) {
                case(0):
                    message = "B";
                    break;
                case(1):
                    message = "I";
                    break;
                default:
                    message = "E";
            }
            break;
        case(2):
            // display padded time
            message = String(value).padStart(3, '0');
            break;
        default:
            // display win or loss
            value ? (message = "Win") : (message = "Loss");
    }

    return (
        <Box sx={{
            width:dimensions.tableArea.cell_width,
            height:dimensions.tableArea.cell_height,
            border: 1,
            borderTop: 0,
            padding: 0,
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontFamily: selectBoxes.font.font,
        }}>
            {message}
        </Box>
    )
}

const Row = props => {
    const {game, gameCount, gameIdx} = props;

    const gameNumber = gameCount - gameIdx;

    return (
        <Fragment>
            <Grid container columns = {4}>
                <Grid item xs={1}>
                    <Cell type={0} value={gameNumber}/>
                </Grid>
                <Grid item xs={1}>
                    <Cell type={1} value={game.mode}/>
                </Grid>
                <Grid item xs={1}>
                    <Cell type={2} value={game.time}/>
                </Grid>
                <Grid item xs={1}>
                    <Cell type={3} value={game.isWin}/>
                </Grid>
            </Grid>
        </Fragment>
    )
}

const NameRow = props => {
    return (
        <Fragment>
            <Grid container columns = {4}>
                <Grid item xs={1}>
                    <Box sx={{
                        width:dimensions.tableArea.cell_width,
                        height:dimensions.tableArea.cell_height,
                        border: 1,
                        padding: 0,
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontFamily: selectBoxes.font.font,
                    }}>
                        {"Game #"}
                    </Box>
                </Grid>

                <Grid item xs={1}>
                    <Box sx={{
                        width:dimensions.tableArea.cell_width,
                        height:dimensions.tableArea.cell_height,
                        border: 1,
                        padding: 0,
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontFamily: selectBoxes.font.font,
                    }}>
                        {"Mode"}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box sx={{
                        width:dimensions.tableArea.cell_width,
                        height:dimensions.tableArea.cell_height,
                        border: 1,
                        padding: 0,
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontFamily: selectBoxes.font.font,
                    }}>
                        {"Time"}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box sx={{
                        width:dimensions.tableArea.cell_width,
                        height:dimensions.tableArea.cell_height,
                        border: 1,
                        padding: 0,
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontFamily: selectBoxes.font.font,
                    }}>
                        {"Result"}
                    </Box>
                </Grid>
            </Grid>
        </Fragment>
    )
}

const Table = props => {

    const {gameHistory} = props;

    // display nothing if no games have been played
    if (gameHistory.games.slice(-10).length === 0)
        return(
            <></>
        )

    return (
        <Fragment>
            <Box margin="auto"
                 sx={{
                     width: dimensions.widthOfTableRow,
                     height: height(10),
                     mt: 3,
                     alignItems: "center",
                     justifyContent: "center",
                     border: 0,
                 }}>
                <Grid container columns = {1}
                      sx={{
                          width: dimensions.widthOfTableRow-1,
                          height: height(gameHistory.games.slice(-10).length),
                          border: 0,
                      }}
                >
                    <NameRow/>
                    {
                        gameHistory.games.slice(-10).reverse().map((game, gameIdx) =>
                            <Grid item key={gameIdx} xs ={1}>
                                <Row game={game} gameCount={gameHistory.gameCount} gameIdx={gameIdx}/>
                            </Grid>

                        )
                    }
                </Grid>
            </Box>
        </Fragment>
    )
}
export default Table;