'use strit'


let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let Ddos = require('ddos');

let ddos = new Ddos({ burst: 10, limit: 15 });
let configs = require('../configs');
let port = configs.port;
let init_routes = require('../routes/server');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(ddos.express);

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin , X-Requested-With , Content-Type , Accept , Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT , DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT , DELETE');
    next();
});


app.use('/api', init_routes);

app.get('*', function(req, res) {
    res.status(500).send({ status: false, msg: 'ERROR' });
});

app.post('*', function(req, res) {
    res.status(500).send({ status: false, msg: 'ERROR' });
});

app.put('*', function(req, res) {
    res.status(500).send({ status: false, msg: 'ERROR' });
});

app.delete('*', function(req, res) {
    res.status(500).send({ status: false, msg: 'ERROR' });
});


app.listen(port, async() => {
    console.log('Servidor corriendo correctamente');
});