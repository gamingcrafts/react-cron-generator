/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import cronstrue from 'cronstrue/i18n';
import { metadata, loadHeaders, HEADER_VALUES} from './meta';
import './cron-builder.css';

export default class Cron extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            headers: loadHeaders(this.props.options),
            locale: this.props.locale ? this.props.locale : 'en'
        };
    }

    componentWillMount() {
        if(!this.props.value || this.props.value.split(' ').length !== 7 ) {
            this.state.value = ['0','0','00','1/1','*','?','*']
            this.state.selectedTab = HEADER_VALUES.DAILY;
            this.parentChange(this.state.value);
        } else  {
            this.state.value = this.props.value.replace(/,/g, '!').split(' ');
        }
        let val = this.state.value;
        if((val[1].search('/') !== -1) && (val[2] === '*') && (val[3] === '1/1')) {
            this.state.selectedTab = HEADER_VALUES.MINUTES;
        } else if((val[3].search('/') !== -1) || (val[5] === 'MON-FRI')) {
            this.state.selectedTab = HEADER_VALUES.DAILY;
        } else if((val[3] === '1/1')) {
            this.state.selectedTab = HEADER_VALUES.HOURLY;
        } else if (val[3] === '?') {
            this.state.selectedTab = HEADER_VALUES.WEEKLY;
        } else if (val[3].startsWith('L') || val[4] === '1/1') {
            this.state.selectedTab = HEADER_VALUES.MONTHLY;
        } else {
            this.state.selectedTab = HEADER_VALUES.DAILY;
        }
        
        if(this.props.translateFn && !this.props.locale) {
            console.log('Warning !!! locale not set while using translateFn');
        }
    }

    tabChanged(tab) {
        this.setState({selectedTab: tab, value:this.defaultValue(tab) }); 
        this.parentChange(this.defaultValue(tab))
    }

    getHeaders() {
        return this.state.headers.map((d, index) => {
            return <li key={index} className={this.state.selectedTab === d ? 'active' : ''}><a onClick={this.tabChanged.bind(this,d)}>{d}</a></li>
        })
    }

    onValueChange(val) {     
        if(val && val.length) {
            this.setState({ value:val });
        } else { 
            this.setState({ value: ['0','0','00','1/1','*','?','*'] });
            val = ['0','0','00','1/1','*','?','*'];
        }
       this.parentChange(val)
    }

    parentChange(val) {
        let newVal = '';
        newVal = val.toString().replace(/,/g,' ');
        newVal = newVal.replace(/!/g, ',');
        this.props.onChange(newVal) 
    }

    getVal() {
        try {
            let val = cronstrue.toString(this.state.value.toString().replace(/,/g,' ').replace(/!/g, ','), {
                locale: this.state.locale
            })
            if(val.search('undefined') === -1) {
                return val;
            }
            return '-';   
        } catch (err) {
            return '-';
        }
        
    }

    defaultValue(tab) {
        const index = this.state.headers.indexOf(tab);
        if(metadata[index] === -1) {
            return;
        }
        return metadata.find(data => data.name === tab).initialCron;
    }

    getComponent(tab) {
        const index = this.state.headers.indexOf(tab);
        if(metadata[index] === -1) {
            return;
        }
        let selectedMetaData = metadata.find(data => data.name === tab)
        if(!selectedMetaData) {
            selectedMetaData = metadata[index];
        }
        if(!selectedMetaData) {
            throw new Error('Value does not match any available headers.');
        }
        const CronComponent = selectedMetaData.component;
        return <CronComponent translate={this.translate.bind(this)} value={this.state.value} onChange={this.onValueChange.bind(this)} />;
    }

    translate(key) {
        let translatedText = key;
        if(this.props.translateFn) {
            translatedText = this.props.translateFn(key);
            if(typeof translatedText !== 'string') {
                throw new Error('translateFn expects a string translation');
            }
        }
        return translatedText;
    }

    render() {
        return (    
            <div className='cron_builder'>
            <ul className="nav nav-tabs" >
                {this.getHeaders()}
            </ul>
            <div className="cron_builder_bordering">{this.getComponent(this.state.selectedTab)}</div>
            {this.props.showResultText && <div className="cron-builder-bg">{this.getVal()}</div>}
            {this.props.showResultCron && <div className="cron-builder-bg">{this.state.value.toString().replace(/,/g,' ').replace(/!/g, ',')}</div>}       
        </div>)
    }
}
