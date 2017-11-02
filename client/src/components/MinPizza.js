import React from 'react';
import {
    Chip,
    Row,
} from 'react-materialize'

export default class Basket extends React.Component{
    render(){
        return(
            <Row className='row-chip'>
                <Chip s={12}>
                    <img src={this.props.image} alt='Pizza' />
                    {this.props.name}
                </Chip>
            </Row>
        )
    }
}