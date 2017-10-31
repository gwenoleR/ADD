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
    Slide,
    Button,
    Icon,
    Input
} from 'react-materialize'

class Pizza extends React.Component {
    render() {
        return (
            <Col m={7} s={12} className="pizza">
                <Card horizontal
                    header={<CardTitle style={{color : 'black'}} className='no-padding' image={this.props.img}><span className='font-black price' >{this.props.price} €</span></CardTitle>}
                    title={this.props.name} 
                >
                    <p>{this.props.description}</p>
                    <hr/>
                    <Row>
                        <Input className='with-gap font-black' name='size' type='radio' value='medium' label='Medium'/>
                        <Input className='with-gap font-black' name='size' type='radio' value='large' label='Large' />
                    </Row>

                    <Button waves='light' className="full-button" style={{marginHorizontal:10}}><Icon medium> add_shopping_cart</Icon></Button>
                </Card>
            </Col>
        );

    }
}

class PizzaAdmin extends React.Component {
    render() {
        return (
            <Col m={7} s={12} className="pizza">
                <Card horizontal
                    header={<CardTitle style={{color : 'black'}} className='no-padding' image={this.props.img}><span className='font-black price' >{this.props.price} €</span></CardTitle>}
                    title={this.props.name} 
                >
                    <p>{this.props.description}</p>
                    <hr/>
                    <Row>
                        <Input className='with-gap font-black' name='size' type='radio' value='medium' label='Medium'/>
                        <Input className='with-gap font-black' name='size' type='radio' value='large' label='Large' />
                    </Row>

                    <Button waves='light' className="full-button" style={{marginHorizontal:10}}><Icon medium> add_shopping_cart</Icon></Button>
                    <Button waves='light' className="full-button" style={{marginHorizontal:10, marginTop : 10}}><Icon medium>edit</Icon></Button>
                    <Button waves='light' className="full-button red" style={{marginHorizontal:10, marginTop : 10}}><Icon medium>delete</Icon></Button> 
                </Card>
            </Col>
        );

    }
}

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
