import React from 'react';
import Header from "./Header.jsx";
import "./css/Main.css";


class Base extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {children} = this.props;

        return (
            <div>
                <Header location={this.props.location.pathname}/>

                <div id="content">
                    {children}
                </div>
            </div>
        )
    }
}

export default Base;