import React from 'react';
import SessionList from "../Patients/SessionList.jsx";
import Auth from "../../handlers/Auth";
import {Link} from "react-router";
import './css/Main.css';

class Index extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    Auth.isUserAuthenticated() ? (
                        <div>
                            <SessionList/>
                        </div>
                    ) : (
                        <div className="login-section">
                            <div className="loginAlert" style={{
                                'text-align': 'center',
                                'padding-left': '20px',
                                margin: '40px 0px 40px 0px'
                            }}><Link to={`/login`}>Click to login</Link>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Index;


