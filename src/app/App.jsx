import React, { Component } from 'react';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: 1,
    }
  }

  async componentDidMount() {
    await setTimeout(() => this.setState(prev => ({counter: prev.counter+1})), 2000);
  }

  render() {
    return (
      <div>
        <h1>OMG</h1>
        <h2>{this.state.counter}</h2>
      </div>
    );
  }
}
