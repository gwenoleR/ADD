import React from 'react';
import {

} from 'react-materialize'

export default class Order extends React.Component{

    render(){
        var pizzaListHtml = []
        JSON.parse(this.props.pizzas).forEach(function(pizza) {
            pizzaListHtml.push(<li>{pizza.pizza_name}</li>)
        }, this);

        return(
            <div className="order-card">
            <h4>{this.props.date}</h4>
            <ul>{pizzaListHtml}</ul>
            <h5>Addresse de livraison</h5>
            <p>{this.props.address} - {this.props.city}</p>
            </div>
        )
    }
}