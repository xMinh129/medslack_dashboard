import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {browserHistory} from 'react-router';
import Auth from '../../handlers/Auth.js';
import "./css/Form.css";
import {hashHistory} from 'react-router';

class LogIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                'userID': '',
                'password': ''
            },
            isSignIn: false,
            error: false
        };
        this.getAuth = this.getAuth.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    getAuth(event) {
        event.preventDefault();

        let postData = {
            'userID': this.state.user.userID,
            'password': this.state.user.password
        }

        //TODO use axios to make http request in the future

        // create an AJAX request
        const xhr = new XMLHttpRequest();
        // xhr.open('post', 'http://34.85.45.103:5010/api/users/login');
        xhr.open('post', 'http://localhost:5010/api/users/login');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('role', this.state.user.role);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200 && xhr.response.success) {

                this.setState({
                    error: false
                });
                // save the token and user data
                Auth.authenticateUser(xhr.response.user, xhr.response.token);
                // change the current URL to /

                if (this.props.location.pathname === '/login') {
                    browserHistory.push('/');
                }
                else {
                    hashHistory.goBack();
                }
            }
            else if (xhr.response.error) {
                this.setState({
                    error: xhr.response.error
                })
            }
            else {
                this.setState({
                    error: 'Unexpected error. Check server'
                });
            }
        });
        xhr.send(JSON.stringify(postData));
    }

    onChange(event) {
        event.preventDefault();
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        this.setState({
            user: user
        });
    }


    componentDidMount() {
    }

    componentWillMount() {
    }

    render() {

        return (
            <div className="login-form">
                <div className="login-box">
                    <h2 style={{
                        'text-align': 'center',
                        'padding-left': '20px',
                        'color': 'rgb(255, 90, 95)',
                        margin: '40px 0px 40px 0px'
                    }}>Please log in</h2>


                    <form className="email-login" style={{'padding-left': '80px'}}>
                        <div className="field-line">
                            <TextField className="u-form-group"
                                       floatingLabelText="User ID"
                                       name="userID"
                                       value={this.state.user.userID}
                                       onChange={this.onChange}
                            />
                        </div>

                        <div className="field-line">
                            <TextField className="u-form-group"
                                       floatingLabelText="Password"
                                       type="password"
                                       name="password"
                                       value={this.state.user.password}
                                       onChange={this.onChange}
                            />
                        </div>

                        <div className="u-form-group">
                            <button type="button" onClick={this.getAuth}>Log in</button>
                        </div>

                    </form>

                    {this.state.error ? (
                        <div style={{color: 'red'}}>{this.state.error}</div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        )
    }
}

export default LogIn;