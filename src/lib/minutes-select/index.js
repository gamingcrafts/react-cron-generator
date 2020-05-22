import React, { Component } from 'react';

export default class Minutes extends Component {

    render() {
        return (<select disabled={this.props.disabled === true ? true : false} className="minutes" onChange={this.props.onChange ? this.props.onChange : () => {}} value={this.props.value} >
            <option key={0} id={0}>{`00`}</option>
            <option key={15} id={15}>{`15`}</option>
            <option key={30} id={30}>{`30`}</option>
            <option key={45} id={45}>{`45`}</option>
        </select>)
    }

    buildOptions() {
        let options = [];
        for(let i = 0; i < 60; i++) {
            options.push(<option key={i} id={i}>{(i < 10 ? '0' : '') + i}</option>)
        }
        return options;
    }
    
}

