import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import cronstrue from 'cronstrue/i18n';
import { metadata, loadHeaders, HEADER_VALUES } from './meta';
import './cron-builder.css';

var Cron = /*#__PURE__*/function (_Component) {
  _inherits(Cron, _Component);

  var _super = _createSuper(Cron);

  function Cron(props) {
    var _this;

    _classCallCheck(this, Cron);

    _this = _super.call(this, props);
    _this.state = {
      headers: loadHeaders(_this.props.options),
      locale: _this.props.locale ? _this.props.locale : 'en'
    };
    return _this;
  }

  _createClass(Cron, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (!this.props.value || this.props.value.split(' ').length !== 7) {
        this.state.value = ['0', '0', '00', '1/1', '*', '?', '*'];
        this.state.selectedTab = HEADER_VALUES.DAILY;
        this.parentChange(this.state.value);
      } else {
        this.state.value = this.props.value.replace(/,/g, '!').split(' ');
      }

      var val = this.state.value;

      if (val[1].search('/') !== -1 && val[2] === '*' && val[3] === '1/1') {
        this.state.selectedTab = HEADER_VALUES.MINUTES;
      } else if (val[3].search('/') !== -1 || val[5] === 'MON-FRI') {
        this.state.selectedTab = HEADER_VALUES.DAILY;
      } else if (val[3] === '1/1') {
        this.state.selectedTab = HEADER_VALUES.HOURLY;
      } else if (val[3] === '?') {
        this.state.selectedTab = HEADER_VALUES.WEEKLY;
      } else if (val[3].startsWith('L') || val[4] === '1/1') {
        this.state.selectedTab = HEADER_VALUES.MONTHLY;
      } else {
        this.state.selectedTab = HEADER_VALUES.DAILY;
      }

      if (this.props.translateFn && !this.props.locale) {
        console.log('Warning !!! locale not set while using translateFn');
      }
    }
  }, {
    key: "tabChanged",
    value: function tabChanged(tab) {
      this.setState({
        selectedTab: tab,
        value: this.defaultValue(tab)
      });
      this.parentChange(this.defaultValue(tab));
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      var _this2 = this;

      return this.state.headers.map(function (d, index) {
        return /*#__PURE__*/React.createElement("li", {
          key: index,
          className: _this2.state.selectedTab === d ? 'active' : ''
        }, /*#__PURE__*/React.createElement("a", {
          onClick: _this2.tabChanged.bind(_this2, d)
        }, d));
      });
    }
  }, {
    key: "onValueChange",
    value: function onValueChange(val) {
      if (val && val.length) {
        this.setState({
          value: val
        });
      } else {
        this.setState({
          value: ['0', '0', '00', '1/1', '*', '?', '*']
        });
        val = ['0', '0', '00', '1/1', '*', '?', '*'];
      }

      this.parentChange(val);
    }
  }, {
    key: "parentChange",
    value: function parentChange(val) {
      var newVal = '';
      newVal = val.toString().replace(/,/g, ' ');
      newVal = newVal.replace(/!/g, ',');
      this.props.onChange(newVal);
    }
  }, {
    key: "getVal",
    value: function getVal() {
      try {
        var val = cronstrue.toString(this.state.value.toString().replace(/,/g, ' ').replace(/!/g, ','), {
          locale: this.state.locale
        });

        if (val.search('undefined') === -1) {
          return val;
        }

        return '-';
      } catch (err) {
        return '-';
      }
    }
  }, {
    key: "defaultValue",
    value: function defaultValue(tab) {
      var index = this.state.headers.indexOf(tab);

      if (metadata[index] === -1) {
        return;
      }

      return metadata.find(function (data) {
        return data.name === tab;
      }).initialCron;
    }
  }, {
    key: "getComponent",
    value: function getComponent(tab) {
      var index = this.state.headers.indexOf(tab);

      if (metadata[index] === -1) {
        return;
      }

      var selectedMetaData = metadata.find(function (data) {
        return data.name === tab;
      });

      if (!selectedMetaData) {
        selectedMetaData = metadata[index];
      }

      if (!selectedMetaData) {
        throw new Error('Value does not match any available headers.');
      }

      var CronComponent = selectedMetaData.component;
      return /*#__PURE__*/React.createElement(CronComponent, {
        translate: this.translate.bind(this),
        value: this.state.value,
        onChange: this.onValueChange.bind(this)
      });
    }
  }, {
    key: "translate",
    value: function translate(key) {
      var translatedText = key;

      if (this.props.translateFn) {
        translatedText = this.props.translateFn(key);

        if (typeof translatedText !== 'string') {
          throw new Error('translateFn expects a string translation');
        }
      }

      return translatedText;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "cron_builder"
      }, /*#__PURE__*/React.createElement("ul", {
        className: "nav nav-tabs"
      }, this.getHeaders()), /*#__PURE__*/React.createElement("div", {
        className: "cron_builder_bordering"
      }, this.getComponent(this.state.selectedTab)), this.props.showResultText && /*#__PURE__*/React.createElement("div", {
        className: "cron-builder-bg"
      }, this.getVal()), this.props.showResultCron && /*#__PURE__*/React.createElement("div", {
        className: "cron-builder-bg"
      }, this.state.value.toString().replace(/,/g, ' ').replace(/!/g, ',')));
    }
  }]);

  return Cron;
}(Component);

export { Cron as default };