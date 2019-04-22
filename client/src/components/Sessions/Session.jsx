import React from 'react';
import './css/Session.css';
import PatientInfo from "../Patients/PatientInfo.jsx";
import LiveChart from "../Statistics/LiveChart.jsx";
import '../../../static/assets/bootstrap/css/bootstrap.min.css';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import statsController from "../../controllers/statsController";
import patientController from "../../controllers/patientController";
import Loading from "../Common/Loading.jsx";
import moment from "moment";

class Session extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: false,
            loadDataByInterval: true,
            loadLiveData: false,
            patientInfo: false,
            spo2Data: false,
            hrData: false,
            currentPatientHeartRate: 0,
            currentPatientSPO2: 0,
            err: false
        };
        this.loadDataByInterval = this.loadDataByInterval.bind(this);
        this.clearDataInterval = this.clearDataInterval.bind(this);
        this.getPatientInfo = this.getPatientInfo.bind(this);
        this.loadHrGraphData = this.loadHrGraphData.bind(this);
        this.loadSPO2GraphData = this.loadSPO2GraphData.bind(this);
        this.getLiveData = this.getLiveData.bind(this);

    }

    getPatientInfo() {
        let state = this;
        patientController.getPatient(this.props.params.patientID)
            .then(function (data) {
                state.setState({
                    patientInfo: data.data
                })
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    loadHrGraphData() {
        let filter = {
            filter: {
                'sessionID': this.props.location.state.sessionID
            },
            pageNum: 1
        };
        let state = this;
        statsController.getChartData(filter, 'heart_rate')
            .then(function (data) {
                state.setState({
                    hrData: data.data,
                    currentPatientHeartRate: data.data[data.data.length - 1].stats,
                    currentHrTime: new Date(data.data[data.data.length - 1].dateTime).toLocaleTimeString()
                })
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    loadSPO2GraphData() {
        let filter = {
            filter: {
                'sessionID': this.props.location.state.sessionID
            },
            pageNum: 1
        };
        let state = this;
        statsController.getChartData(filter, 'spo2')
            .then(function (data) {
                state.setState({
                    spo2Data: data.data,
                    currentPatientSPO2: data.data[data.data.length - 1].stats,
                    currentSPO2Time: new Date(data.data[data.data.length - 1].dateTime).toLocaleTimeString()
                })
            })
            .catch(function (err) {
               console.log(err)
            })
    }

    getLiveData() {
        this.loadHrGraphData();
        this.loadSPO2GraphData();
    }


    loadDataByInterval() {
        this.setState({
            loadLiveData: true
        });
        this.interval = setInterval(this.getLiveData, 5000);
    }

    clearDataInterval() {
        this.setState({
            loadLiveData: false
        });

        clearInterval(this.interval);
    }

    componentDidMount() {
        this.getPatientInfo();
        this.getLiveData();
        this.loadDataByInterval();
    }

    componentWillUnmount() {
        this.clearDataInterval();
    }

    render() {
        if (this.state.patientInfo) {
            return (
                <div className="page-content">
                    <div className="row">
                        <div className="col-md-2">
                            <PatientInfo patientData={this.state.patientInfo}
                                         dateTime={this.props.location.state.dateTime}
                                         ward={this.props.location.state.ward}
                            />
                        </div>
                        <div className="col-md-10">
                            <div className="content-box-large">
                                <div>
                                    <div className="column-top top-2">
                                        <div className="header-stat-title">Pulse</div>
                                        <div className="chart-session">
                                            {
                                                this.state.hrData ? (
                                                    <LiveChart data={this.state.hrData} dataType="heart-rate"/>
                                                ) : (
                                                    <div></div>
                                                )
                                            }
                                        </div>
                                        {
                                            this.state.currentPatientHeartRate ? (
                                                <div
                                                    className="current-stats current-hr">{this.state.currentPatientHeartRate}</div>
                                            ) : (
                                                <div></div>
                                            )
                                        }
                                        {
                                            this.state.currentHrTime ? (
                                                <div
                                                    className="current-hr current-time">{this.state.currentHrTime}</div>
                                            ) : (
                                                <div></div>
                                            )
                                        }

                                    </div>
                                    <div className="column-top top-4">
                                        <div className="header-stat-title">SPO2</div>
                                        <div className="chart-session">
                                            {
                                                this.state.spo2Data ? (
                                                    <LiveChart data={this.state.spo2Data} dataType="spo2"
                                                    />
                                                ) : (
                                                    <div></div>
                                                )
                                            }
                                        </div>
                                        {
                                            this.state.currentPatientSPO2 ? (
                                                <div
                                                    className="current-stats current-spo2">{this.state.currentPatientSPO2}</div>
                                            ) : (
                                                <div></div>
                                            )
                                        }

                                        {
                                            this.state.currentSPO2Time ? (
                                                <div
                                                    className="current-spo2 current-time">{this.state.currentSPO2Time}</div>
                                            ) : (
                                                <div></div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="row-4 clearfix;">
                                    <div className="column-bottom bottom-1">Temperature
                                        <div className="medical-icon"><br/>
                                            <LazyLoadImage src="https://i.ibb.co/7v5n7G8/thermometer.png"/>
                                        </div>
                                        <h1 className="status btm-stat">36.2&deg;C</h1>
                                    </div>
                                    <div className="column-bottom bottom-2">Pulse
                                        <div className="medical-icon"><br/>
                                            <LazyLoadImage src="https://i.ibb.co/zRjfRvm/bloodpressure.png"/>
                                        </div>
                                        <h1 className="status btm-stat">{this.state.currentPatientHeartRate} BPM</h1>
                                    </div>
                                    <div className="column-bottom bottom-3">SPO2
                                        <div className="medical-icon"><br/>
                                            <LazyLoadImage src="https://i.ibb.co/CJN2gN0/heartbeat.png"/>
                                        </div>
                                        <h1 className="status btm-stat">{this.state.currentPatientSPO2} %</h1>
                                    </div>
                                    <div className="column-bottom bottom-3">Hydration
                                        <div className="medical-icon"><br/>
                                            <LazyLoadImage src="https://i.ibb.co/zRjfRvm/bloodpressure.png"/>
                                            <h1 className="status btm-stat">51</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div><Loading/></div>
            )
        }
    }
}

export default Session;