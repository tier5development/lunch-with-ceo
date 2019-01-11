var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('bluebird');
var all_employees = [];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function write_in_file(employee, new_data) {
	fs.readFile('S_E.txt', function(err, buf) {
		var byf = buf.toString() !== ''?  buf.toString() +','+ employee : employee;
		fs.writeFile('S_E.txt', byf, function(err, data){
		    if (err) console.log(err);
		});
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
			    write_in_file(all_employees[selected_employee], all_employees.filter(item => item !== all_employees[selected_employee]));
			    fs.readFile('S_E.txt', function(err, buff) {
			    	resolve({selected: all_employees[selected_employee], ee: all_employees.filter(item => item !== all_employees[selected_employee]), se: buff.toString().split(",")});
			    });
			} else {
				rewrite_file();
				resolve(false);
			}
		});
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
	lunch_with_ceo().then((data) => {
		if(data) {
			res.render('index', { 
				title:'Welcome to Lunch with CEO App',
				message: "Wow! We found the lucky emplyoee for this week. That person's name is :: ",
				employee_details: data
			});
		} else {
			res.redirect('/');
		}
	});
});

module.exports = router;