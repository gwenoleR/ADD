import React from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

export default class FacebookLog extends React.Component {
  responseFacebook(response) {
    console.log(response);
    axios.post('http://192.168.8.102:5000/login/facebook',{
      id : response.id,
      token: response.token
    })
  }

  render() {
    return (
      <FacebookLogin
        appId="330873180727492"
        autoLoad={true}
        fields="name,email,picture"
        callback={this.responseFacebook}
        cssClass="btn fb"
      />
    )
  }
}
