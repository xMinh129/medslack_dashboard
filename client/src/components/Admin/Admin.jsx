import React from "react";
import Loading from "../Common/Loading.jsx";
import "../Sessions/css/Session.css";
import staffController from "../../controllers/staffController";
import patientController from "../../controllers/patientController";

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            staffs: [],
            patients: [],
            loading: true
        };
        this.getStaffs = this.getStaffs.bind(this);
        this.getPatients = this.getPatients.bind(this);
    }

    getStaffs() {
        let state = this;
        staffController.getStaffs()
            .then(function (data) {
                state.setState({
                    staffs: data.data,
                    loading: false
                })
            })
            .catch(function (err) {
                state.setState({
                    err: err.data
                })
            })
    }

    renderStaffs(staffs) {
        let listOfStaffs = staffs.map((staff, index) =>
            <tr className="row100 body" key={staff.userID}>
                <td>{index + 1}</td>
                <td>{staff.userID}</td>
                <td>{staff.fullName}</td>
                <td>{staff.role}</td>
                <td>{staff.department}</td>
            </tr>
        );
        return listOfStaffs;
    }

    getPatients() {
        let state = this;
        patientController.getPatients()
            .then(function (data) {
                state.setState({
                    patients: data.data,
                    loading: false
                })
            })
            .catch(
                function (err) {
                    state.setState({
                        err: err.data
                    })
                }
            )
    }

    renderPatients(patients) {
        let listOfPatients = patients.map((patient, index) =>
            <tr className="row100 body" key={patient.patientID}>
                <td>{index + 1}</td>
                <td>{patient.patientID}</td>
                <td>{patient.fullName}</td>
                <td>{patient.age}</td>
            </tr>
        )
        return listOfPatients;
    }

    componentDidMount() {
        this.getStaffs();
        this.getPatients()
    }

    componentWillUnmount() {
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className="container">
                    <h3 className="session-title"> All staffs</h3>
                    {
                        this.state.staffs.length > 0 ? (
                            <div>
                                <table style={{'marginBottom': '20px'}}>
                                    <thead>
                                    <tr>
                                        <th className="col">Index</th>
                                        <th className="col">IC</th>
                                        <th className="col">Name</th>
                                        <th className="col">Role</th>
                                        <th className="col">Department</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {this.renderStaffs(this.state.staffs)}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div></div>
                        )
                    }
                    <h3 className="session-title"> All patients</h3>

                    {
                        this.state.patients.length > 0 ? (
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th className="col">Index</th>
                                        <th className="col">IC</th>
                                        <th className="col">Name</th>
                                        <th className="col">Age</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {this.renderPatients(this.state.patients)}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div></div>
                        )
                    }

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

export default Admin;