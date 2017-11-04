import React from 'react';
import axios from 'axios';

import {
    Input,
    Button
} from 'react-materialize';
import cookie from 'react-cookies';

const base_url = window.location.hostname;

export default class EditPizza extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            name : this.props.name,
            description : this.props.description,
            picture : this.props.picture,
            price : this.props.price,
            username : '',
            token : ''
        }
    }
    
    getBase64 = (file) => {
        return new Promise((resolve,reject) => {
           const reader = new FileReader();
           reader.onload = () => resolve(reader.result);
           reader.onerror = error => reject(error);
           reader.readAsDataURL(file);
        });
    }

    imageUpload = (e) => {
        const file = e.target.files[0];
        this.getBase64(file).then(base64 => {
          this.setState({picture : base64})
        });
    };

    componentDidMount() {
        var cookies = cookie.load('user')

        if (typeof cookies !== 'undefined'){
            this.setState({username : cookies.username, token : cookies.token}, ()=>{
                if(this.state.username !== "" && this.state.token !== ""){
                    this.setState({isAuth : true})
                    this.setState({picture : this.props.picture})
                    
                }
            })
        }
        
    }

    editPizza(){
        axios({
            method : 'patch',
            url : 'http://'+base_url+':5000/pizzas/'+this.props.pid,
            data : {
                "pizza_name" : this.state.name,
                "pizza_price" : this.state.price,
                "pizza_description" : this.state.description,
                "pizza_picture" : this.state.picture
            },
            auth : {
                username : this.state.username,
                password : this.state.token
            }
        }).then((data)=>{
            this.props.cancelPress()
            
        }).catch((error)=>{
        })
    }

    render() {
        return( 
            <div className='add-pizza'>
                <Input type='text' onChange={(change)=>{this.setState({name : change.target.value})}} value={this.state.name} label="Name"/>
                <Input type='text' onChange={(change)=>{this.setState({description : change.target.value})}} value={this.state.description} label="Description"/>
                <Input type='number' onChange={(change)=>{this.setState({price : change.target.value})}} value={this.state.price} label="Price"/>                
                <Input type="file" id="imageFile" name='imageFile' onChange={this.imageUpload} />
                
                <Button s={6} style={{marginTop : 10, marginBottom: 10}} onClick={()=>{this.editPizza();}}>Edit</Button>
                <Button s={6} style={{marginTop : 10, marginBottom: 10}} className='red right' onClick={this.props.cancelPress}>Cancel</Button>
            </div>
         )
    }

}

