import React, {Fragment, useEffect, useState, useReducer} from "react";
import Box from "@mui/material/Box"
import {Grid} from "@mui/material";

import dimensions from "../utils/dimensions";

import selectBoxes from "../utils/selectBoxes";



const Mode = (props) => {

    const {modeContent, onModeClick} = props;



    return (
        <Box onClick={() => onModeClick() }
                    sx={{
                        width: dimensions.selectionArea.choice_width,
                        height: dimensions.selectionArea.choice_height,
                        border: 1,
                        backgroundColor: modeContent.backgroundColor,
                        m: .1,
                        padding: 0,
                        borderRadius: '40px',
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '30px',
                        fontFamily: 'Georgia',

                    }}>
            {modeContent.text}
        </Box>
    )
}



const Selection = props => {
    const {setMode} = props;
    const modeBoxes = [selectBoxes.beginner, selectBoxes.intermediate, selectBoxes.expert];

    const onModeClick = modeIdx => {
        console.log(`mode num: ${modeIdx}`);
        setMode(modeIdx);
    };

    return (
        <Fragment>
            <Box  margin="auto"
                  sx={{
                      width: dimensions.selectionAreaWidth,
                      height: dimensions.selectionAreaHeight,
                      mt: 1,
                      mb: 7,
                      border: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                  }}>
                <Grid container columns={3}
                      sx={{
                          width: dimensions.selectionAreaWidth,
                          height: dimensions.selectionAreaHeight,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",

                      }}
                >
                    {
                        modeBoxes.map((modeContent, modeIdx) =>
                            <Grid item key={modeIdx} xs={0}>
                                <Mode modeContent={modeContent} onModeClick={() => onModeClick(modeIdx)}  />
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
        </Fragment>
    );
}
export default Selection;