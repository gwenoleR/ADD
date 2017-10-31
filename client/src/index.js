import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import {
    Card,
    CardTitle,
    Col,
    Row,
    Navbar,
    NavItem,
    Slider,
    Slide
} from 'react-materialize'

class Pizza extends React.Component {
    render() {
        return (
            <Col m={7} s={12} className="pizza">
                <Card horizontal
                    header={<CardTitle image={this.props.img}></CardTitle>}
                    title={this.props.name}
                >
                    <p>{this.props.description}</p>
                </Card>
            </Col>
        );

    }
}

class Pizzeria extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pizzas: []
        };
    }

    _getPizzas() {
        axios.get('http://localhost:5000/pizzas')
            .then((pizzas) => {
                this.setState({ pizzas: pizzas.data })
            })
    };

    componentDidMount() {
        this._getPizzas()
    }

    renderPizza(name, image, desc, price) {
        return <Pizza img={image} name={name} description={desc} price={price} />;
    }

    render() {
        //recuperation des data a faire

        var pizzas = this.state.pizzas;
        var htmlpizza = [];
        for (var i = 0; i < pizzas.length; i++) {
            htmlpizza.push(this.renderPizza(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
        }

        return (
            <body>
                <Navbar brand='TornioPizza' right>
                    <NavItem href='get-started.html'>Menu</NavItem>
                    <NavItem href='login.html'>Log In</NavItem>
                </Navbar>
                <Slider>
                    <Slide
                        src="assets/images/s1.jpg"
                        title="This is our big Tagline!">
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s2.jpeg"
                        title="Left aligned Caption"
                        placement="left">
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s3.jpeg"
                        title="Right aligned Caption"
                        placement="right">
                        Here's our small slogan.
	                </Slide>
                </Slider>
                <Row>
                    {htmlpizza}
                </Row>
            </body>
        );


    }
}


// ========================================

ReactDOM.render(
    <Pizzeria />,
    document.getElementById('root')
);
