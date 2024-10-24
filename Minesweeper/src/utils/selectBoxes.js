const selectBoxes = {
    beginner: {
        backgroundColor: 'white',
        text: 'Beginner',
        num_rows: 9,
        num_columns: 9,
        mine_percentage: .128
    },

    intermediate: {
        backgroundColor: 'white',
        text: 'Intermediate',
        num_rows: 16,
        num_columns: 16,
        mine_percentage: .157
    },

    expert: {
        backgroundColor: 'white',
        text: 'Expert',
        num_rows: 16,
        num_columns: 30,
        mine_percentage: .207
    },

    hidden: {
        borderColor: '#bdbdbd'
    },

    revealed: {
        backgroundColor: 'white'
    },

    foundMine: {
        backgroundColor: 'red'
    },

    flagMode: {
        backgroundColor: 'lightgreen'
    },

    usedButton: {
        backgroundColor: 'lightgrey'
    },

    font: {
        font: "Georgia sans-serif"
    }
}

export default selectBoxes;