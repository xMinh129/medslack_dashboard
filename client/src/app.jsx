import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes.js'
import {browserHistory, Router} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


ReactDOM.render(
    <MuiThemeProvider>
        <Router history={browserHistory} routes={routes}/>
    </MuiThemeProvider>,

    document.getElementById('root')
)