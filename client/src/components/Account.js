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
            change : false,
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
                customer_city : this.state.city
            }
        }).then((data)=>{
            this.getUserInfo()
            this.setState({change : false})
        })
    }
    logOut(){
        cookie.remove('user')
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
                    { this.state.change ? 
                    <Col style={{marginLeft : 20, marginRight : 20}}>
                        <h5>Name</h5>
                        <Input type='text' placeholder='Name' onChange={(change)=>{this.setState({name : change.target.value})}} value={this.state.name}/>
                        <h5>Last Name</h5>
                        <Input type='text' placeholder='Last name' onChange={(change)=>{this.setState({lastName : change.target.value})}} value={this.state.lastName}/>
                        <h5>Address</h5>
                        <Input type='text' placeholder='Address' onChange={(change)=>{this.setState({address : change.target.value})}} value={this.state.adress}/>
                        <h5>City</h5>
                        <Input type='text' placeholder='City' onChange={(change)=>{this.setState({city : change.target.value})}} value={this.state.city}/>
                        <h5>Email</h5>
                        <Input type='email' placeholder='Email' onChange={(change)=>{this.setState({email : change.target.value})}} value={this.state.email}/>
                        <Row>
                            <Button onClick={()=>this.setState({change : false})}>Cancel</Button>
                            <Button style={{marginLeft : 20}} onClick={this.edit.bind(this)}>Save change</Button>
                        </Row>

                    </Col> :
                    <Col style={{marginLeft : 20, marginRight : 20}}>
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
                        
                        <Button onClick={()=>this.setState({change : true})}>Edit</Button>
                        <Button className='red right' onClick={this.logOut.bind(this)}>Log out</Button>
                    </Col>
                    }
                </div>
            </div>
        )
    }

}
    