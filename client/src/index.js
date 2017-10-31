import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import {
    Col,
    Row,
    Navbar,
    NavItem,
    Slider,
    Slide,
} from 'react-materialize'
import Pizza from './components/Pizza'
import PizzaAdmin from './components/PizzaAdmin'

class Pizzeria extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pizzas: [],
            admin: false,
        };
    }

    _getPizzas() {
        axios.get('http://192.168.8.102:5000/pizzas')
            .then((pizzas) => {
                this.setState({ pizzas: pizzas.data })
                console.log(this.state.pizzas)
            })
    };

    componentDidMount() {
        this._getPizzas()
    }

    renderPizza(name, image, desc, price) {
        return (
            <Pizza img={image} name={name} description={desc} price={price} />
        )
    }
    renderPizzaAdmin(name, image, desc, price) {
        return (
            <PizzaAdmin img={image} name={name} description={desc} price={price} />
        )
    }

    render() {
        //recuperation des data a faire
        var pizzas = this.state.pizzas;
        var htmlpizza = [];

        if(!this.state.admin){
            for (var i = 0; i < pizzas.length; i++) {
                htmlpizza.push(this.renderPizza(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
            }
        }
        else{
            for (var i = 0; i < pizzas.length; i++) {
                htmlpizza.push(this.renderPizzaAdmin(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
            }
        }
        

        return (
            <div>
                <Navbar brand='TornioPizza' right>
                    <NavItem href='#'>Menu</NavItem>
                    <NavItem href='#'>Log In</NavItem>
                </Navbar>
                <Slider>
                    <Slide
                        src="assets/images/s1.jpg"
                        title="This is our big Tagline!"
                        style={{color : 'black'}}>
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s2.jpeg"
                        title="Left aligned Caption"
                        placement="left"
                        style={{color : 'black'}}>
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s3.jpeg"
                        title="Right aligned Caption"
                        placement="right"
                        style={{color : 'black'}}>
                        Here's our small slogan.
	                </Slide>
                </Slider>
                <Row style={{margin : 70}}>
                    {htmlpizza}
                </Row>
            </div>
        );


    }
}


// ========================================

ReactDOM.render(
    <Pizzeria />,
    document.getElementById('root')
);
