const React = require('react');
const { Component }  = React;
const { Link, browserHistory } = require('react-router');


const onSubmitHandler = e => {
  e.preventDefault();
  return fetch('/api/email', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'manas@likewyss.com'
    })
  });
};

const redirect = ({params, location: { query }}) => {
  browserHistory.push(query.next);
};

module.exports = props => {
  return (
    <div>
      <form onSubmit={e => onSubmitHandler(e).then(response => redirect(props))}>
        <label>Please enter email</label>
        <input type="email" name="email" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
