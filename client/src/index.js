import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Pizza extends React.Component {
    render() {
        return (
            <div className="pizza" >
                <img src={this.props.img} alt={this.props.name} width="300" height="200"/>
                    <h1><span> {this.props.name}</span ><span className="price"> {this.props.price} $</span></h1>
                    <div> {this.props.description}</div>
            </div>
                );
                
      }
  }

  class Pizzeria extends React.Component {
    renderPizza(name, image, desc, price) {
        return <Pizza img={image} name={name} description={desc} price={price} />;
      }
      
    render() {
      return this.renderPizza("la classique", "test.jpg", "base tomate, jambon, fromage, champignon, chorizo, poivron, oignon", "15");
        
    
    }
  }

  
  // ========================================
  
  ReactDOM.render(
    <Pizzeria />,
    document.getElementById('root')
  );
