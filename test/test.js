var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();
var userService = require('../services/user.service');

chai.use(chaiHttp);

let message = {
	"message_id": 157,
	"from": {
		"id": 51787124,
		"first_name": "Matias",
		"last_name": "Alvin",
		"username": "alvinmatias69"
	},
	"chat": {
		"id": 51787124,
		"first_name": "Matias",
		"last_name": "Alvin",
		"username": "alvinmatias69",
		"type": "private"
	},
	"date": 1484657260,
	"text": ""
}

describe('Cingkleung Controller', function(){

	describe('start', function(){
		before(function(done) {
			userService.delete(51787124, function(result) {
				done();
			});
		});

		let thisMessage = message;
		thisMessage.text = '/start';

		it('It should return "silahkan masukkan ..." on new user', function(done){
			chai.request(server)
				.post('/cingkleung')
				.send(thisMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("text").eql("silahkan masukan NIM anda (10 digit numerik)");
					res.body.should.not.have.property("reply_markup");
					done();
				});
		});

		it('It should return "selamat datang ..." with inline keyboard', function(done) {
			chai.request(server)
				.post('/cingkleung')
				.send(thisMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("text").eql("selamat datang di Cingkleung Bot");
					res.body.should.have.property("reply_markup");
					done();
				});
		});
	});

	describe('input NIM', function() {
		beforeEach(function(done) {
			userService.changePhase(51787124, 'input NIM');
			done();
		});

		let thisMessage = message;

		it('It should return "NIM berhasil disimpan" with inline keyboard', function(done) {
			thisMessage.text = '1301144048';

			chai.request(server)
				.post('/cingkleung')
				.send(thisMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("text").eql("NIM berhasil disimpan");
					res.body.should.have.property("reply_markup");
					done();
				});
		});

		it('It should return error "NIM yang anda inputkan ..."', function(done) {
			thisMessage.text = '130114404r';

			chai.request(server)
				.post('/cingkleung')
				.send(thisMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("text").eql("NIM yang anda input tidak valid\nInput NIM dalam bentuk 10 digit numerik");
					res.body.should.not.have.property("reply_markup");
					done();
				});
		});

		it('It should return error "NIM yang anda inputkan ..."', function(done) {
			thisMessage.text = '130114404';

			chai.request(server)
				.post('/cingkleung')
				.send(thisMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("text").eql("NIM yang anda input tidak valid\nInput NIM dalam bentuk 10 digit numerik");
					res.body.should.not.have.property("reply_markup");
					done();
				});
		});
	});

	describe('input classroom', function() {
		let thisMessage = message;

		beforeEach(function(done) {
			userService.changePhase(51787124, 'input classroom code');
			done();
		});

		it('It should return list of classrooms', function(done) {
			thisMessage.text = '303';

			chai.request(server)
				.post('/cingkleung')
				.send(thisMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					// res.body.should.not.have.property("reply_markup");
					done();
				});
		});
	});

	describe('bad input', function() {
		let thisMessage = message;

		beforeEach(function(done) {
			userService.changePhase(51787124, 'not allowed');
			done();
		});

		it('It should return "Mohon maaf ..." with inline keyboard', function(done) {
			thisMessage.text = "only sith deal with absolute";

			chai.request(server)
				.post('/cingkleung')
				.send(thisMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("text").eql("Mohon maaf, cingkleung bot masih berada dalam tahap pengembangan. Mohon bersabar untuk menikmati semua fiturnya");
					res.body.should.have.property("reply_markup");
					done();
				});
		});
	});

	let cbMessage = {
		"id": "175",
		"from": {
			"id": 51787124,
			"first_name": "Matias",
			"last_name": "Alvin",
			"username": "alvinmatias69"
		},
		"data": ""
	}

	describe('schedule check', function() {
		let thisCbMessage = cbMessage;

		it('It should return students schedule with inline keyboard', function(done) {
			thisCbMessage.data = "schedule_check";

			chai.request(server)
				.post('/cingkleung')
				.send(thisCbMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("reply_markup");
					done();
				});
		});
	});

	describe('nim check', function() {
		let thisCbMessage = cbMessage;

		it('It should ask for nim with inline keyboard', function(done) {
			thisCbMessage.data = "nim_change";

			chai.request(server)
				.post('/cingkleung')
				.send(thisCbMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("reply_markup");
					res.body.should.have.property("text").eql("NIM anda saat ini adalah : 1301144048\nNIM yang anda kirim akan mengganti NIM anda");
					done();
				});
		});
	});

	describe('classroom check', function() {
		let thisCbMessage = cbMessage;

		it('It should ask for classroom query with inline keyboard', function(done) {
			thisCbMessage.data = "classroom_check";

			chai.request(server)
				.post('/cingkleung')
				.send(thisCbMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("reply_markup");
					res.body.should.have.property("text").eql("Silahkan masukkan nomor ruangan untuk mengecek jadwal pada ruangan tersebut \nps: nomor ruangan tidak perlu terlalu lengkap (A303, A30, 303, etc)");
					done();
				});
		});
	});

	describe('next classroom', function() {
		let thisCbMessage = cbMessage;

		before(function(done) {
			userService.changePhase(51787124, "303");
			done();
		});

		it("It should return page 2 of classrooms list", function(done) {
			thisCbMessage.data = "2";

			chai.request(server)
				.post('/cingkleung')
				.send(thisCbMessage)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property("reply_markup");
					done();
				});
		});
	});
});