import React from 'react';
import '../index.css';
import axios from 'axios';
import cookie from 'react-cookies';
import io from 'socket.io-client';

import {
    Col,
    Navbar,
    NavItem,
    Button,
    Input,
} from 'react-materialize'
import Order from './Order';

const base_url = window.location.hostname;
const socket = io('http://'+base_url+':5000/order');


export default class OrderList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username : '',
            token : '',
            isAuth : false,
            orders : [],
            htmlOrders : []
        };
    }

    getOrders(){
        axios({
            url : 'http://'+base_url+':5000/orders',
            method : 'get',
            auth : {
                username : this.state.username,
                password : this.state.password
            }
        }).then((data)=>{
            this.setState({
                orders : data.data
            })
            this.showOrder();
        }).catch((error)=>{
            console.log(error)
        })
    }

    componentDidMount() {
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})
                    this.getOrders()

                    socket.on('order_received', (data) => {
                        console.log('new_order');
                        this.getOrders();
                      });
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
                console.log('connected')
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

    showOrder(){
        var orders = this.state.orders;
        var htmlOrders = [];
        var side = 'order-right'

        orders.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
          });
          
          orders.reverse()
          orders.forEach(function(order) {
            var customer_username = order.customer_username

            axios({
                url : 'http://'+base_url+':5000/customers/'+customer_username,
                method : 'get',
                auth : {
                    username : this.state.username,
                    password : this.state.password
                }
            }).then((data)=>{
                var order_state = ''
                console.log(order.order_state)
                switch (order.order_state){
                    case 'new':
                        order_state = 'new_order'
                        break;
                    case 'prepa':
                        order_state = 'prepa_order'
                        break;
                    case 'livraison':
                        order_state = 'livraison_order';
                        break;
                    case 'livre':
                        order_state = 'livre_order';
                        break;
                    default:
                        order_state = 'new'
                        break;
                }
                console.log()
                htmlOrders.push(
                <div className={"order "+side + " " + order_state+"_before"}>
                    <Order
                        date={order.order_date}
                        pizzas={order.order_pizzas}
                        address={data.data.customer_address}
                        city={data.data.customer_city}
                        state={order_state}
                    />
                </div>)
                side === 'order-right' ? side = 'order-left' : side = 'order-right'
                this.setState({htmlOrders : htmlOrders})
            })

           
        }, this);
    }

    render(){
   
        return(
            <div>
                <Navbar brand='TornioPizza' right>
                    <NavItem href='/'>Menu</NavItem>
                    {this.state.isAuth ? <NavItem href='#' >Hi {this.state.username}</NavItem> : <NavItem href='#' onClick={() => { this.setState({ childVisible: !this.state.childVisible }) }}>Log In</NavItem>}
                </Navbar>
                {
                    this.state.childVisible
                        ? <div>
                            <Col >
                            <Input style={{ marginLeft: 10, marginRight: 10 }} type='text' onChange={(change) => { this.setState({ email: change.target.value }) }} placeholder='Email' />
                            <Input style={{ marginLeft: 10, marginRight: 10 }} type='password' onChange={(change) => { this.setState({ password: change.target.value }) }} placeholder='Password' />
                            <Button style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }} onClick={this.loginPress.bind(this)}>Log in</Button>
                        </Col>
                        <Col>
                            <Button node='a' href='/signup' style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }} onClick={()=>{}}>New ? Sign up !</Button>
                        </Col>
                        </div>
                        : null
                }
                <div className='container'>
                    <div className="timeline">
                        {this.state.htmlOrders}
                    </div>
                </div>
            </div>
        )
    }
}
