class Auth {

    /**
     * Authenticate a user. Save the user data in session Storage
     *
     * @param {string} userData
     * @param {string} token
     */
    static authenticateUser(userData, token) {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('token', token);
    }



    /**
     * Check if a user is authenticated - check if a token is saved in session Storage
     *
     * @returns {boolean}
     */
    static isUserAuthenticated() {
        return sessionStorage.getItem('token') !== null;

    }


    static getToken() {
        return sessionStorage.getItem('token');
    }

    static getUserData() {
        return JSON.parse(sessionStorage.getItem('userData'));
    }

    /**
     * Deauthenticate a user. Remove a token from session Storage.
     *
     */
    static deAuthenticateUser() {
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('token');
    }

    /**
     * Check if user has admin role.
     *
     */

    static isAdmin() {
        let userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData['role'] === 'admin'){
            return true;
        }
        return false;
    }

}

export default Auth;