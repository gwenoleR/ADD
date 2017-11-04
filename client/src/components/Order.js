import React from 'react';
import {
    Button
} from 'react-materialize';
import axios from 'axios';

const base_url = window.location.hostname;

export default class Order extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            icon_state: '',
            livre : false,
            customer : {},
            state_save : this.props.state
        }
    }

    showIcon(){
        var icon = ''
        if(this.state.state_save === 'new_order'){
            icon =  'arrow_forward';
        }
        if(this.state.state_save === 'prepa_order'){
            icon =  'done';
        }
        if(this.state.state_save === 'livraison_order'){
            icon =  'done_all';
        }
        if(this.state.state_save === 'livre_order'){
            this.setState({livre : true})
            icon =  'done_all';
        }
        console.log(this.state.state_save)
        this.setState({icon_state : icon})

    }

    componentDidMount(){
        axios({
                url : 'http://'+base_url+':5000/customers/'+this.props.customer_username,
                method : 'get',
                auth : {
                    username : this.props.username,
                    password : this.props.password
                }
            }).then((data)=>{
                this.setState({customer : data.data})
            })
        this.showIcon()
    }

    changeState(){
        var new_state = ''
        switch(this.props.state){
            case 'new_order':
                new_state =  'prepa'
                break;
            case 'prepa_order':
                new_state =  'livraison'
                break;
            case 'livraison_order':
                new_state =  'livre'
                break;
            case 'livre_order':
                new_state =  'livre'
                break;
            default :
                new_state =  'new'
                break;
        }
        axios({
            method:'patch',
            url: 'http://'+base_url+':5000/orders/'+this.props.oid,
            data:{
                order_state : new_state
            }
        }).then((data)=>{
            this.setState({state_save : new_state+'_order'})
            this.showIcon()
            this.props.newState()
        })
    }

    render(){
        var pizzaListHtml = []
        JSON.parse(this.props.pizzas).forEach(function(pizza) {
            pizzaListHtml.push(<li>{pizza.pizza_name}</li>)
        }, this);

        var date = this.props.date.split(' ')
        var day = date[0].split('-')

        

        return(
            <div className={"order-card "+this.props.state}>
            <h4>{date[1]} <span className='right small-h4'>{day[2]}.{day[1]}.{day[0]}</span></h4>
            <ul>{pizzaListHtml}</ul>
            <h5>Addresse de livraison</h5>
            <p>{this.state.customer.customer_address} - {this.state.customer.customer_city} {this.state.customer.customer_zip}</p>
            {!this.state.livre && this.props.isAdmin ? <Button floating large className='red order_state' waves='light' icon={this.state.icon_state} onClick={this.changeState.bind(this)}/> : <div></div>}
            </div>
        )
    }
}