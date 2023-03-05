/* jshint devel: true, node: true */
var express = require('express');

//TODO: refactor player -> contender

mongoose = require('mongoose');
mongoose.connect('localhost:27017');

var Player = new Schema({
	firstname: String,
	surname: String,
	country: String,
//	dob: 
});

var Player = mongoose.model('Player', Player);

module.exports = function(app){
app.get('/api/players', function(req, res){
	return Player.find(function(error, players){
		if(!error){
			return res.json(players);
		}else{
			return console.log(error);
		}
	});
});

app.get('/api/players/:id', function(req, res){
	return Players.findById(req.params.id, function(error, Player){
		if(!error){
			return res.json(Player)
		}else{
			return console.log(error);
		}
	});
});

app.post('/api/Player', function(req, res){
	var Player;

	console.log('post:');
	console.log(req.body);

	Player = new Players({
		firstname : req.body.firstname,
		surname : req.body.surname,
		country : req.body.country
		//dob : req.body.dob
	});

	Player.save(function(error){
		if(!error){
			return console.log('added');
		}else{
			return console.log(error);
		}
	});
	return res.json(Player);
});

app.delete('/api/Players/:id', function(req, res){
	return Players.findById(req.params.id, function(error, Player){
		return Player.remove(function(error){
			if(!error){
				return res.json(Player);
			}else{
				return console.log(error)
			}
		});
	});
});

app.put('/api/Players/:id', function(req, res){
	return Players.findById(req.params.id, function(error, Player){
		Player.firstname = req.body.firstname,
		Player.surname = req.body.surname,
		Player.country = req.body.country
		//Player.dob = req.body.dob
		return Player.save(function(error){
			if(!error){
				return res.json(Player);
			}else{
				return console.log(error)
			}
		});
	});
});
};
