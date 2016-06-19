const React = require('react');
const {
  Route,
  IndexRoute,
  IndexRedirect
} = require('react-router');
const AppContainer = require('../app-container.js');
const EmailRequest = require('../views/email-request');
const PDFUpload = require('../views/pdf-upload');
const PDF = require('../views/pdf-view');

module.exports = (
    <Route path="/" component={AppContainer}>
      <IndexRoute component={PDFUpload} />
      <Route path="/email-request" component={EmailRequest} />
      <Route path="pdf" component={PDF} />
    </Route>
);
