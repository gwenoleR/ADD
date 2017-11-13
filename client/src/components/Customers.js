import React from 'react';
import '../index.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Customer from './Customer_row';

import {
    Col,
    Navbar,
    NavItem,
    Button,
    Input,
    Table,
} from 'react-materialize'

const base_url = window.location.hostname;



export default class Customers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username : '',
            token : '',
            isAuth : false,
            customers : [],
            htmlCustomers : [],
            admin : false
        };
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

    componentWillMount() {
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})
                    if(cookies.admin !== 'undefined'){
                        this.setState({admin : cookies.admin},()=>{
                            this.getCustomers()
                        })
                    }

                }
            })
        }
        
    }

    getCustomers(){
        var url=''
        url = 'http://'+base_url+':5000/customers'
        axios({
            url : url,
            method : 'get',
            auth : {
                username : this.state.username,
                password : this.state.token
            }
        }).then((data)=>{
            this.setState({
                customers : data.data
            },()=>{
                this.showCustomers()
            })
        }).catch((error)=>{
        })
    }

    showCustomers(){
        var cust=[]
        this.state.customers.forEach(function(c) {
            var admin = ''
            c.customer_admin ? admin='yes' : admin='no'
            cust.push(
               <Customer
                    customer_name= {c.customer_name}
                    customer_lastName={c.customer_lastName}
                    customer_email={c.customer_email}
                    customer_address={c.customer_address}
                    customer_city={c.customer_city}
                    customer_zip={c.customer_zip}
                    customer_admin={admin}
                    cid ={c.cid}
               />                  
            )   
        } )
        this.setState({htmlCustomers : cust})
    }

    render(){
        
             return(
                 <div>
                     <Navbar brand='TornioPizza' right>
                     {this.state.admin ? <NavItem href='/customers'>Customers list</NavItem> : <div></div>} 
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
                         <Table>
                            <thead>
                                <tr>
                                    <th data-field="first">First Name</th>
                                    <th data-field="last">Last Name</th>
                                    <th data-field="email">Email</th>
                                    <th data-field="address">Address</th>
                                    <th data-field="admin">Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.customers.length <= 0 ? 
                                <tr>
                                    <td>
                                    No data
                                    </td>
                                </tr>
                                : this.state.htmlCustomers    
                                }
                            </tbody>
                        </Table>

                     </div>
                     : <h4>400 : Unauthorized</h4>
                     }
                 </div>
             )
         }
}
