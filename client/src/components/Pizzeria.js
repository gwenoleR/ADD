import React from 'react';
import '../index.css';
import axios from 'axios';
import cookie from 'react-cookies';

import {
    Row,
    Col,
    Navbar,
    NavItem,
    Slider,
    Slide,
    Button,
    Input,
} from 'react-materialize'
import Pizza from './Pizza'
import PizzaAdmin from './PizzaAdmin'

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
            token : ""
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
        var cookies = cookie.load('user')
        console.log(cookies)
        this.setState({username : cookies.username, token : cookies.token}, ()=>{
            if(this.state.username !== "" && this.state.token !== ""){
                this.setState({isAuth : true})

                axios({
                    method: 'get',
                    url: 'http://192.168.8.102:5000/orders',
                    auth: {
                        username: this.state.username,
                        password: this.state.token
                    }
                }).then((data)=>{console.log(data)})
                .catch((error)=>{console.log(error)})
            }
        })
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

    loginPress() {
        console.log('email', this.state.email)
        console.log('pass', this.state.password)

        axios({
            method: 'post',
            url: 'http://192.168.8.102:5000/login',
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

    render() {
        var pizzas = this.state.pizzas;
        var htmlpizza = [];
        var i;

        if (!this.state.admin) {
            for (i = 0; i < pizzas.length; i++) {
                htmlpizza.push(this.renderPizza(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
            }
        }
        else {
            for (i = 0; i < pizzas.length; i++) {
                htmlpizza.push(this.renderPizzaAdmin(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
            }
        }


        return (
            <div>
                <Navbar brand='TornioPizza' right>
                    <NavItem href='#'>Menu</NavItem>
                    {this.state.isAuth ? <NavItem href='/' >Hi {this.state.username}</NavItem> : <NavItem href='#' onClick={() => { this.setState({ childVisible: !this.state.childVisible }) }}>Log In</NavItem>}
                </Navbar>
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
                <Row style={{ margin: 70 }}>
                    {htmlpizza}
                </Row>
            </div>
        );


    }
}