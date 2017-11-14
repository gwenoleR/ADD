import React from 'react';
import axios from 'axios';

import {
    Input,
    Button,
    Row
} from 'react-materialize';
import cookie from 'react-cookies';

const base_url = window.location.hostname;

export default class EditCustomer extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            customer_name: this.props.customer_name,
            customer_lastName:this.props.customer_lastName,
            customer_email:this.props.customer_email,
            customer_address:this.props.customer_address,
            customer_city:this.props.customer_city,
            customer_zip:this.props.customer_zip,
            customer_admin:this.props.customer_admin,
            username : '',
            token : ''
        }
    }

    componentDidMount() {
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})               
                }
            })
        }
        this.state.customer_admin ? this.setState({customer_admin:1}) : this.setState({customer_admin:0})
    }

    patchCustomer(){
        axios({
            method:'patch',
            url:'http://'+base_url+':5000/customers/'+this.props.customer_email,
            auth:{
                username:this.state.username,
                password:this.state.token
            },
            data:{
                'customer_name': this.state.customer_name,
                'customer_lastName':this.state.customer_lastName,
                'customer_email':this.state.customer_email,
                'customer_address':this.state.customer_address,
                'customer_city':this.state.customer_city,
                'customer_zip':this.state.customer_zip,
                'customer_admin':this.state.customer_admin
            }
        }).then((data)=>{
            this.props.cancel_press()
            
        }).catch((error)=>{
        })
    }

    render() {
        return( 
            <div className='edit-customer'>
                <Input type='text' onChange={(change)=>{this.setState({customer_name : change.target.value})}} value={this.state.customer_name} label="First Name"/>
                <Input type='text' onChange={(change)=>{this.setState({customer_lastName : change.target.value})}} value={this.state.customer_lastName} label="Last Name"/>
                <Input type='text' onChange={(change)=>{this.setState({customer_email : change.target.value})}} value={this.state.customer_email} label="Email"/>                
                <Input type='text' onChange={(change)=>{this.setState({customer_address : change.target.value})}} value={this.state.customer_address} label="Address"/>                
                <Input type='text' onChange={(change)=>{this.setState({customer_city : change.target.value})}} value={this.state.customer_city} label="City"/>                
                <Input type='number' onChange={(change)=>{this.setState({customer_zip : change.target.value})}} value={this.state.customer_zip} label="Zip code"/>  
                <h7>Is Admin ?</h7>              
                <Row>
                    <Input name='group1' type='radio' value='true' label='Yes' onChange={(change)=>{this.setState({customer_admin : 1})}} checked={this.state.customer_admin == 1 ? 'checked' : ''}/>
                    <Input name='group1' type='radio' value='false' label='No' onChange={(change)=>{this.setState({customer_admin : 0})}} checked={this.state.customer_admin == 0 ? 'checked' : ''}/>
                </Row>             
                
                <Button s={6} style={{marginTop : 10, marginBottom: 10}} onClick={()=>this.patchCustomer()}>Edit</Button>
                <Button s={6} style={{marginTop : 10, marginBottom: 10}} className='red right' onClick={this.props.cancel_press}>Cancel</Button>
            </div>
         )
    }
}

