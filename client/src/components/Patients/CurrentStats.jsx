import React, {Component, PropTypes} from 'react';
import '../Patients/css/CurrentData.css';


/****************************  CurrentDataComp  ******************************/

class CurrentStats extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        let currentData = this.props.data;
        return (
            <div className="current-data-section">
                <div className="current-data">
                    <p>{currentData}</p>
                </div>
            </div>
        )
    }
}


export default CurrentStats;
