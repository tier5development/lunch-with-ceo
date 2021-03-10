var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('bluebird');
var all_employees = [];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function write_in_file(employee, new_data) {

	fs.writeFile('winner.txt', employee.toString(), function(err, data){
	    if (err) console.log(err);
	});

	fs.readFile('S_E.txt', function(err, buf) {
		console.log("buf :: ", buf.toString())
		var byf = buf.toString() !== ''?  buf.toString() +','+ employee.toString() : employee.toString();
		fs.writeFile('S_E.txt', byf, function(err, data){
		    if (err) console.log(err);
		});
	});

	fs.writeFile('E_E.txt', new_data.toString(), function(err, data){
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
				console.log("selected_employee :: "+ all_employees[selected_employee])
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

function add_new_member(members) {
	return new Promise((resolve, reject) => {
		fs.readFile('E_E.txt', function(err, buf) {
			var byf = buf.toString() !== ''?  buf.toString() +','+ members : members;
			fs.writeFile('E_E.txt', byf, function(err, data){
			    if (err) console.log(err);
			});
			resolve(true);
		});
	});
}

function delete_member(members) {
	var members_array = members.split(','),
		new_em_array = [],
		new_sm_array = [],
		new_ee_array = [],
		new_se_array = [];

	return new Promise((resolve, reject) => {
		fs.readFile('E_E.txt', function(err, buf) {
			var buf_array = buf.toString().split(',');
			new_em_array = members_array.filter(val => !buf_array.includes(val)); // remove member from post data if found in file
			new_ee_array = buf_array.filter(val => !members_array.includes(val)); // remove member from file if found

			// Write names in the file
			fs.writeFile('E_E.txt', new_ee_array.toString(), function(err, data){
			    if (err) console.log(err);
			});

			fs.readFile('S_E.txt', function(err, bif) {
				var bif_array = bif.toString().split(',');
				new_sm_array = new_em_array.filter(val => !bif_array.includes(val)); // remove member from post data if found in file
				new_se_array = bif_array.filter(val => !new_em_array.includes(val)); // remove member from file if found

				// Write names in the file
				fs.writeFile('S_E.txt', new_se_array.toString(), function(err, data){
				    if (err) console.log(err);
				});

				resolve({status: true, couldnot_delete: new_sm_array});
			});
		});
	});
}


/* GET home page. */
router.get('/', function(req, res, next) {
	get_all_data().then((data) => {
		res.render('index', { 
			title:'Welcome to Lunch with CEO or MD App',
			current_winner: data.cur_winner,
			uw: data.uw,
			pw: data.pw,
			authorised: req.cookies.authorised ? req.cookies.authorised : false,
			isadmin: req.cookies.isadmin ? req.cookies.isadmin : false
		});
	});
});

/* GET new winner. */
router.get('/get-new-winner', function(req, res, next) {
	if(req.cookies.authorised && req.cookies.isadmin) {
		lunch_with_ceo().then((data) => {
			if(data) {
				res.send({status: 200, success: true});
			} else {
				res.redirect('/get-new-winner');
			}
		});
	} else {
		res.send({status: 200, success: false});
	}
});

/* Check authorization */
router.post('/login', function(req, res, next) {
	if(req.body.pass == 'JV') {
		res.cookie("authorised", true, {maxAge: 3600000});
		res.cookie("isadmin", true, {maxAge: 3600000});
		res.send({status : 200, authorised: true, isadmin: true});
	} else if(req.body.pass == 'AS') {
		res.cookie("authorised", true, {maxAge: 3600000});
		res.cookie("isadmin", false, {maxAge: 3600000});
		res.send({status : 200, authorised: true, isadmin: false});
	} else {
		res.send({status : 403, authorised: false, isadmin: false});
	}
});

/* Add new members */
router.post('/add/new/member', function(req, res, next) {
	if(req.cookies.authorised && req.body.members !== '') {
		add_new_member(req.body.members).then((data) => {
			if(data) {
				res.send({status: 200, success: true});
			} else {
				res.send({status: 200, success: false});
			}
		});
	} else {
		res.send({status: 403, success: false});
	}

});

/* Delete member(s) */
router.post('/delete/member', function(req, res, next) {
	if(req.cookies.authorised && req.body.members !== '') {
		delete_member(req.body.members).then((data) => {
			if(data.status) {
				res.send({status: 200, success: true, couldnot_delete: data.couldnot_delete});
			} else {
				res.send({status: 200, success: false});
			}
		});
	} else {
		res.send({status: 403, success: false});
	}

});

/* Logout */
router.get('/logout', function(req, res, next) {
	res.clearCookie("authorised");
	res.clearCookie("isadmin");
	res.send({status : 200, success: true});

});

module.exports = router;
