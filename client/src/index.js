import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import {
    Row,
    Col,
    Navbar,
    NavItem,
    Slider,
    Slide,
    Button,
    Input,
} from 'react-materialize'
import Pizza from './components/Pizza'
import PizzaAdmin from './components/PizzaAdmin'

// class LogInForm extends React.Component{
//     constructor(props){
//         super(props);

//         this.state= {
//             email : '',
//             password : ''
//         }
//     }
//     render() {
//       return (
//         // <form action='http://192.168.8.102:5000/login' method='POST'>
//         <Col >
//             <Input style={{marginLeft : 10, marginRight : 10}} type='text' onChange={(change)=> {this.setState({email : change.target.value})}} placeholder='Email'/>
//             <Input style={{marginLeft : 10, marginRight : 10}} type='password' onChange={(change)=> {this.setState({password : change.target.value})}} placeholder='Password'/>
//             <Button style={{marginLeft : 10, marginRight : 10, marginBottom:10}} onClick={this.props.loginPress }>Log in</Button>
//         </Col>
//     //    </form>
//     );
//     }
//   };
  

class Pizzeria extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pizzas: [],
            admin: false,
            childVisible: false,
            email : "",
            password : "",
        };
    }

    _getPizzas() {
        axios.get('http://192.168.8.102:5000/pizzas')
            .then((pizzas) => {
                this.setState({ pizzas: pizzas.data })
                console.log(this.state.pizzas)
            })
    };

    componentDidMount() {
        this._getPizzas()
    }

    renderPizza(name, image, desc, price) {
        return (
            <Pizza img={image} name={name} description={desc} price={price} />
        )
    }
    renderPizzaAdmin(name, image, desc, price) {
        return (
            <PizzaAdmin img={image} name={name} description={desc} price={price} />
        )
    }

    loginPress(){
        console.log('email',this.state.email)
        console.log('pass',this.state.password)
        // TODO : Creer route de login
    }

    render() {
        var pizzas = this.state.pizzas;
        var htmlpizza = [];
        var i;

        if (!this.state.admin) {
            for (i = 0; i < pizzas.length; i++) {
                htmlpizza.push(this.renderPizza(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
            }
        }
        else {
            for (i = 0; i < pizzas.length; i++) {
                htmlpizza.push(this.renderPizzaAdmin(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
            }
        }


        return (
            <div>
                <Navbar brand='TornioPizza' right>
                    <NavItem href='#'>Menu</NavItem>
                    <NavItem href='#' onClick={() => {this.setState({childVisible : !this.state.childVisible})}}>Log In</NavItem>
                </Navbar>
                {
                    this.state.childVisible
                        ? <Col >
                            <Input style={{marginLeft : 10, marginRight : 10}} type='text' onChange={(change)=> {this.setState({email : change.target.value})}} placeholder='Email'/>
                            <Input style={{marginLeft : 10, marginRight : 10}} type='password' onChange={(change)=> {this.setState({password : change.target.value})}} placeholder='Password'/>
                            <Button style={{marginLeft : 10, marginRight : 10, marginBottom:10}} onClick={this.loginPress.bind(this) }>Log in</Button>
                         </Col>
                        : null
                }
                <Slider>
                    <Slide
                        src="assets/images/s1.jpg"
                        title="This is our big Tagline!"
                        style={{ color: 'black' }}>
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s2.jpeg"
                        title="Left aligned Caption"
                        placement="left"
                        style={{ color: 'black' }}>
                        Here's our small slogan.
	                </Slide>
                    <Slide
                        src="/assets/images/s3.jpeg"
                        title="Right aligned Caption"
                        placement="right"
                        style={{ color: 'black' }}>
                        Here's our small slogan.
	                </Slide>
                </Slider>
                <Row style={{ margin: 70 }}>
                    {htmlpizza}
                </Row>
            </div>
        );


    }
}


// ========================================

ReactDOM.render(
    <Pizzeria />,
    document.getElementById('root')
);
