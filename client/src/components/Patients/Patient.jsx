import React from 'react';

class Patient extends React.Component {
    constructor(props) {
        super(props);
        // Declaring initial state
        this.state = {
            data: false,
            patientID: this.props.params.patientID
        };

    }

    componentDidMount(){

    }

    componentWillUnmount(){

    }

    render(){
        return (
            <div></div>
        )
    }
}

export default Patient;