import React, {Component} from 'react';
import PatientImage from '../../../static/assets/dist/img/kaising.png';

var Link = require('react-router-dom').Link;


/****************************  PatientCardComp  ******************************/

class PatientInfo extends React.Component {

    constructor(props) {
        super(props);
        // Declaring initial state
        this.state = {
            patientData: this.props.patientData
        };

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        let patient = this.state.patientData;
        return (
            <div className="sidebar content-box">
                <div className="patient-info">
                    <div className="patient-card"><img src="https://i.ibb.co/R0ZmH5w/kaising.png" alt="kaising" border="0" className="patient-image"/></div>
                    <h3 className="patient-name">{patient.fullName}</h3>
                    <p className="patient-address">{patient.patientID}</p>
                </div>
                <div className="patient-detail">
                    <div className="patient-age">
                        <h1 className="age-header">Age</h1><br/>
                        <p className="age"><span>22</span></p>
                    </div>
                    <div className="patient-height">
                        <h3 className="status">Height</h3>
                        <span className="height">150 cm</span><br/>
                        <h3 className="status">Weight</h3>
                        <span className="weight">56 kg</span>
                    </div>
                    <div className="patient-info-table col-ver-align">
                        <table className="table">
                            <tbody>
                            <tr>
                                <th>Last admitted</th>
                                <th className="tbl-data">22 Jan 2019</th>
                            </tr>
                            <tr>
                                <th>Last checked</th>
                                <th className="tbl-data">22 Jan 2019, 07:00 PM</th>
                            </tr>
                            <tr>
                                <th>Diagnosis</th>
                                <th className="tbl-data">Mild flu</th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }

}

export default PatientInfo;
