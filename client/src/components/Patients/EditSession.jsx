import React from "react";
import {ReactDatez} from 'react-datez';
import 'react-datez/dist/css/react-datez.css';
import Auth from "../../handlers/Auth";
import './css/EditSession.css';
import {browserHistory} from 'react-router';
import moment from 'moment';

class EditSession extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            sessionID: this.props.params.sessionID,
            error: false
        };
        this.getData = this.getData.bind(this);
        this.sendData = this.sendData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changeDate = this.changeDate.bind(this);
    }

    getData() {

        // Get session data
        const xhr_patientData = new XMLHttpRequest();
        const url = 'http://localhost:5010/api/session?session_ID=' + this.props.params.sessionID;
        xhr_patientData.open('GET', url, true);
        xhr_patientData.setRequestHeader('Content-type', 'application/json');
        xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
        xhr_patientData.responseType = 'json';
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                let data = xhr_patientData.response;
                this.setState({
                    data: {
                        'patientID': data.data.patientID,
                        'sessionID': data.data.sessionID,
                        'dateTime': new Date(moment(data.data.dateTime).toDate()),
                        'ward': data.data.ward,
                        'IC': data.data.IC,
                        'name': data.data.name
                    }
                })
            } else {
                this.setState({
                    error: xhr_patientData.response.error
                });
            }
        });
        xhr_patientData.send();
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
        const payload = {
            'filter': {
                'sessionID': this.props.params.sessionID
            },
            'data': {
                "$set": this.state.data
            }
        }

        // Get patient data
        const xhr_patientData = new XMLHttpRequest();
        const url = 'http://localhost:5010/api/session/update';
        xhr_patientData.open('PUT', url);
        xhr_patientData.setRequestHeader('Content-type', 'application/json');
        xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
        xhr_patientData.responseType = 'json';
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                browserHistory.push('/');
            } else {
                this.setState({
                    error: 500
                });
            }
        });
        xhr_patientData.send(JSON.stringify(payload));

    }


    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
    }

    render() {
        if (this.state.data) {
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
                                <input type="text" className="form-control" id="formInput113" name="patientID"
                                       onChange={this.onChange}
                                       value={this.state.data.patientID} required/>
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
                                <label className="control-label">Person In-charge
                                    <span>*</span>
                                </label>
                                <input type="text" className="form-control" id="formInput113" name="IC"
                                       onChange={this.onChange}
                                       value={this.state.data.IC} required/>
                            </div>

                            <div className="form-group">
                                <label className="control-label date-label">Date
                                    <span>*</span>
                                </label>

                            <ReactDatez position="right" name="dateInput" handleChange={this.changeDate}
                                        value={this.state.data.dateTime} required/>
                            </div>
                        </form>
                        <button className="edit-button" onClick={this.sendData}>Edit
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
                <div></div>
            )
        }

    }
}

export default EditSession;