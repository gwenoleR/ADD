import React from 'react';
import '../index.css';
import axios from 'axios';
import {
    Row,
    Col,
    Navbar,
    NavItem,
    Button,
    Input,
} from 'react-materialize'

export default class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
           name : '',
           lastName : '',
           email : '',
           password : '',
           address : '',
           city : ''
        };
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

    signup(){
        console.log('coucou?')
        axios.post('http://192.168.8.102:5000/customers',{
            customer_name : this.state.name,
            customer_lastName : this.state.lastName,
            customer_email : this.state.email,
            customer_password : this.state.password,
            customer_address : this.state.address,
            customer_city : this.state.city
        }).then((data)=>{
            window.history(-1)
        }).catch((error)=>{
            console.log(error)
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
                    <Input type='text' placeholder='Name' onChange={(change)=>{this.setState({name : change.target.value})}}/>
                    <Input type='text' placeholder='Last name' onChange={(change)=>{this.setState({lastName : change.target.value})}}/>
                    <Input type='text' placeholder='Adress' onChange={(change)=>{this.setState({address : change.target.value})}}/>
                    <Input type='text' placeholder='City' onChange={(change)=>{this.setState({city : change.target.value})}}/>
                    <Input type='email' placeholder='Email' onChange={(change)=>{this.setState({email : change.target.value})}}/>
                    <Input type='password' placeholder='Password' onChange={(change)=>{this.setState({password : change.target.value})}}/>
                    <Button onClick={this.signup.bind(this)}>Sign up</Button>

                </Col>
            </div>
            </div>
        )
    }
}
