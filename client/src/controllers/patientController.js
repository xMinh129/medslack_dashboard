import Auth from "../handlers/Auth";

let sourceURL = 'http://35.247.135.116:5010/api/';


let patientController = {};

// Get all patients
patientController.getPatients = () => {
    const xhr_patientData = new XMLHttpRequest();
    let url = sourceURL + 'patients?' + 'page_num=1&page_size=10';
    xhr_patientData.open('get', url);
    xhr_patientData.setRequestHeader('Content-type', 'application/json');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
    xhr_patientData.responseType = 'json';

    return new Promise(function (resolve, reject) {
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                let data = xhr_patientData.response;
                resolve({
                    success: true,
                    data: data.patients
                })
            } else {
                reject({
                    success: false,
                    data: xhr_patientData.response.error
                });
            }
        });
        xhr_patientData.send();
    })
}

// Gwt patients by staff
patientController.getPatientByStaff = (staffID) => {
    const xhr_patientData = new XMLHttpRequest();
    let url = sourceURL + 'patients/staffs?' + 'staffID=' + staffID;
    xhr_patientData.open('get', url);
    xhr_patientData.setRequestHeader('Content-type', 'application/json');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
    xhr_patientData.responseType = 'json';

    return new Promise(function (resolve, reject) {
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                let data = xhr_patientData.response;
                resolve({
                    success: true,
                    data: data.patients
                })
            } else {
                reject({
                    success: false,
                    data: xhr_patientData.response.error
                });
            }
        });
        xhr_patientData.send();
    })

}

// Get one patient
patientController.getPatient = (patientID) => {
    const xhr_patientData = new XMLHttpRequest();
    let url = sourceURL + 'patient?' + 'patientID=' + patientID;
    xhr_patientData.open('get', url);
    xhr_patientData.setRequestHeader('Content-type', 'application/json');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
    xhr_patientData.responseType = 'json';

    return new Promise(function (resolve, reject) {
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                let data = xhr_patientData.response;
                resolve({
                    success: true,
                    data: data.patient
                })
            } else {
                reject({
                    success: false
                });
            }
        });
        xhr_patientData.send();
    })
}

export default patientController;