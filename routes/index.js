var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('bluebird');
var all_employees = [];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function write_in_file(employee, new_data) {

	fs.writeFile('winner.txt', employee, function(err, data){
	    if (err) console.log(err);
	});

	fs.readFile('S_E.txt', function(err, buf) {
		var byf = buf.toString() !== ''?  buf.toString() +','+ employee : employee;
		fs.writeFile('S_E.txt', byf, function(err, data){
		    if (err) console.log(err);
		});
	});

	fs.writeFile('E_E.txt', new_data, function(err, data){
	    if (err) console.log(err);
	});

	fs.writeFile('E_E.txt', new_data, function(err, data){
	    if (err) console.log(err);
	});
}

function rewrite_file() {
	fs.readFile('S_E.txt', function(err, buf) {
		var byf = buf.toString();
		fs.writeFile('E_E.txt', byf, function(err, data){
		    if (err) console.log(err);
		});

		fs.writeFile('S_E.txt', '', function(err, data){
		    if (err) console.log(err);
		});
	});
}

function lunch_with_ceo() {
	return new Promise((resolve, reject) => {
		fs.readFile('E_E.txt', function(err, buf) {
			if(buf.toString() !== '') {

				var all_employees = buf.toString().split(",");

				var selected_employee = getRandomInt(all_employees.length);
				var other_employees = all_employees.filter(item => item !== all_employees[selected_employee]);
			    write_in_file(all_employees[selected_employee], other_employees);
			    fs.readFile('S_E.txt', function(err, buff) {
			    	resolve({selected: all_employees[selected_employee], ee: other_employees, se: buff.toString().split(",")});
			    });
			} else {
				rewrite_file();
				resolve(false);
			}
		});
	});
}

function get_all_data() {
	return new Promise((resolve, reject) => {
		fs.readFile('winner.txt', function(err, buf) {
			var data = {
				cur_winner: ''
			};

			data.cur_winner = buf.toString();

			fs.readFile('S_E.txt', function(err, prewin) {

				data.pw = prewin.toString().split(",");

				fs.readFile('E_E.txt', function(err, uw) {
			    	data.uw = uw.toString().split(",");

			    	resolve(data);
			    });

		    	
		    });
			
		});
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
	get_all_data().then((data) => {
		res.render('index', { 
			title:'Welcome to Lunch with CEO App',
			current_winner: data.cur_winner,
			uw: data.uw,
			pw: data.pw
		});
	});
});

/* GET home page. */
router.get('/get-new-winner', function(req, res, next) {
	lunch_with_ceo().then((data) => {
		if(data) {
			res.send({status: 200, success: true});
		} else {
			res.redirect('/get-new-winner');
		}
	});
});

module.exports = router;
