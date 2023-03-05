/* jshint devel: true, node: true */
var express = require('express');
// ----------------->     /api/edition
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var competSchema = new Schema({
  name:  String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  place: String, //np Gdansk
  country: String
});
//===================================================================================
competitions.get('/', function(req, res) {
    Model.find(function(err, list){
        if(req.accepts('json')) {
            if(err)
            return res.json(err);
        } else {
            return res.render('competitions/index', {competitions: competitions});
        }
    });
});
//=======================================================================================
competitions.post('/', function(req, res) {
    var user = new Model({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });
    user.save(function(err, user){
        if(req.accepts('json')) {
            if(err) {
                return res.json(err);
                    }
            return res.json({
                message: 'saved',
                _id: competitions._id
            });
    }});
});
//==================================================================================
competitions.get('/:id', function(req, res) {
    var id = req.params.id;
    Model.findOne({_id: id}, function(err, user){
        if(req.accepts('json')) {
            if(err) {
            return res.json(err);
        } else {
            return res.render('competitions/edit', {competitions: competition, flash: 'Created.'});
        }
    });
});
//=================================================================================
competitions.put('/:id', function(req, res) {
    var id = req.params.id;
    Model.findOne({_id: id}, function(err, user){
        if(req.accepts('json')) {
            if(err) {
            
                return res.json(err);
            }
            user.name = req.body.name ? req.body.name : user.name;
            user.email = req.body.email ? req.body.email : user.email;
            user.age = req.body.age ? req.body.age : user.age;
            user.save(function(err, user){
                if(err) {
                return res.json(err);
            });
        } else {
            
                return res.render('users/edit', {user: user, flash: 'Saved.'});
            //});
        }
    });
});
//=================================================================================
users.delete('/:id', function(req, res) {
    var id = req.params.id;
    Model.findOne({_id: id}, function(err, user){
        if(req.accepts('json')) {
            if(err) {
            return res.json(err);
        } else {
            return res.render('index', {flash: 'Item deleted.'});
        }
    });
});