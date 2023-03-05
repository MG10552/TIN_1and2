// edycja numerów startowych
// edycja listy startowej: dodaj, usuń zawodników
// grupa igentyfikowana TAGiem
// lista startowa to: zawodnicy, zawody, grupy
// inter za pomocą Bootstrapa?

/* jshint devel: true, node: true */
var express = require('express');

//TODO: zrobić sędziów dodaj do mongo, odczytaj, usuń, edytuj RESTem, HTTP

mongoose = require('mongoose');
mongoose.connect('localhost:27017');

var Schema = mongoose.Schema;

var Group = new Schema({
	//co ma być w grupie?
    TAG: String,
    //Contestants: ,
    //Judges: 
    //firstname: String,
	//surname: String,
	//country: String
});
var Groups = mongoose.model('Group', Group);

});
module.exports = function(app){
	app.post('/api/group', function(req, res){
		var group;
		console.log('post:');
		console.log(req.body);

		group = new Groups({
			TAG: req.body.TAG,
			//surname: req.body.surname,
			//country: req.body.country
		});

		group.save(function(error){
			if(!error){
				return console.log('added');
			}else{
				return console.log(error)
			}
		});
		return res.send(group);
	});

	app.get('/api/groups/:id', function(req, res){
		return groups.findById(req.params.id, function(error, group){
			if(!error){
				return res.send(group);
			}else{
				return console.log(error)
			}
		});
	});

	app.delete('/api/groups/:id', function(req, res){
		return Groups.findById(req.params.id, function(error, group){
			return group.remove(function(error){
				if(!error){
					return res.send(group);
				}else{
					return console.log(error)
				}
			});
		});
	});

	app.put('/api/groups/:id', function(req, res){
		return Groups.findById(req.params.id, function(error, group){
			group.TAG = req.body.TAG;
			//judge.surname = req.body.surname;
			//judge.country = req.body.country;
			return group.save(function(error){
				if(!error){
					return res.send(group);
				}else{
					return console.log(error)
				}
			});
		});
	});
}