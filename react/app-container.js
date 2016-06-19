const React = require('react');
const { Component } = React;
const { createStore } = require('redux');
const { Provider } = require('react-redux');
const appReducers = require('./redux');

const store = createStore(appReducers);

module.exports =  props => {
  return (
    <Provider store={store}>
      <div id="appView">
        {React.cloneElement(props.children, {})}
      </div>
    </Provider>
  );
};
