(function () {
  'use strict';

  var http = require('http')
    , path = require('path')
    , connect = require('connect')
    , server
    , thisHost = 'redirect-www.org'
    , compressr = connect.compress()
    , cacher = connect.staticCache()
    , publicr = connect.static(path.join(__dirname, 'public'))
    ;

  function fourOhFour(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 404;
    res.write("404'd!");
    res.end();
  }

  function wwwToggle(req, res) {
    var wwwpart
      , protocol
      , href
      , host
      , hostname
      , msg
      , hostpart
      ;

    if (!req.headers.host) {
      fourOhFour(req, res);
      return;
    }

    host = req.headers.host.toLowerCase();
    hostname = host.split(':')[0];
    console.log(thisHost, hostname, hostname.slice(hostname.length - thisHost.length));
    if (thisHost === hostname.slice(hostname.length - thisHost.length)) {
      console.log(thisHost, hostname);
      if (wwwRedirect(req, res, hostname)) {
        return;
      }
    }

    protocol = 'http' + (req.connection.encrypted ? 's' : '') + '://';

    wwwpart = host.slice(0, 4);
    if ('www.' === wwwpart) {
      hostpart = req.headers.host.slice(4);
      href = protocol + hostpart + req.url;
    } else {
      hostpart = 'www.' + host;
      href = protocol + hostpart + req.url;
    }

    msg = 'Redirecting to <a href="' + href + '">' + hostpart + req.url + '</a>';
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 301;
    res.setHeader('Location', href);
    res.write(msg);
    res.end();
  }

  function servePages(req, res) {
    cacher(req, res, function () {
      compressr(req, res, function () {
        publicr(req, res, function () {
          fourOhFour(req, res);
        });
      });
    });   
  }

  function wwwRedirect(req, res, host) {
    if ('www.yes.redirect-www.org' === host) {
      servePages(req, res);
      return true;
    } else if ('no.redirect-www.org' === host) {
      servePages(req, res);
      return true;
    } else if ('redirect-www.org' === host) {
      servePages(req, res);
      return true;
    } else if ('www.redirect-www.org' === host) {
      servePages(req, res);
      return true;
    } else if (!/www\./.test(host)) {
      fourOhFour(req, res);
      return true;
    }
    return false;
  }

  server = http.createServer(wwwToggle);
  module.exports = server;

  function run () {
    var port = process.argv[2] || 80
      ;

    server.listen(port, function () {
      console.log(server.address());
    });
  }

  if (module === require.main) {
    run();
  }
}());
