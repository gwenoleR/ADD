import React from 'react';
import '../index.css';
import axios from 'axios';
import cookie from 'react-cookies';
import io from 'socket.io-client';
import Basket from './Basket';

import {
    Row,
    Col,
    Navbar,
    NavItem,
    Slider,
    Slide,
    Button,
    Input,
    Icon,
} from 'react-materialize'
import Pizza from './Pizza'
import PizzaAdmin from './PizzaAdmin'

const socket = io('http://localhost:5000/order');

export default class Pizzeria extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pizzas: [],
            admin: false,
            childVisible: false,
            email: "",
            password: "",
            isAuth: false,
            username : "",
            token : "",
            basket : [],
            basketIsVisible : false,
            totalPrice : 0
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
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})
                }
            })
        }
        
    }

    loginPress() {
        console.log('email', this.state.email)
        console.log('pass', this.state.password)

        axios({
            method: 'post',
            url: 'http://localhost:5000/login',
            auth: {
                username: this.state.email,
                password: this.state.password
            }
        })
            .then((data) => {
                console.log('connected', data.data)

                cookie.save('user', {'username':data.data.username, 'token': data.data.token})

                this.setState({ childVisible: false, isAuth: true })

            })
            .catch((error) => {
                console.log('error', error)
                this.setState({
                    email: '',
                    password: ''
                })
            })
    }

    addBasket(pizza){
        this.state.basket.push(pizza)
        var basket = this.state.basket
        this.totalBasketPrice()
        this.setState({basket : basket})


    }

    order(){
        console.log(this.state.basket)
        var order = {'customer_username' : this.state.username,'order_pizzas' : JSON.stringify(this.state.basket)}

        axios({
            url : 'http://localhost:5000/orders',
            method : 'post',
            data : order
        }).then((data)=>{
            this.setState({basketIsVisible : !this.state.basketIsVisible})
            this.setState({basket : []})
            socket.emit('new_order')
        })
        .catch((error)=>{console.log(error)})

        console.log(order)
    }

    totalBasketPrice(){
        var total =0;
        this.state.basket.forEach(function(article) {
            total += article.pizza_price
        }, this);

        this.setState({totalPrice : total})
    }

    render() {
        var pizzas = this.state.pizzas;
        var htmlpizza = [];
        var i;

        if (!this.state.admin) {
            for (i = 0; i < pizzas.length; i++) {
                htmlpizza.push(
                    <Pizza 
                        img={pizzas[i]["pizza_picture"]} 
                        name={pizzas[i]["pizza_name"]} 
                        description={pizzas[i]["pizza_description"]} 
                        price={pizzas[i]["pizza_price"]} 
                        id={pizzas[i]['pid']}
                        basket_press={this.addBasket.bind(this, pizzas[i])}

                    />
                )
            }
        }
        else {
            for (i = 0; i < pizzas.length; i++) {
                htmlpizza.push(
                    <PizzaAdmin 
                        img={pizzas[i]["pizza_picture"]} 
                        name={pizzas[i]["pizza_name"]} 
                        description={pizzas[i]["pizza_description"]} 
                        price={pizzas[i]["pizza_price"]} 
                        id={pizzas[i]['pid']}
                    />
                )}
        }


        return (
            <div>
                <Navbar brand='TornioPizza' right>
                    {this.state.admin ? <NavItem href='/orders'>Orders Lists</NavItem> : <div></div>}
                    {this.state.isAuth ? <NavItem href='#' onClick={()=>{this.setState({basketIsVisible : !this.state.basketIsVisible})}}><div><Icon medium left>shopping_cart</Icon> {this.state.basket.length}</div> </NavItem> : <div></div>}                    
                    <NavItem href='#'>Menu</NavItem>
                    {this.state.isAuth ? <NavItem href='/account' >Hi {this.state.username}</NavItem> : <NavItem href='#' onClick={() => { this.setState({ childVisible: !this.state.childVisible }) }}>Log In</NavItem>}
                </Navbar>
                {this.state.basketIsVisible ?
                <Basket 
                    basket={this.state.basket}
                    order={this.order.bind(this)}
                    totalPrice={this.state.totalPrice}
                />
                : <div></div>
                }
                {
                    this.state.childVisible
                        ? <div>
                            <Col >
                                <Input style={{ marginLeft: 10, marginRight: 10 }} type='text' onChange={(change) => {console.log(change.target.value); this.setState({ email: change.target.value }) }} placeholder='Email' />
                                <Input style={{ marginLeft: 10, marginRight: 10 }} type='password' onChange={(change) => { this.setState({ password: change.target.value }) }} placeholder='Password' />
                                <Button style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }} onClick={this.loginPress.bind(this)}>Log in</Button>
                            </Col>
                            <Col>
                                <Button node='a' href='/signup' style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }} onClick={()=>{}}>New ? Sign up !</Button>
                            </Col>
                        </div>
                        : null
                }
                <Slider>
                    <Slide
                        src="assets/images/s1.jpg"
                        title="This is our big Tagline!"
                        style={{ color: 'black' }}>
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s2.jpeg"
                        title="Left aligned Caption"
                        placement="left"
                        style={{ color: 'black' }}>
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s3.jpeg"
                        title="Right aligned Caption"
                        placement="right"
                        style={{ color: 'black' }}>
                        Here's our small slogan.
	                </Slide>
                </Slider>
                <Row className='pizza-list'>
                    {htmlpizza}
                </Row>
                
            </div>
        );


    }
}