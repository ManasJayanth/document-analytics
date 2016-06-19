const React = require('react');
const {
  Router
} = require('react-router');
const reactRoutes = require('./routes');

module.exports = props => {
  return (
    <Router history={props.history}>
       {reactRoutes}
    </Router>
  );
}
