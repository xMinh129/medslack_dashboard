import Auth from "../src/handlers/Auth";
import Base from './components/Main/Base.jsx';
import Index from './components/Main/Index.jsx';
import LogIn from './components/Authentication/LogIn.jsx';
import SessionList from "./components/Patients/SessionList.jsx";
import Session from "./components/Patients/Session.jsx";
import EditSession from "./components/Patients/EditSession.jsx"

const routes = {
    // base component (wrapper for the whole application).
    component: Base,
    childRoutes: [
        {
            path: '/',
            component: Index
        },
        {
            path: '/login',
            exactly: true,
            component: LogIn
        },
        {
            path: '/logout',
            exactly: true,
            onEnter: (nextState, replace) => {
                Auth.deAuthenticateUser();

                // change the current URL to /
                replace('/');
            }
        },
        {
            path: '/patients',
            exactly: true,
            component: SessionList
        },
        {
            path: '/patients/:patientID/sessions/:sessionID',
            exactly: true,
            component: Session
        },
        {
            path: '/sessions/:sessionID/edit',
            exactly: true,
            component: EditSession
        }
    ]
};

export default routes;