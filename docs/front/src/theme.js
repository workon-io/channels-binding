import { blue, green, yellow, red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

const custom = variant => props => {
    if (props.color && theme.palette[props.color]) {
        return theme.palette[props.color][variant]
    }
    return {}
}


const theme = createMuiTheme({
    palette: {
        secondary: {
            main: blue[500]
        },
        primary: {
            // main: indigo[700]
            main: "#2d2d2d" //indigo[700]
        },
        success: {
            main: green[500],
            light: green[200],
            dark: green[900]
        },
        info: {
            main: blue[500],
            light: blue[200],
            dark: blue[900]
        },
        warning: {
            main: yellow[500],
            light: yellow[200],
            dark: yellow[900]
        },
        error: {
            main: red[500],
            light: red[200],
            dark: red[900]
        },
        head: {
            main: '#fbfbfb' //'#f1f1f1' // '#fff8dc' //'#efefff'
        }
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        // fontFamily: [
        //     '"Lato"',
        //     'sans-serif'
        // ].join(',')
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    overrides: {
        MuiInputLabel: {
            shrink: {
                transform: 'translate(0, 10.5px) scale(0.75)'
            }
        },
        MuiButton: {
            root: {
                // color: custom('contrastText'),
                // backgroundColor: custom('main'),
                // "&:hover": {
                //     backgroundColor: custom('dark')
                // }
            }
        },
        MuiChip: {
            root: {
                // color: custom('contrastText'),
                // backgroundColor: custom('main'),
                // "&:hover": {
                //     backgroundColor: custom('dark')
                // }
            }
        },
        MuiAvatar: {
            root: {
                // backgroundColor: custom('light'),
            }
        },
        // MuiPaginationItem: {
        //     root: {
        //         background: 'white',
        //         color: 'white'
        //     }
        // }
    }
    // typography: {
    //     // Use the system font instead of the default Roboto font.
    //     fontFamily: [
    //         '"Lato"',
    //         'sans-serif'
    //     ].join(',')
    // }
});

export default theme