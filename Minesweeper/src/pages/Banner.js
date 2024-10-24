import React, {Fragment, useEffect, useState, useReducer} from "react";
import Box from "@mui/material/Box"
import {Grid} from "@mui/material";

import dimensions from "../utils/dimensions";
import selectBoxes from "../utils/selectBoxes";

const getNumMines = (mode, flagsPlaced) => {
    switch (mode) {
        case 0:
            return (Math.floor(selectBoxes.beginner.mine_percentage *
                (selectBoxes.beginner.num_rows * selectBoxes.beginner.num_columns))-flagsPlaced).toString()
        case 1:
            return (Math.floor(selectBoxes.intermediate.mine_percentage *
                (selectBoxes.intermediate.num_rows * selectBoxes.intermediate.num_columns))-flagsPlaced).toString()
        case 2:
            return (Math.floor(selectBoxes.expert.mine_percentage *
                (selectBoxes.expert.num_rows * selectBoxes.expert.num_columns)) - flagsPlaced).toString()
        default:
            return "";
    }
}
const Timer = props => {

    const {time, mode} = props;

    // if on selection screen
    if (mode === undefined)
        return (<></>);


    const timeString = String(time).padStart(3, '0');

    return (
        <Box sx={{
            width: dimensions.bannerCellWidth,
            height: dimensions.banner.bannerHeight,
            border: 0,
            m: .1,
            padding: 0,
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            fontFamily: selectBoxes.font.font,

        }}>
            {timeString}
        </Box>
    )
}

const Elements = props => {

    const {numMines, time, mode} = props;
    const title = "Minesweeper";


    return (
        <Fragment>
            <Grid item xs={1}>
                <Box sx={{
                    width: dimensions.bannerCellWidth,
                    height: dimensions.banner.bannerHeight,
                    border: 0,
                    m: .1,
                    padding: 0,
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    fontFamily: selectBoxes.font.font,

                }}>
                    {numMines}
                </Box>
            </Grid>

            <Grid item xs={1}>
                <Box sx={{
                    width: dimensions.bannerCellWidth,
                    height: dimensions.banner.bannerHeight,
                    border: 0,
                    m: .1,
                    padding: 0,
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    fontFamily: selectBoxes.font.font,

                }}>
                    {title}
                </Box>
            </Grid>

            <Grid item xs={1}>
                <Timer time={time} mode={mode}/>
            </Grid>
        </Fragment>
    )
}


const Banner = props => {

    const {mode, flagsPlaced, timerState} = props;

    const numMines = getNumMines(mode, flagsPlaced);


    return (
        <Fragment>
            <Box  margin="auto"
                  sx={{
                      width: dimensions.banner.bannerWidth,
                      height: dimensions.banner.bannerHeight,
                      mt: 1,
                      borderBottom: '2px solid #000',
                      borderSize: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                  }}>
                <Grid container columns={3}
                      sx={{
                          width: dimensions.banner.bannerWidth,
                          height: dimensions.banner.bannerHeight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                      }}
                >
                    <Elements numMines={numMines} time={timerState.time} mode={mode}/>
                </Grid>
            </Box>
        </Fragment>
    );
}
export default Banner;