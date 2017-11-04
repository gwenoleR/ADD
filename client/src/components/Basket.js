import React from 'react';
import MiniPizza from './MinPizza';
import { 
    Col,
    Button,
} from 'react-materialize';

export default class Basket extends React.Component{
    constructor(props){
        super(props)

        this.state={
            basket : this.props.basket,
            listPizza : [],
            price : this.props.totalPrice
        }
    }
    deletePizza(pizza_index){
        this.state.basket.splice(pizza_index, 1);
        this.generateCart()
        this.props.deletePress()
    }

    generateCart(){
        var i;
        var pizzas = []
        console.log(this.state.basket.length)

            for (i = 0; i < this.state.basket.length; i++) {
                pizzas.push(
                    <MiniPizza 
                    name={this.state.basket[i].pizza_name}
                    image={this.state.basket[i].pizza_picture}
                    delete={this.deletePizza.bind(this,i)}
                />
                )
            }
            this.setState({listPizza : pizzas})

            var total =0;
            this.state.basket.forEach(function(article) {
                total += article.pizza_price
            }, this);

            this.setState({price : total})

    }

    componentWillMount(){
        this.generateCart()
    }

    render(){
        
        return(
            <Col className='col-basket' style={{ position : 'absolute'}}>
                {this.state.listPizza}
                <Button className='full-width' style={{marginTop : 10}} onClick={this.props.order}>Order - {this.state.price}€</Button>
            </Col>
        )
    }
}