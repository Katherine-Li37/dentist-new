import React, { Component } from 'react';

export default class SearchBar extends Component{
    constructor(props) {
        super(props);        
        
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleInStockChange = this.handleInStockChange.bind(this);
    }
    
    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }
    
    handleInStockChange(e) {
        this.props.onInStockChange(e.target.checked);
    }
    
    render() {
      return (
        <form>
            <input
                type="text"
                placeholder="Search..."
                value={this.props.filterText}
                onChange={this.handleFilterTextChange}
            />
            <p>
            <input
                type="checkbox"
                checked={this.props.availableOnly}
                onChange={this.handleInStockChange}
            />
            {' '} 
            Only show available doctors
            </p>
        </form>
      );
    }
  }