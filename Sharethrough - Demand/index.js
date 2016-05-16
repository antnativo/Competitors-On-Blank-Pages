var restify = require("restify");
var fs = require("fs");


//setup cors

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.fullResponse());
server.opts(/.*/, function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    res.send(200);
    return next();
});

server.get(/(plugin.js)/, function (req, res, next) {
    res.redirect('http://plugin.mediavoice.com/plugin.js', next);
});
server.get(/(.*)/,restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));

server.listen(8080, function() {
   console.log('%s listening at %s', server.name, server.url);
});
