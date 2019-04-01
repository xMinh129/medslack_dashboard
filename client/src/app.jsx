import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes.js'
import {browserHistory, Router} from 'react-router';
import mainStyles from '../static/stylesheets/styles.css';
import extraStyles from '../static/stylesheets/visualisation.css';
import sectionStyles from '../static/stylesheets/section.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


ReactDOM.render(
    <MuiThemeProvider>
        <Router history={browserHistory} routes={routes}/>
    </MuiThemeProvider>,

    document.getElementById('root')
)