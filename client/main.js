const React = require( 'react');
const { render } = require( 'react-dom');
const {
  browserHistory
} = require( 'react-router');
const Router = require( '../react/router');
render(
  <Router history={browserHistory} />,
  document.getElementById('container')
);
