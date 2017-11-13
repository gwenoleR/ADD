import React from 'react';
import {
    Button,
    Icon
} from 'react-materialize';
import axios from 'axios';

const base_url = window.location.hostname;

export default class Customer extends React.Component{

    render(){
        return(
            <tr>
                <td>{this.props.customer_name}</td>
                <td>{this.props.customer_lastName}</td>
                <td>{this.props.customer_email}</td>
                <td>{this.props.customer_address} - {this.props.customer_city} {this.props.customer_zip}</td>
                <td>{this.props.customer_admin}</td>
                <td>
                    <Button><Icon>edit</Icon></Button>
                </td>
            </tr>
        )
    }
    
}
