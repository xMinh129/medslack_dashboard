import Auth from "../handlers/Auth";

let dataAPI = {}

let returnResponse = (data) => {
    return data
}

dataAPI.getChartData = (filter, dataType) => {
    // Get patient data
    const xhr_patientData = new XMLHttpRequest();
    let url = 'http://localhost:5010/api/all_stats?' + "session_ID=" + filter['filter']['sessionID'];
    xhr_patientData.open('get', url);
    xhr_patientData.setRequestHeader('Content-type', 'application/json');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
    if (dataType == 'spo2') {
        xhr_patientData.setRequestHeader('data_type', 'spo2');
    }
    else if (dataType == 'heart_rate') {
        xhr_patientData.setRequestHeader('data_type', 'heart_rate');
    }
    xhr_patientData.responseType = 'json';
    return new Promise(function (resolve, reject) {
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                resolve({
                    'success': true,
                    'data':  xhr_patientData.response.data
                })
            } else {
                reject({
                    'success': false,
                    'data':  xhr_patientData.response.error
                })
            }
        });
        xhr_patientData.send();
    })
}

export default dataAPI;