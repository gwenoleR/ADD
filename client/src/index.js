import React from 'react';
import ReactDOM from 'react-dom';
import Pizzeria from './components/Pizzeria'
import Signup from './components/Signup'

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

class MainNavigation extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Pizzeria} />
                    <Route path="/signup" component={Signup} />
                </div>
            </Router>
        )
    }

}
// ========================================

ReactDOM.render(
    <MainNavigation />,
    document.getElementById('root')
);
