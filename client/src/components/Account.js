import React from 'react';
import '../index.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {
    Col,
    Navbar,
    NavItem,
    Button,
    Input,
} from 'react-materialize'

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
            city : ''
        };
    }

    getUserInfo(){
        axios({
            method : 'get',
            url : 'http://localhost:5000/customers/'+this.state.username,
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
                city : data.data.customer_city
            })
        })
    }

    componentDidMount() {
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})
                    this.getUserInfo()
                    
                }
            })
        }
        
    }
    render(){
        return(
            <div>
                <Navbar brand='TornioPizza' right>
                    <NavItem href='/'>Menu</NavItem>
                    {this.state.isAuth ? <NavItem href='#' >Hi {this.state.username}</NavItem> : <NavItem href='#' onClick={() => { this.setState({ childVisible: !this.state.childVisible }) }}>Log In</NavItem>}
                </Navbar>
                <div className='container'>
                    <h1>My account</h1>
                    <Col>
                        <Input type='text' placeholder='Name' onChange={(change)=>{this.setState({name : change.target.value})}}/>
                        <Input type='text' placeholder='Last name' onChange={(change)=>{this.setState({lastName : change.target.value})}}/>
                        <Input type='text' placeholder='Address' onChange={(change)=>{this.setState({address : change.target.value})}}/>
                        <Input type='text' placeholder='City' onChange={(change)=>{this.setState({city : change.target.value})}}/>
                        <Input type='email' placeholder='Email' onChange={(change)=>{this.setState({email : change.target.value})}}/>
                        <Input type='password' placeholder='Password' onChange={(change)=>{this.setState({password : change.target.value})}}/>
                        {/* <Button onClick={this.signup.bind(this)}>Sign up</Button> */}

                    </Col>
                    <Col>
                        <h5>Name</h5>
                        <p>{this.state.name}</p>
                        <h5>Last Name</h5>
                        <p>{this.state.lastName}</p>
                        <h5>Address</h5>
                        <p>{this.state.adress}</p>
                        <h5>City</h5>
                        <p>{this.state.city}</p>
                        <h5>Email</h5>
                        <p>{this.state.email}</p>
                    </Col>
                </div>
            </div>
        )
    }

}
    