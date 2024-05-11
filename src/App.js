import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './Views/LoginPage';
import ExperimentsPage from './Views/ExperimentsPage';
import RegisterPage from './Views/RegisterPage';
import PilotsPage from './Views/PilotsPage';
import CheckAuthentification from './CheckAuthentification';
import DashboardPage from './Views/DashboardPage';
import PilotDashboard from './Views/PilotDashboard';


const backeEndUrl = 'https://pilotpulse.pythonanywhere.com'
function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />

          <CheckAuthentification path="/experiments" component={ExperimentsPage} />
          <CheckAuthentification path="/pilots" component={PilotsPage} />
          <CheckAuthentification path="/experimentation/:id" component={DashboardPage} />
          <CheckAuthentification path="/pilote/:id" component={PilotDashboard} />
          <CheckAuthentification path="/dashboard" component={DashboardPage} />


          <Route exact path="/" component={LoginPage} />

        </Switch>
      </div>

    </Router>
  );
}
export {App, backeEndUrl};
