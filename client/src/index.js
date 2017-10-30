import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var test='[{"pizza_available": true, "pizza_name": "4 Fromages", "pid": "5efc105f-96f2-493a-a643-05d4d2c2b1da", "pizza_description": "Une belle pizza pleine de fromage", "pizza_price": 12.0, "pizza_picture": "test.jpg"}, {"pizza_available": false, "pizza_name": "toDelete", "pid": "", "pizza_description": "delete", "pizza_price": 1.2, "pizza_picture": "test.jpg"}]'

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
        //recuperation des data a faire
        console.log(test);
        var pizzas=JSON.parse(test);
        console.log(pizzas);
        var htmlpizza=[];
        for(var i=0; i<pizzas.length;i++){
            htmlpizza.push(this.renderPizza(pizzas[i]["pizza_name"], pizzas[i]["pizza_picture"], pizzas[i]["pizza_description"], pizzas[i]["pizza_price"]));
        }
        // a mettre dans une boucle pour chaque pizza recupéré du server
      return htmlpizza;
        
    
    }
  }

  
  // ========================================
  
  ReactDOM.render(
    <Pizzeria />,
    document.getElementById('root')
  );
