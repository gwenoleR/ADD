import React from 'react';
import {
    Chip,
    Row,
    Button
} from 'react-materialize'

export default class Basket extends React.Component{
    render(){
        return(
            <Row className='row-chip'>
                <Chip s={12}>
                    <img src={this.props.image} alt='Pizza' />
                    {this.props.name}
                    <Button floating small className='red' waves='light' icon='delete' style={{float: 'right',marginTop: 5}} onClick={this.props.delete}/>
                </Chip>
            </Row>
        )
    }
}