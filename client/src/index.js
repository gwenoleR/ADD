import React from 'react';
import ReactDOM from 'react-dom';
import Pizzeria from './components/Pizzeria'
import Signup from './components/Signup'
import OrderList from './components/OrderList'
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'

class MainNavigation extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Pizzeria} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/orders" component={OrderList} />
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
