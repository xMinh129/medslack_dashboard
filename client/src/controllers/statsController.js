import Auth from "../handlers/Auth";
import moment from "moment";

let sourceURL = 'http://35.247.135.116:5010/api/';

let statsController = {};

// Get all sessions
statsController.getSessions = (filter) => {
    const xhr = new XMLHttpRequest();
    let url;
    if ('patientID' in filter) {
        url = sourceURL + 'sessions' + '?page_size=10&page_num=1&patientID=' + filter['patientID'];
    }
    else {
        url = sourceURL + 'sessions' + '?page_size=10&page_num=1';
    }

    xhr.open('get', url);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Authorization', Auth.getToken());
    xhr.responseType = 'json';

    return new Promise(function (resolve, reject) {
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve({
                    'success': true,
                    'data': {
                        sessionData: xhr.response.data,
                        spo2Stats: xhr.response.spo2_stats,
                        hrStats: xhr.response.hr_stats
                    }
                })

            } else {
                reject({
                    'success': false,
                    'data': xhr.response.error
                })
            }
        });
        xhr.send();
    })
}

// Get one session
statsController.getSession = (sessionID) => {
    // Get session data
    const xhr_patientData = new XMLHttpRequest();
    const url = sourceURL + 'session?sessionID=' + sessionID;
    xhr_patientData.open('GET', url, true);
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
                    success: false,
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
                reject({
                    success: false,
                    data: xhr_patientData.response.error
                });
            }
        });
        xhr_patientData.send();
    })

};

// Update session
statsController.updateSession = (payload) => {
    // Get patient data
    const xhr_patientData = new XMLHttpRequest();
    const url = sourceURL + 'session/update';
    xhr_patientData.open('PUT', url);
    xhr_patientData.setRequestHeader('Content-type', 'application/json');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr_patientData.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr_patientData.setRequestHeader('Authorization', Auth.getToken());
    xhr_patientData.responseType = 'json';
    return new Promise(function (resolve, reject) {
        xhr_patientData.addEventListener('load', () => {
            if (xhr_patientData.status === 200) {
                resolve({
                    success: true
                })
            } else {
                reject({
                    success: false,
                    data: 500
                })
            }
        });
        xhr_patientData.send(JSON.stringify(payload));
    })
};


// Get data for live plots
statsController.getChartData = (filter, dataType) => {
    // Get patient data
    const xhr_patientData = new XMLHttpRequest();
    let url = sourceURL + 'stats?' + "sessionID=" + filter['filter']['sessionID'] + '&page_size=460&page_num=last';
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
                let data = [];
                if (xhr_patientData.response.data.length > 0){
                    xhr_patientData.response.data.forEach(function(i){
                        data.push({
                            'stats': i['stats'],
                            'dateTime': moment(i['dateTime'])
                        })
                    })
                }
                resolve({
                    'success': true,
                    'data': data
                })
            } else {
                reject({
                    'success': false
                })
            }
        });
        xhr_patientData.send();
    })
}

export default statsController;