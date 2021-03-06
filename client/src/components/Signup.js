import React from 'react';
import '../index.css';
import axios from 'axios';

import {
    Col,
    Navbar,
    NavItem,
    Button,
    Input,
} from 'react-materialize'

const base_url = window.location.hostname;

export default class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
           name : '',
           lastName : '',
           email : '',
           password : '',
           address : '',
           city : '',
           zip : '',
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
                this.setState({ childVisible: false, isAuth: true })
            })
            .catch((error) => {
                this.setState({
                    email: '',
                    password: ''
                })
            })
    }

    signup(){
        axios.post('http://'+base_url+':5000/customers',{
            customer_name : this.state.name,
            customer_lastName : this.state.lastName,
            customer_email : this.state.email,
            customer_password : this.state.password,
            customer_address : this.state.address,
            customer_city : this.state.city,
            customer_zip : this.state.zip
        }).then((data)=>{
            window.location = '/'
        }).catch((error)=>{
        })
    }

    render(){
        return(
            <div>
            <Navbar brand='TornioPizza' right>
                <NavItem href='/'>Menu</NavItem>
                {this.state.isAuth ? <NavItem href='#' >Hi User</NavItem> : <NavItem href='#' onClick={() => { this.setState({ childVisible: !this.state.childVisible }) }}>Log In</NavItem>}
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
                <h1>Sign up</h1>
                <Col>
                    <Input type='text' label='First Name' onChange={(change)=>{this.setState({name : change.target.value})}}/>
                    <Input type='text' label='Last name' onChange={(change)=>{this.setState({lastName : change.target.value})}}/>
                    <Input type='text' label='Address' onChange={(change)=>{this.setState({address : change.target.value})}}/>
                    <Input type='text' label='City' onChange={(change)=>{this.setState({city : change.target.value})}}/>
                    <Input type='number' label='Zip Code' onChange={(change)=>{this.setState({zip : change.target.value})}}/>
                    <Input type='email' label='Email' onChange={(change)=>{this.setState({email : change.target.value})}}/>
                    <Input type='password' label='Password' onChange={(change)=>{this.setState({password : change.target.value})}}/>
                    <Button onClick={this.signup.bind(this)}>Sign up</Button>

                </Col>
            </div>
            </div>
        )
    }
}
