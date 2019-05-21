import React from 'react';
import ReactDOM from 'react-dom';
import Main from './pages/Main';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#5f00ff", // Blue Purple rgb(95,0, 255)
			contrastText: "#000" // Black
		},
		secondary: {
			main: "#FF5B3F", // Orange rgb(255,91,63)
			contrastText: "#fff"
		}
	},
	typography: {
		// Sets the font throughout the application.  Requires using Material UI typography component.
		fontFamily: ["Proxima Nova Lt", "Nexa", "NexaHeavy", "Roboto"].join(",")
	}
});

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Main />
	</MuiThemeProvider>,
    document.getElementById('root')
);
