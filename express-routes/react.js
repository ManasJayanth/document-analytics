const express = require('express');
const router = express.Router();
const React = require('react');
const { renderToString } = require('react-dom/server');
const { match, RouterContext } = require('react-router');
const reactRoutes = require('../server/dist/main');

router.get('*', function(req, res, next) {
  match({ routes: reactRoutes, location: req.path }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.render(
        'index', {
          html: renderToString(
            React.createElement(RouterContext, renderProps)
          )
        }
      );
    } else {
      res.status(404).send('Not found')
    }
  });
});

module.exports = router;
