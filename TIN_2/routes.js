mongoose = require('mongoose');

mongoose.connect('localhost:27017');
var Schema = mongoose.Schema;

var Judge = new Schema({
	firstname: String,
	surname: String,
	country: String
});
var Judges = mongoose.model('Judge', Judge);

var Contestnat = new Schema({
	firstname: String,
	surname: String,
	country: String,
//	dob: 
});

var Contestants = mongoose.model('Contestant', Contestnat);

module.exports = function(app){

	app.get('/api/judges', function(req, res){
		return Judges.find(function(error, judges){
			if(!error){
				return res.json(judges);
			}else{
				return console.log(error);
			}
		});
	});

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

app.get('/api/contestants', function(req, res){
	return Contestants.find(function(error, contestants){
		if(!error){
			return res.json(contestants);
		}else{
			return console.log(error);
		}
	});
});

app.get('/api/contestants/:id', function(req, res){
	return Contestants.findById(req.params.id, function(error, contestant){
		if(!error){
			return res.json(contestant)
		}else{
			return console.log(error);
		}
	});
});

app.post('/api/contestant', function(req, res){
	var contestant;

	console.log('post:');
	console.log(req.body);

	contestant = new Contestants({
		firstname : req.body.firstname,
		surname : req.body.surname,
		country : req.body.country
		//dob : req.body.dob
	});

	contestant.save(function(error){
		if(!error){
			return console.log('added');
		}else{
			return console.log(error);
		}
	});
	return res.json(contestant);
});

app.delete('/api/contestants/:id', function(req, res){
	return Contestants.findById(req.params.id, function(error, contestant){
		return contestant.remove(function(error){
			if(!error){
				return res.json(contestant);
			}else{
				return console.log(error)
			}
		});
	});
});

app.put('/api/contestants/:id', function(req, res){
	return Contestants.findById(req.params.id, function(error, contestant){
		contestant.firstname = req.body.firstname,
		contestant.surname = req.body.surname,
		contestant.country = req.body.country
		//contestant.dob = req.body.dob
		return contestant.save(function(error){
			if(!error){
				return res.json(contestant);
			}else{
				return console.log(error)
			}
		});
	});
});
};
