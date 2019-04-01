import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Link} from "react-router";
import "./css/Table.css";
import Auth from "../../handlers/Auth";
import moment from 'moment';

class SessionList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: false,
            hrStats: false,
            bpStats: false,
            loadDataByInterval: true,
            loadData: true,
            filter: {
                filter: {}
            },
            currentDate: moment().toISOString().slice(0, 10),
            startDate: moment().toISOString().slice(0, 10),
            currentPatientIndex: 0,
        };
        this.getData = this.getData.bind(this);
        this.loadDataByInterval = this.loadDataByInterval.bind(this);
        this.clearDataInterval = this.clearDataInterval.bind(this);
        this.changeStartDate = this.changeStartDate.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    getData(event) {
        //TODO use axios to make http request in the future
        // create an AJAX request
        const xhr = new XMLHttpRequest();
        // xhr.open('post', 'http://34.85.45.103:5010/api/sessions');
        let url = 'http://localhost:5010/api/sessions' + '?page_size=10&page_num=1';
        xhr.open('get', url);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Authorization', Auth.getToken());
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                // save the token and user data
                this.setState({
                    data: xhr.response.data,
                    bpStats: xhr.response.bp_stats,
                    hrStats: xhr.response.hr_stats,
                    open: false
                })
            } else {
                this.setState({
                    error: xhr.response.error
                });
            }
        });
        xhr.send();
    }

    loadDataByInterval() {
        this.setState({
            loadData: true
        });

        this.interval = setInterval(this.getData, 10000);
    }

    clearDataInterval() {
        this.setState({
            loadData: false
        });

        clearInterval(this.interval);
    }

    changeStartDate(date) {
        this.setState({
            startDate: date
        });
    }

    onOpenModal() {
        this.setState({
            open: true
        });
    };

    onCloseModal() {
        this.setState({open: false});
    };


    componentDidMount() {
        this.getData();
        // this.loadDataByInterval();
    }

    componentWillUnmount() {
        // this.clearDataInterval();
    }

    render() {
        if (this.state.data) {
            let listOfPatients = this.state.data.map((patient, index) =>
                <tr className="row100 body" key={patient.sessionID}>
                    <td scope="row link"><Link to={{
                        pathname: `/patients/${patient.patientID}/sessions/${patient.sessionID}`,
                        state: {
                            sessionID: patient.sessionID
                        }
                    }}>{patient.sessionID}</Link></td>
                    <td>{patient.patientID}</td>
                    <td>{patient.name}</td>
                    <td>{patient.ward}</td>
                    <td>{patient.IC}</td>
                    <td>{this.state.bpStats[index]}</td>
                    <td>{this.state.hrStats[index]}</td>
                    <td><Link to={`/sessions/${patient.sessionID}/edit`}><i className="fa fa-pencil edit-icon"></i></Link>
                    </td>
                </tr>
            );

            return (
                <div className="container">
                    <div className="patient-table">

                        {/*<div>*/}
                        {/*<h4 className="session-date">{this.state.currentDate}</h4>*/}
                        {/*<div className="start-date">*/}
                        {/*<p className="start-date-header">From</p>*/}
                        {/*<DatePicker*/}
                        {/*selected={moment(this.state.startDate)}*/}
                        {/*onChange={this.changeStartDate}*/}
                        {/*/>*/}
                        {/*</div>*/}
                        {/*<div className="start-date">*/}
                        {/*<p className="end-date-header">To</p>*/}
                        {/*<DatePicker*/}
                        {/*selected={moment(this.state.startDate)}*/}
                        {/*onChange={this.changeStartDate}*/}
                        {/*/>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        <table>
                            <thead>
                                <tr>
                                    <th className="col">Session</th>
                                    <th className="col">Patient ID</th>
                                    <th className="col">Name</th>
                                    <th className="col">Ward</th>
                                    <th className="col">In-charge</th>
                                    <th className="col">SPO2</th>
                                    <th className="col">Heart</th>
                                    <th className="col">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                            {listOfPatients}
                            </tbody>
                        </table>
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

export default SessionList;