import React from 'react';
import {
    Card,
    CardTitle,
    Col,
    Button,
    Icon,
    // Input
} from 'react-materialize'

export default class PizzaAdmin extends React.Component {
    render() {
        return (
            <Col m={7} s={12} className="pizza">
                <Card horizontal
                    header={<CardTitle style={{color : 'black'}} className='no-padding' image={this.props.img}><span className='font-black price' >{this.props.price} €</span></CardTitle>}
                    title={this.props.name} 
                >
                    <p>{this.props.description}</p>
                    <hr/>
                    {/* <Row>
                        <Input className='with-gap font-black' name='size' type='radio' value='medium' label='Medium'/>
                        <Input className='with-gap font-black' name='size' type='radio' value='large' label='Large' />
                    </Row> */}

                    <Button waves='light' className="full-button" style={{marginHorizontal:10}}><Icon medium> add_shopping_cart</Icon></Button>
                    <Button waves='light' className="full-button" style={{marginHorizontal:10, marginTop : 10}}><Icon medium>edit</Icon></Button>
                    <Button waves='light' className="full-button red" style={{marginHorizontal:10, marginTop : 10}}><Icon medium>delete</Icon></Button> 
                </Card>
            </Col>
        );

    }
}