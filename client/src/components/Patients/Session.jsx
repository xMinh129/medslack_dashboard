import React from 'react';
import './css/Patient.css';
import Auth from '../../handlers/Auth.js';
import PatientInfo from "./PatientInfo.jsx";
import LiveChart from "../Statistics/LiveChart.jsx";
import '../../../static/assets/bootstrap/css/bootstrap.min.css';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import dataAPI from "../../apis/dataAPI";


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
        }
        this.loadDataByInterval = this.loadDataByInterval.bind(this);
        this.clearDataInterval = this.clearDataInterval.bind(this);
        this.getPatientInfo = this.getPatientInfo.bind(this);
        this.loadHrGraphData = this.loadHrGraphData.bind(this);
        this.loadSPO2GraphData = this.loadSPO2GraphData.bind(this);
        this.getLiveData = this.getLiveData.bind(this);

    }

    getPatientInfo() {
        // Get patient data
        const xhr_patientData = new XMLHttpRequest();
        let url = 'http://localhost:5010/api/patient?' + 'patientID=' + this.props.params.patientID;
        xhr_patientData.open('get', url);
        xhr_patientData.setRequestHeader('Content-type', 'application/json');
        xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
        xhr_patientData.responseType = 'json';
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                let data = xhr_patientData.response;
                this.setState({
                    patientInfo: data.patient
                })
            } else {
                this.setState({
                    error: xhr_patientData.response.error
                });
            }
        });
        xhr_patientData.send();
    }

    loadHrGraphData() {
        let filter = {
            filter: {
                'sessionID': this.props.location.state.sessionID
            },
            pageNum: 1
        };
        let state = this;
        dataAPI.getChartData(filter, 'heart_rate')
            .then(function (data) {
                state.setState({
                    hrData: data.data,
                    currentPatientHeartRate: data.data[data.data.length-1].stats
                })
            })
            .catch(function (err) {
                state.setState({
                    err: err.data
                })
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
        dataAPI.getChartData(filter, 'spo2')
            .then(function (data) {
                state.setState({
                    spo2Data: data.data,
                    currentPatientSPO2: data.data[data.data.length-1].stats
                })
            })
            .catch(function (err) {
                state.setState({
                    err: err.data
                })
            })
    }

    getLiveData(){
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
        // this.loadDataByInterval();
    }

    componentWillUnmount() {
        this.clearDataInterval();
    }


    render() {
        if (this.state.patientInfo){
            return (
                <div className="page-content">
                    <div className="row">
                        <div className="col-md-2">
                            <PatientInfo patientData={this.state.patientInfo}/>
                        </div>
                        <div className="col-md-10">
                            <div className="content-box-large">
                                <div>
                                    <div className="column-top top-2">
                                        <div className="header-stat"></div>
                                        <div className="header-stat-title">HEART RATE</div>
                                        {
                                            this.state.hrData ? (
                                                <LiveChart data={this.state.hrData} />
                                            ) : (
                                                <div></div>
                                            )
                                        }

                                    </div>
                                    <div className="column-top top-4">
                                        <div className="header-stat"></div>
                                        <div className="header-stat-title">SPO2</div>
                                        {
                                            this.state.spo2Data ? (
                                                <LiveChart data={this.state.spo2Data} />
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
                                        <h1 className="status btm-stat">{this.state.currentPatientHeartRate} BPM</h1></div>
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
            return(
                <div>Loading</div>
            )
        }
    }
}

export default Session;