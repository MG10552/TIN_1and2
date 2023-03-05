/* jshint node: true */
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var less = require('less-middleware');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var baza = require('./db/taffy-min.js').taffy(require('./db/gminy').gminy);
var sortPL = require('./sort');

app.use(morgan('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));
app.use(express.static(path.join(__dirname, 'bower_components/fontawesome')));

app.get('/api/:woj/:reg', function (req, res) {
    var json = baza({
        woj: req.params.woj,
        gmina: {
            regex: new RegExp(req.params.reg)
        }
    }).select('gmina');
    res.json(json.sort(sortPL));
});

app.get('/api/:woj', function (req, res) {
    var json = baza({
        woj: req.params.woj
    }).select('gmina');
    res.json(json.sort(sortPL));
});

app.listen(3000, function () {
    console.log('Serwer działa na porcie 3000');
});


