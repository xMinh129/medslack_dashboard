import React from "react";
import {ReactDatez} from 'react-datez';
import 'react-datez/dist/css/react-datez.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './css/EditSession.css';
import {browserHistory} from 'react-router';
import statsController from "../../controllers/statsController";
import staffController from "../../controllers/staffController";
import patientController from "../../controllers/patientController.js"

class EditSession extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            sessionID: this.props.params.sessionID,
            error: false,
            staffs: [],
            patients: [],
            patientNames: []
        };
        this.getStaffs = this.getStaffs.bind(this);
        this.getPatients = this.getPatients.bind(this);
        this.getData = this.getData.bind(this);
        this.sendData = this.sendData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.onSelectStaffDropDown = this.onSelectStaffDropDown.bind(this);
        this.onSelectPatientDropDown = this.onSelectPatientDropDown.bind(this);
    }

    getData() {
        let state = this;
        statsController.getSession(this.state.sessionID)
            .then(function (data) {
                state.setState({
                    data: data.data
                })
            })
            .catch(function (err) {
                state.setState({
                    err: err.data
                })
            })
    }

    onChange(event) {
        event.preventDefault();
        const field = event.target.name;
        const data = this.state.data;
        data[field] = event.target.value;
        this.setState({
            data: data
        });
    }

    changeDate(date) {
        const data = this.state.data;
        data['dateTime'] = date;
        this.setState({data: data})
    }

    sendData() {
        let state = this;
        const payload = {
            'filter': {
                'sessionID': this.props.params.sessionID
            },
            'data': {
                "$set": this.state.data
            }
        };

        statsController.updateSession(payload)
            .then(function () {
                browserHistory.push('/');
            })
            .catch(function (err) {
                state.setState({
                    err: err.data
                })
            });
    }

    getStaffs() {
        let state = this;
        staffController.getStaffs()
            .then(function (data) {
                let staffs = [];
                data.data.forEach(function(i){
                    staffs.push(i['fullName'])
                })
                state.setState({
                    staffs: staffs
                })
            })
            .catch(function (err) {
                state.setState({
                    err: err.data
                })
            })
    }

    getPatients() {
        let state = this;
        patientController.getPatients()
            .then(function (data) {
                let patients = [];
                let patientNames = [];
                console.log(data)
                data.data.forEach(function(i){
                    patients.push(i['patientID']);
                    patientNames.push(i['fullName'])
                })
                state.setState({
                    patients: patients,
                    patientNames: patientNames
                })
            })
            .catch(function (err) {
                state.setState({
                    err: err.data
                })
            })
    }



    onSelectStaffDropDown(e) {
        const data = this.state.data;
        data['IC'] = e.value;
        this.setState({
            data: data
        });

    }

    onSelectPatientDropDown(e) {
        const data = this.state.data;
        data['patientID'] = e.value;
        data['name'] = this.state.patientNames[this.state.patients.indexOf(e.value)];
        this.setState({
            data: data
        });

    }


    componentDidMount() {
        this.getStaffs();
        this.getPatients();
        this.getData()
    }

    componentWillUnmount() {
    }

    render() {
        if (this.state.data && this.state.staffs.length > 0) {
            return (
                <div>
                    <div className="container">
                        <h1 className="edit-session-title">Edit Session</h1>
                        <form>
                            <div className="form-group">
                                <label className="control-label">Session ID
                                    <span>*</span>
                                </label>
                                <input type="text" className="form-control" id="formInput113" name="sessionID"
                                       onChange={this.onChange}
                                       value={this.state.data.sessionID} required/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Patient ID
                                    <span>*</span>
                                </label>
                                <Dropdown options={this.state.patients} onChange={this.onSelectPatientDropDown}
                                          value={this.state.data.patientID}
                                          placeholder="Select an option" required/>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Patient Name
                                    <span>*</span>
                                </label>
                                <input type="text" className="form-control" id="formInput113" name="name"
                                       onChange={this.onChange}
                                       value={this.state.data.name} required/>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Ward
                                    <span>*</span>
                                </label>
                                <input type="text" className="form-control" id="formInput113" name="ward"
                                       onChange={this.onChange}
                                       value={this.state.data.ward} required/>
                            </div>

                            <div className="form-group">
                                <label className="control-label">In-charge
                                    <span>*</span>
                                </label>
                                <Dropdown options={this.state.staffs} onChange={this.onSelectStaffDropDown}
                                          value={this.state.data.IC}
                                          placeholder="Select an option" required/>

                            </div>

                            <div className="form-group">
                                <label className="control-label">Diagnosis
                                    <span>*</span>
                                </label>
                                <input type="text" className="form-control" id="formInput113" name="diagnosis"
                                       onChange={this.onChange}
                                       value={this.state.data.diagnosis}/>
                            </div>

                            <div className="form-group">
                                <label className="control-label date-label">Date
                                    <span>*</span>
                                </label>

                                <ReactDatez position="right" name="dateInput" handleChange={this.changeDate}
                                            value={this.state.data.dateTime} required/>
                            </div>

                            <div className="form-group">
                                <label className="control-label date-label">Time
                                    <span>*</span>
                                </label>

                                <p className="change-time">{new Date(this.state.data.dateTime).toLocaleTimeString()}</p>
                            </div>
                        </form>
                        <button className="edit-button" onClick={this.sendData}>Update
                        </button>

                        {this.state.error ? (
                            <div style={{color: 'red', marginTop: '40px'}}>Update not successful</div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>Loading</div>
            )
        }

    }
}

export default EditSession;