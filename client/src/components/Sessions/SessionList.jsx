import React from "react";
import {Link} from "react-router";
import "./css/Table.css";
import moment from 'moment';
import statsController from "../../controllers/statsController";
import patientController from "../../controllers/patientController";
import Auth from "../../handlers/Auth";
import FilterClickable from "../Common/FilterClickable.jsx";
import Loading from "../common/Loading.jsx";


class SessionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            allPatients: [],
            patients: [],
            sessionData: [],
            allSessions: [],
            hrStats: false,
            spo2Stats: false,
            loadDataByInterval: true,
            loadData: true,
            filter: {
                filter: {}
            },
            currentDate: moment().format('DD-MM-YYYY'),
            startDate: moment().toISOString().slice(0, 10),
            activeIndex: 0,
            loading: false
        };
        this.getPatientsAndSessionsByStaff = this.getPatientsAndSessionsByStaff.bind(this);
        this.loadDataByInterval = this.loadDataByInterval.bind(this);
        this.clearDataInterval = this.clearDataInterval.bind(this);
        this.changeStartDate = this.changeStartDate.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.renderSessions = this.renderSessions.bind(this);
        this.renderPatientsAndSessions = this.renderPatientsAndSessions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderAllPatients = this.renderAllPatients.bind(this);
        this.renderAllSessions = this.renderAllSessions.bind(this);
    }

    handleClick(index) {
        let state = this;
        this.setState({
            activeIndex: index,
            loading: true
        })
        if (index === 1) {
            if (state.state.sessionData.length === 0) {
                statsController.getSessions({}).then(function (data) {
                    state.setState({
                        sessionData: data.data.sessionData,
                        loading: false

                    })
                }).catch(
                    function (err) {
                        state.setState({
                            err: err.data
                        })
                    }
                )
            }

        }
        else if (index === 2) {
            if (state.state.allPatients.length === 0) {
                patientController.getPatients().then(function (data) {
                    state.setState({
                        allPatients: data.data,
                        loading: false
                    })
                }).catch(
                    function (err) {
                        state.setState({
                            err: err.data
                        })
                    }
                )
            }
        }
        else if (index === 0) {
            if (state.allSessions === 0) {
                state.getPatientsAndSessionsByStaff();
            }
        }

        state.setState({
            loading: false
        })
    }

    getPatientsAndSessionsByStaff() {
        let state = this;

        // Get patients by staff ID
        patientController.getPatientByStaff(Auth.getUserData()['ID'])
            .then(function (data) {
                state.setState({
                    patients: data.data
                });
                return state.state.patients
            }).then(function (patients) {
            if (patients.length > 0) {
                patients.forEach(patient => {

                    let filter = {
                        'patientID': patient['patientID']
                    };
                    statsController.getSessions(filter)
                        .then(function (stats) {
                            return stats.data
                        })
                        .then(function (stats) {
                            let currentSessionData = state.state.allSessions;
                            currentSessionData.push(stats);
                            state.setState({
                                allSessions: currentSessionData,
                                loading: false
                            })
                        })
                        .catch(function (stat_err) {
                            state.setState({
                                err: stat_err.data
                            })
                        });
                });
                return state.state.sessionData
            }
        })
            .catch(
                function (err) {
                    state.setState({
                        err: err.data
                    })
                }
            )
    }

    renderAllPatients(patients) {
        let listOfPatients = patients.map((patient, index) =>
            <tr className="row100 body" key={patient.patientID}>
                <td>{patient.fullName}</td>
                <td>{patient.patientID}</td>
                <td>{patient.age}</td>
            </tr>
        )
        return listOfPatients;
    }

    renderAllSessions(sessions, spo2Stats, hrStats) {
        let listOfSessions = sessions.map((session, index) =>
            <tr className="row100 body" key={session.sessionID}>
                <td scope="row link"><Link to={{
                    pathname: `/patients/${session.patientID}/sessions/${session.sessionID}`,
                    state: {
                        sessionID: session.sessionID,
                        dateTime: session.dateTime,
                        ward: session.ward
                    }
                }}>{index + 1}</Link></td>
                <td>{new Date(session.dateTime).toDateString()}</td>
                <td>{session.patientID}</td>
                <td>{session.name}</td>
                <td>{session.ward}</td>
                <td>{session.IC}</td>
                <td>{spo2Stats[index]}</td>
                <td>{hrStats[index]}</td>
                <td>{session.diagnosis}</td>
                <td><Link to={`/sessions/${session.sessionID}/edit`}><i
                    className="fa fa-pencil edit-icon"></i></Link>
                </td>
            </tr>
        );
        return listOfSessions;
    }


    renderPatientsAndSessions(patients, sessionData) {
        let listOfPatients = patients.map((patient, index) =>
            <div className="each-patient" key={patient.patientID}>
                <div className="each-patient-name">{patient.fullName} - {patient.age}</div>
                <table>
                    <thead>
                    <tr>
                        <th className="col">Session</th>
                        <th className="col">Time</th>
                        <th className="col">Patient ID</th>
                        <th className="col">Name</th>
                        <th className="col">Ward</th>
                        <th className="col">In-charge</th>
                        <th className="col">SPO2</th>
                        <th className="col">Heart</th>
                        <th className="col">Diagnosis</th>
                        <th className="col">Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {
                        this.renderSessions(sessionData, index, patient)
                    }
                    </tbody>
                </table>
            </div>
        );
        return listOfPatients;
    }

    renderSessions(sessionData, index, patient) {
        if (sessionData[index]) {
            let sessions = sessionData[index]['sessionData'];
            let spo2Stats = sessionData[index]['spo2Stats'];
            let hrStats = sessionData[index]['hrStats'];
            let listOfSessions = sessions.map((session, index) =>
                <tr className="row100 body" key={session.sessionID}>
                    <td scope="row link"><Link to={{
                        pathname: `/patients/${session.patientID}/sessions/${session.sessionID}`,
                        state: {
                            sessionID: session.sessionID,
                            dateTime: session.dateTime,
                            ward: session.ward
                        }
                    }}>{index + 1}</Link></td>
                    <td>{new Date(session.dateTime).toDateString()}</td>
                    <td>{session.patientID}</td>
                    <td>{session.name}</td>
                    <td>{session.ward}</td>
                    <td>{session.IC}</td>
                    <td>{spo2Stats[index]}</td>
                    <td>{hrStats[index]}</td>
                    <td>{session.diagnosis}</td>
                    <td><Link to={{
                        pathname: `/sessions/${session.sessionID}/edit`,
                        state: {
                            patient: patient.ID
                        }
                    }}><i
                        className="fa fa-pencil edit-icon"></i></Link>
                    </td>
                </tr>
            );
            return listOfSessions;
        }
        else {
            return (<tr></tr>)
        }
    }

    loadDataByInterval() {
        this.setState({
            loadData: true
        });

        this.interval = setInterval(this.getPatientsAndSessionsByStaff, 10000);
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
    }

    onCloseModal() {
        this.setState({open: false});
    }


    componentDidMount() {
        this.getPatientsAndSessionsByStaff();
        // this.loadDataByInterval();
    }

    componentWillUnmount() {
        // this.clearDataInterval();
    }

    render() {
        if (!this.state.loading && this.state.patients.length > 0 && this.state.allSessions.length > 0 && this.state.activeIndex === 0) {
            return (
                <div className="container">
                    <div>
                        <div className="section-filter">
                            <table>
                                <thead>
                                <tr>
                                    <FilterClickable name="Your patients" index={0}
                                                     isActive={this.state.activeIndex === 0}
                                                     onClick={this.handleClick}/>
                                    <FilterClickable name="All sessions" index={1}
                                                     isActive={this.state.activeIndex === 1}
                                                     onClick={this.handleClick}/>
                                    <FilterClickable name="All patients" index={2}
                                                     isActive={this.state.activeIndex === 2}
                                                     onClick={this.handleClick}/>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <h3 className="session-title">Your patients</h3>
                        {/*<h4 className="session-date">{this.state.currentDate}</h4>*/}
                        {/*<div className="start-date">*/}
                            {/*<p className="start-date-header">From</p>*/}
                            {/*<DatePicker*/}
                                {/*selected={moment(this.state.startDate).toDate()}*/}
                                {/*onChange={this.changeStartDate}*/}
                            {/*/>*/}
                        {/*</div>*/}
                        {/*<div className="end-date">*/}
                            {/*<p className="end-date-header">To</p>*/}
                            {/*<DatePicker*/}
                                {/*selected={moment(this.state.endDate).toDate()}*/}
                                {/*onChange={this.changeStartDate}*/}
                            {/*/>*/}
                        {/*</div>*/}
                    </div>

                    <div>{this.renderPatientsAndSessions(this.state.patients, this.state.allSessions)}</div>
                </div>
            )
        }
        else if (!this.state.loading && this.state.sessionData.length > 0 && this.state.activeIndex === 1) {
            return (
                <div className="container">
                    <div className="section-filter">
                        <table>
                            <thead>
                            <tr>
                                <FilterClickable name="Your patients" index={0}
                                                 isActive={this.state.activeIndex === 0}
                                                 onClick={this.handleClick}/>
                                <FilterClickable name="All sessions" index={1}
                                                 isActive={this.state.activeIndex === 1}
                                                 onClick={this.handleClick}/>
                                <FilterClickable name="All patients" index={2}
                                                 isActive={this.state.activeIndex === 2}
                                                 onClick={this.handleClick}/>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <h3 className="session-title">All sessions</h3>
                    <table>
                        <thead>
                        <tr>
                            <th className="col">Session</th>
                            <th className="col">Time</th>
                            <th className="col">Patient ID</th>
                            <th className="col">Name</th>
                            <th className="col">Ward</th>
                            <th className="col">In-charge</th>
                            <th className="col">SPO2</th>
                            <th className="col">Heart</th>
                            <th className="col">Diagnosis</th>
                            <th className="col">Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {
                            this.renderAllSessions(this.state.sessionData, this.state.spo2Stats, this.state.hrStats)
                        }
                        </tbody>
                    </table>
                </div>
            )
        }
        else if (!this.state.loading && this.state.allPatients.length > 0 && this.state.activeIndex === 2) {
            return (
                <div className="container">
                    <div className="section-filter">
                        <table>
                            <thead>
                            <tr>
                                <FilterClickable name="Your patients" index={0}
                                                 isActive={this.state.activeIndex === 0}
                                                 onClick={this.handleClick}/>
                                <FilterClickable name="All sessions" index={1}
                                                 isActive={this.state.activeIndex === 1}
                                                 onClick={this.handleClick}/>
                                <FilterClickable name="All patients" index={2}
                                                 isActive={this.state.activeIndex === 2}
                                                 onClick={this.handleClick}/>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <h3 className="session-title">All patients</h3>
                    <table>
                        <thead>
                        <tr>
                            <th className="col">Name</th>
                            <th className="col">ID/NRIC</th>
                            <th className="col">Age</th>
                        </tr>
                        </thead>

                        <tbody>
                        {
                            this.renderAllPatients(this.state.allPatients)
                        }
                        </tbody>
                    </table>
                </div>
            )
        }
        else {
            return (
                <div className="container">
                    <Loading/>
                </div>

            )
        }
    }
}

export default SessionList;