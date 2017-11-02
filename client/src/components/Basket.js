import React from 'react';
import MiniPizza from './MinPizza';
import { 
    Col,
    Button,
} from 'react-materialize';

export default class Basket extends React.Component{
    render(){
        var basket = this.props.basket;
        var listPizza = [];
        var i;

            for (i = 0; i < basket.length; i++) {
                listPizza.push(
                    <MiniPizza 
                    name={basket[i].pizza_name}
                    image={basket[i].pizza_picture}
                />
                )
            }
        return(
            <Col className='col-basket' style={{ position : 'absolute'}}>
                {listPizza}
                <Button className='full-width' style={{marginTop : 10}} onClick={this.props.order}>Order - {this.props.totalPrice}€</Button>
            </Col>
        )
    }
}