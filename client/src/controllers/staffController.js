import Auth from "../handlers/Auth";

let sourceURL = 'http://35.247.135.116:5010/api/';


let staffController = {};

// Get all staffs
staffController.getStaffs = (filter) => {
    const xhr_staffData = new XMLHttpRequest();
    let url = sourceURL + 'staffs';
    xhr_staffData.open('get', url);
    xhr_staffData.setRequestHeader('Content-type', 'application/json');
    xhr_staffData.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    xhr_staffData.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr_staffData.setRequestHeader('Authorization', Auth.getToken());
    xhr_staffData.responseType = 'json';

    return new Promise(function (resolve, reject) {
        xhr_staffData.addEventListener('load', () => {
            if (xhr_staffData.status === 200) {
                let data = xhr_staffData.response;
                resolve({
                    success: true,
                    data: data.staffs
                })
            } else {
                reject({
                    success: false,
                    data: xhr_staffData.response.error
                });
            }
        });
        xhr_staffData.send();
    })
}

export default staffController;