import React from 'react';
import {

} from 'react-materialize'

export default class Order extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            order_state : ''
        }
    }

    componentWillMount(){
        this.setState({order_state : this.props.state})
    }

    render(){
        var pizzaListHtml = []
        JSON.parse(this.props.pizzas).forEach(function(pizza) {
            pizzaListHtml.push(<li>{pizza.pizza_name}</li>)
        }, this);

        var date = this.props.date.split(' ')
        var day = date[0].split('-')

        

        return(
            <div className={"order-card "+this.state.order_state}>
            <h4>{date[1]} <span className='right small-h4'>{day[2]}.{day[1]}.{day[0]}</span></h4>
            <ul>{pizzaListHtml}</ul>
            <h5>Addresse de livraison</h5>
            <p>{this.props.address} - {this.props.city}</p>
            </div>
        )
    }
}