import logo from './logo.svg';
import './App.css';

import Banner from "./pages/Banner";    // banner page
import Message from "./pages/Message"    // message page
import Field from "./pages/Field";  // game page
import Selection from "./pages/Selection";  // pregame page
import Table from "./pages/Table";     // table page

import {Fragment, useEffect, useReducer, useState} from "react";
import Box from "@mui/material/Box";

import dimensions from "./utils/dimensions";
import {createInitialHistory, createInitialTimer, reducers} from "./pages/reducers";

function App() {

    // mode, determines which dimensions to use for the field
    const [mode, setMode] = useState(undefined);

    // flagsPlaced, used to display how many mines are left based on how player found, correctly or not
    const [flagsPlaced, setFlagsPlaced] = useState(0);

    // timer reducer, determines the state to be used for display. Field manipulates it, banner displays it
    const [timerState, dispatchTimer] = useReducer(reducers, undefined, createInitialTimer);

    const [isWin, setWin] = useState(undefined);

    const [gameHistory, dispatchGameHistory] = useReducer(reducers, undefined, createInitialHistory)

    // reset mode when gamehistory is updated
    useEffect(() => {
        setMode(undefined);
    }, [gameHistory]);

    return (
        <Fragment>
            <Box
                sx={{
                    width: dimensions.width,
                    height: dimensions.height,
                    alignItems: "center",
                    margin: "auto"
                }}>
                    <Banner mode={mode} flagsPlaced={flagsPlaced} timerState={timerState}/>
                    <Message mode={mode} isWin={isWin} setWin={setWin} timerState={timerState} dispatchTimer={dispatchTimer}
                             dispatchGameHistory={dispatchGameHistory}/>

                    {mode === undefined ? (<Selection setMode={setMode}/>) :
                        (<Field mode={mode} setFlagsPlaced={setFlagsPlaced}
                                dispatchTimer={dispatchTimer} timerState={timerState}
                            setWin={setWin}/>)}

                    <Table gameHistory={gameHistory}/>
            </Box>
        </Fragment>
    );
}

export default App;
