//tp jest to z lab (odpalales go na kompie? czy lap? ) stcary kurna ja mialem 2 semestry sieci pecetowe, nie możliwe żeby to dzialalo z lap-komp, komp-komp tak, lap-lap mozliwe, n oto lap-lap musi być bo on chodzi z lapkiem i sprawdza,
//piłąt i kuklewicz wzięli właśnie to co na dole i im działa. no to przerobic trzeba mozesz pisac?t zn? mylalem ze 
// przylapal Cie
/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

var static = require('serve-static');
var less = require('less-middleware');
var path = require('path');
var port = process.env.PORT || 3000;

var oneDay = 86400000;

app.use(less(path.join(__dirname, 'public')));
app.use('/img', static(__dirname + '/public/img', { maxAge: oneDay }));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(static(path.join(__dirname, '/public')));

io.sockets.on("connection", function (socket) {
    socket.on("message", function (data) {
        io.sockets.emit("echo", "No tak, tak – dostałem: " + data);
    });
    socket.on("error", function (err) {
        console.dir(err);
    });
});

httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
// musi, SERIO. Tyle ze komp-lap NIE POWINNO DZIALAC!!!!! to jest niemożliwe, dobra a działą teraz tutaj? sec.
// to moze cos z IP nie tak? bo jest jak tutaj, wedlug przykladu, ale co? nic nie zmieniałem. nie wiem serio,
// jest wedlug przykladu, nie odpalam tam bin/www, tylko app, jak tu. dobra w przeglądarce wpisuje ip i numer portu to :, tak? no kurde tak ip:port, no to nie działan na pc. sec. lol? tutaj działa po IP. chwila, firewall? wylacz go, nie mogę na kompie uczelnianym, tutaj na laptopie, gdzie to jest xD?zapora. cały czas jest address unreachable, z
// a jak teraz wystartuje server przez bin/www? nie musisz juz Ctrl-C, dobra niby działa. zaraz go zapytam to jak coś to bądź jeszcze na fejsie i narazie disconnect. k? ok