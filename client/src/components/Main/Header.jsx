import React from "react";
import Auth from "../../handlers/Auth";
import {Link} from 'react-router';
import "./css/Header.css";

class Header extends React.Component {

    constructor(props){
        super(props)
    }


    render(){

        return (
            <div className="header">
                <a href="" className="logo" style={{'color': 'white'}}>MedSlack</a>
                <input className="menu-btn" type="checkbox" id="menu-btn"/>
                <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>

                {
                    Auth.isUserAuthenticated() ? (
                        <ul className="menu">
                            <li><Link to="/">Home</Link></li>
                            {
                                Auth.isAdmin() ? (
                                    <li><Link to="/">Admin</Link></li>
                                ) : (
                                    <div></div>
                                )
                            }
                            <li><Link to={{pathname: '/logout'}}>Log Out </Link></li>
                        </ul>
                    ) : (
                        <ul className="menu">
                            <li><Link to={{pathname: '/login', state: {from: this.props.location}}}>Log In</Link></li>
                            {/*<li><Link to="/">Sign Up </Link></li>*/}
                        </ul>
                    )

                }

            </div>
        )
    }
}

export default Header;