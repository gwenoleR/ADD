import React from 'react';
import '../index.css';
import axios from 'axios';
import cookie from 'react-cookies';
import io from 'socket.io-client';
import Basket from './Basket';
import AddPizza from './AddPizza';
import EditPizza from './EditPizza';

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

const base_url = window.location.hostname;
const socket = io('http://'+base_url+':5000/order');

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
            totalPrice : 0,
            bgColor : '', //rgba(0, 0, 0, 0.15)
            formCreateIsVisible : false,
            formEditIsVisible : false,
            pizzaToEdit: {}
        };
    }

    _getPizzas() {
        axios.get('http://'+base_url+':5000/pizzas')
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
                if(cookies.admin !== 'undefined'){
                    this.setState({admin : cookies.admin})
                }
            })
        }
        
    }

    loginPress() {
        axios({
            method: 'post',
            url: 'http://'+base_url+':5000/login',
            auth: {
                username: this.state.email,
                password: this.state.password
            }
        })
            .then((data) => {
                cookie.save('user', {'username':data.data.username, 'token': data.data.token})

                this.setState({ childVisible: false, isAuth: true, username : data.data.username, token : data.data.token })

                if(data.data.isAdmin !== 'undefined'){
                    this.setState({admin : data.data.isAdmin})
                    cookie.save('user', {'username':data.data.username, 'token': data.data.token, 'admin' : data.data.isAdmin})
                    
                }
                

            })
            .catch((error) => {
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
        var order = {'customer_username' : this.state.username,'order_pizzas' : JSON.stringify(this.state.basket)}

        axios({
            url : 'http://'+base_url+':5000/orders',
            method : 'post',
            data : order
        }).then((data)=>{
            this.setState({basketIsVisible : !this.state.basketIsVisible})
            this.setState({basket : []})
            socket.emit('new_order')
            this.totalBasketPrice()
        })
        .catch((error)=>{
        })

    }

    totalBasketPrice(){
        var total =0;
        this.state.basket.forEach(function(article) {
            total += article.pizza_price
        }, this);

        this.setState({totalPrice : total})
    }

    deletePizza(pizza){
        axios({
            url : 'http://'+base_url+':5000/pizzas/'+pizza.pid,
            method : 'delete'
        }).then((data)=>{
            this._getPizzas()
        })
        .catch((error)=>{
        })
    }

    dismissCreateForm(){
        this.setState({formCreateIsVisible : false})
        this.setState({bgColor : ''})
        this._getPizzas()
    }

    dismissEditForm(){
        this.setState({formEditIsVisible : false})
        this.setState({bgColor : ''})
        this._getPizzas()
    }


    editPizza(pizza){
        this.setState({formEditIsVisible : true})
        this.setState({pizzaToEdit : pizza})
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
                        basket_press={this.addBasket.bind(this, pizzas[i])}
                        delete_press={this.deletePizza.bind(this, pizzas[i])}
                        edit_press={this.editPizza.bind(this, pizzas[i])}
                    />
                )}
        }


        return (
            <div className={this.state.bgColor}>
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
                                <Input style={{ marginLeft: 10, marginRight: 10 }} type='text' onChange={(change) => {this.setState({ email: change.target.value })}} value={this.state.email} placeholder='Email' />
                                <Input style={{ marginLeft: 10, marginRight: 10 }} type='password' onChange={(change) => { this.setState({ password: change.target.value }) }} value={this.state.password} placeholder='Password' />
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
                    { this.state.admin ? 
                        <Button floating icon='add' className='red add-pizza-button' large  
                        onClick={()=>{
                            this.setState({ formCreateIsVisible : true, bgColor : 'overlay'})  
                        }}></Button>                        
                        : <div></div>
                    }
                </Row>
                { this.state.formCreateIsVisible ?
                <div>
                <AddPizza 
                createPress={this.dismissCreateForm.bind(this)}
                cancelPress={this.dismissCreateForm.bind(this)}/>
                <div className="modal-overlay" style={{zIndex: 50, display: 'block', opacity: 0.5}}></div>
                </div>
                : <div></div>}

                { this.state.formEditIsVisible ?
                <div>
                <EditPizza 
                pid={this.state.pizzaToEdit.pid}
                name={this.state.pizzaToEdit.pizza_name}
                description={this.state.pizzaToEdit.pizza_description}
                picture={this.state.pizzaToEdit.pizza_picture}
                price={this.state.pizzaToEdit.pizza_price}
                createPress={this.dismissEditForm.bind(this)}
                cancelPress={this.dismissEditForm.bind(this)}/>
                <div className="modal-overlay" style={{zIndex: 50, display: 'block', opacity: 0.5}}></div>
                </div>
                : <div></div>}
                
                
                
            </div>
        );


    }
}