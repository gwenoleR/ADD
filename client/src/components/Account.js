import React from 'react';
import '../index.css';
import axios from 'axios';
import cookie from 'react-cookies';

import {
    Col,
    Row,
    Navbar,
    NavItem,
    Button,
    Input,
} from 'react-materialize'

const base_url = window.location.hostname;

export default class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username : '',
            token : '',
            isAuth : false,
            name : '',
            lastName:'',
            email: '',
            adress: '',
            city : '',
            zip : '',
            change : false,
            admin : false,
        };
    }

    getUserInfo(){
        axios({
            method : 'get',
            url : 'http://'+base_url+':5000/customers/'+this.state.username,
            auth : {
                username : this.state.username,
                password : this.state.token
            }
        }).then((data)=>{
            this.setState({
                name : data.data.customer_name,
                lastName: data.data.customer_lastName ,
                email: data.data.customer_email ,
                adress: data.data.customer_address ,
                city : data.data.customer_city,
                zip : data.data.customer_zip
            })
        })
    }

    componentDidMount() {
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})
                    if(cookies.admin !== 'undefined'){
                        this.setState({admin : cookies.admin})
                    }
                    this.getUserInfo()
                    
                }
            })
        }
        
    }
    edit(){
        axios({
            method : 'patch',
            url : 'http://'+base_url+':5000/customers/'+this.state.username,
            auth : {
                username : this.state.username,
                password : this.state.token
            },
            data : {
                customer_name :this.state.name,
                customer_lastName: this.state.lastName ,
                customer_email: this.state.email ,
                customer_adress: this.state.adress ,
                customer_city : this.state.city,
                customer_zip : this.state.zip
            }
        }).then((data)=>{
            this.getUserInfo()
            this.setState({change : false})
        })
    }
    logOut(){
        cookie.remove('user')
        window.location = '/'
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
                this.getUserInfo()

            })
            .catch((error) => {
                this.setState({
                    email: '',
                    password: ''
                })
            })
    }

    render(){
        return(
            <div>
                <Navbar brand='TornioPizza' right>
                {this.state.admin ? <NavItem href='/orders'>Orders Lists</NavItem> : <div></div>}

                    <NavItem href='/'>Menu</NavItem>
                    {this.state.isAuth ? <NavItem href='#' >Hi {this.state.username}</NavItem> : <NavItem href='#' onClick={() => { this.setState({ childVisible: !this.state.childVisible }) }}>Log In</NavItem>}
                </Navbar>
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
                { this.state.isAuth ? 
                <div className='container'>
                    <h1>My account</h1>
                    { this.state.change ? 
                    <Col style={{marginLeft : 20, marginRight : 20}}>
                        <h5>First Name</h5>
                        <Input type='text' placeholder='First Name' onChange={(change)=>{this.setState({name : change.target.value})}} value={this.state.name}/>
                        <h5>Last Name</h5>
                        <Input type='text' placeholder='Last name' onChange={(change)=>{this.setState({lastName : change.target.value})}} value={this.state.lastName}/>
                        <h5>Address</h5>
                        <Input type='text' placeholder='Address' onChange={(change)=>{this.setState({address : change.target.value})}} value={this.state.adress}/>
                        <h5>City</h5>
                        <Input type='text' placeholder='City' onChange={(change)=>{this.setState({city : change.target.value})}} value={this.state.city}/>
                        <h5>Zip Code</h5>
                        <Input type='number' placeholder='Zip Code' onChange={(change)=>{this.setState({zip : change.target.value})}} value={this.state.zip}/>
                        <h5>Email</h5>
                        <Input type='email' placeholder='Email' onChange={(change)=>{this.setState({email : change.target.value})}} value={this.state.email}/>
                        <Row>
                            <Button onClick={()=>this.setState({change : false})}>Cancel</Button>
                            <Button style={{marginLeft : 20}} onClick={this.edit.bind(this)}>Save change</Button>
                        </Row>

                    </Col> :
                    <Col style={{marginLeft : 20, marginRight : 20}}>
                        <h5>First Name</h5>
                        <p>{this.state.name}</p>
                        <h5>Last Name</h5>
                        <p>{this.state.lastName}</p>
                        <h5>Address</h5>
                        <p>{this.state.adress}</p>
                        <h5>City</h5>
                        <p>{this.state.city}</p>
                        <h5>Zip Code</h5>
                        <p>{this.state.zip}</p>
                        <h5>Email</h5>
                        <p>{this.state.email}</p>
                        
                        <Button onClick={()=>this.setState({change : true})}>Edit</Button>
                        <Button className='red right' onClick={this.logOut.bind(this)}>Log out</Button>
                    </Col>
                    }
                </div>
                :
                <h4>Please Log In</h4>
                }
            </div>
        )
    }

}
    