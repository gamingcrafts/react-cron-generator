import React, { Component } from 'react';
import Cron from './lib';

import { HEADER } from './lib/meta';

const options = {
  headers: [HEADER.DAILY, HEADER.WEEKLY, HEADER.MONTHLY]
};

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
      };
  }

  render() {
    return (<div>
      <Cron
        onChange={(e)=> {this.setState({value:e});}}
        value={this.state.value}
        showResultText={true}
        showResultCron={true}
        options={options}
        />                 
    </div>)
  }
}

export default App;