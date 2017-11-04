import React from 'react';
import '../index.css';

export default class Toast extends React.Component{
    render(){
        return(
            <div className={'toast '+this.props.type}>
                <p>{this.props.text}</p>
            </div>
        )
    }

}