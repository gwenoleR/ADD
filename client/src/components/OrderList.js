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
            htmlOrders : [],
            admin : false
        };
    }

    getOrders(){
        var url=''
        this.state.admin ? (url = 'http://'+base_url+':5000/orders') : (url = 'http://'+base_url+':5000/orders/user/'+this.state.username)
        axios({
            url : url,
            method : 'get',
            auth : {
                username : this.state.username,
                password : this.state.token
            }
        }).then((data)=>{
            this.setState({
                orders : data.data
            })
            this.showOrder();
        }).catch((error)=>{
        })
    }

    componentWillMount() {
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})
                    if(cookies.admin !== 'undefined'){
                        this.setState({admin : cookies.admin},()=>{
                            this.getOrders()
                        })
                    }
                    

                    socket.on('order_received', (data) => {
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
    reload(){
        this.getOrders();
    }

    showOrder(){
        var orders = this.state.orders;
        var htmlOrders = [];
        var side = 'order-right'

        orders.sort(function(a,b){
            return new Date(b.order_date) - new Date(a.order_date);
          });
          orders.forEach(function(order) {
            var customer_username = order.customer_username
                var order_state = ''
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
                        order_state = 'new_order'
                        break;
                }
                
                htmlOrders.push(
                <div className={"order "+side + " " + order_state+"_before"}>
                    <Order
                        date={order.order_date}
                        pizzas={order.order_pizzas}
                        username={this.state.username}
                        password={this.state.token}
                        customer_username={customer_username}
                        state={order_state}
                        isAdmin={this.state.admin}
                        oid={order.oid}
                        newState={this.reload.bind(this)}
                    />
                </div>)
                side === 'order-right' ? side = 'order-left' : side = 'order-right'
                
        }, this);
        this.setState({htmlOrders : htmlOrders}) 
        
        
        
    }

    render(){
   
        return(
            <div>
                <Navbar brand='TornioPizza' right>
                {this.state.isAuth ? <NavItem href='/orders'>{this.state.admin ? 'Orders list' : 'My orders'}</NavItem> : <div></div>}
                <NavItem href='/'>Menu</NavItem>
                    {this.state.isAuth ? <NavItem href='/account' >Hi {this.state.username}</NavItem> : <NavItem href='#' onClick={() => { this.setState({ childVisible: !this.state.childVisible }) }}>Log In</NavItem>}
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
                {this.state.isAuth ? 
                <div className='container'>
                    <div className="timeline">
                        {this.state.htmlOrders}
                    </div>
                </div>
                : <h4>400 : Unauthorized</h4>
                }
            </div>
        )
    }
}
