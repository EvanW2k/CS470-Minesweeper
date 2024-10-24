import React, {Fragment} from "react";
import dimensions from "../utils/dimensions";
import {Grid} from "@mui/material";
import Box from "@mui/material/Box";
import selectBoxes from "../utils/selectBoxes";

import {click_on_button_action} from "./actions";

const ButtonCell = props => {

    const {button, onButtonClickCallback, flagMode} = props;

    let symbol = "";
    let color = 'white';
    let fontsize = "15px"

    switch (button) {
        case 'flag':
            symbol = "🚩";
            if (flagMode) {
                color = selectBoxes.flagMode.backgroundColor;
            }
            break;
        case 'showMines':
            symbol = "💣";
            break;
        case 'showAll':
            symbol = "🙂";
            break;
        default:
            console.error(`ERROR: Invalid button: ${button}`);
            process.exit(1);

    }



    return (
        <Box onClick={() => onButtonClickCallback() }
             sx={{
                 width: dimensions.buttonArea.cell_width,
                 height: dimensions.buttonArea.cell_height,
                 border: 1,
                 backgroundColor: color,
                 borderRadius: '5px',
                 display: "flex",
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: fontsize,
                 fontFamily: selectBoxes.font.font,

             }}
        >
            {symbol}
        </Box>
    )

};

const Buttons = props => {

    const {dispatch, flagMode} = props;

    const buttons = ['flag', 'showMines', 'showAll'];

    const onButtonClickCallback = (button) => {
        console.log(`button = ${button}`);
        dispatch(click_on_button_action(button));
    }

    return (
        <Fragment>
            <Box margin="auto"
                 sx={{
                     width: dimensions.buttonAreaWidth,
                     height: dimensions.buttonAreaHeight,
                     display: "flex",
                     mt: 4,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                     border: 0,
                 }}
            >
                <Grid container columns = {3}
                      sx={{
                          width: dimensions.buttonAreaWidth,
                          height: dimensions.buttonAreaHeight,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          border: 0,
                          gap: 2
                      }}
                >
                    {
                        // for some reason could only get buttons to center with xs = 0
                        buttons.map((button, buttonIdx) =>
                            <Grid item key={buttonIdx} xs={0}  >
                                <ButtonCell button={button} flagMode={flagMode}
                                            onButtonClickCallback={() => onButtonClickCallback(button)}/>
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
        </Fragment>
    )
}

export default Buttons;