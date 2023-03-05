/* jshint devel: true, node: true */
var express = require('express');

mongoose = require('mongoose');
mongoose.connect('localhost:27017');

var Schema = mongoose.Schema;

var Judge = new Schema({
	firstname: String,
	surname: String,
	country: String
});
var Judges = mongoose.model('Judge', Judge);

});
module.exports = function(app){
	app.post('/api/judge', function(req, res){
		var judge;
		console.log('post:');
		console.log(req.body);

		judge = new Judges({
			firstname: req.body.firstname,
			surname: req.body.surname,
			country: req.body.country
		});

		judge.save(function(error){
			if(!error){
				return console.log('added');
			}else{
				return console.log(error)
			}
		});
		return res.send(judge);
	});

	app.get('/api/judges/:id', function(req, res){
		return Judges.findById(req.params.id, function(error, judge){
			if(!error){
				return res.send(judge);
			}else{
				return console.log(error)
			}
		});
	});

	app.delete('/api/judges/:id', function(req, res){
		return Judges.findById(req.params.id, function(error, judge){
			return judge.remove(function(error){
				if(!error){
					return res.send(judge);
				}else{
					return console.log(error)
				}
			});
		});
	});

	app.put('/api/judges/:id', function(req, res){
		return Judges.findById(req.params.id, function(error, judge){
			judge.firstname = req.body.firstname;
			judge.surname = req.body.surname;
			judge.country = req.body.country;
			return judge.save(function(error){
				if(!error){
					return res.send(judge);
				}else{
					return console.log(error)
				}
			});
		});
	});
}