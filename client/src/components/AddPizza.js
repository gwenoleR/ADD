import React from 'react';
import axios from 'axios';

import {
    Input,
    Button
} from 'react-materialize';
import cookie from 'react-cookies';

const base_url = window.location.hostname;

export default class AddPizza extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            name : '',
            description : '',
            picture : '',
            price : 0,
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
                    
                }
            })
        }
        
    }

    createPizza(){
        axios({
            method : 'post',
            url : 'http://'+base_url+':5000/pizzas',
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
                <Input type='text' onChange={(change)=>{this.setState({name : change.target.value})}} label="Name"/>
                <Input type='text' onChange={(change)=>{this.setState({description : change.target.value})}} label="Description"/>
                <Input type='number' onChange={(change)=>{this.setState({price : change.target.value})}} label="Price"/>                
                <Input type="file" id="imageFile" name='imageFile' onChange={this.imageUpload} />
                
                <Button s={6} style={{marginTop : 10, marginBottom: 10}} onClick={()=>{this.createPizza();}}>Create</Button>
                <Button s={6} style={{marginTop : 10, marginBottom: 10}} className='red right' onClick={this.props.cancelPress}>Cancel</Button>
            </div>
         )
    }

}

