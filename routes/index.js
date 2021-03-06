var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/redcounter';
// to access $ mongo localhost:27017/redcounter


// Use connect method to connect to the server


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.post('/', function(req, res, next) {
	res.redirect('/');
});


router.get('/msgs', function(req, res, next){
	res.render('msgs');
})

router.post('/msgs', function(req, res, next){
	console.log(req.body)
	if(req.body.msg){
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection('msgs').insertOne({msg:req.body.msg, user:req.body.user, createdAt: new Date()}, function(err, r) {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
				db.close();
			});
		});
	}
	res.redirect('/msgs');
})

router.get('/sent', function(req, res, next){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('msgs').find({},{sort:"createdAt"}).toArray(function(err, data) {
			db.close();
			res.json(data);
		});
	});
})


router.get('/kiss', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('redcounter').insertOne({type:"kiss", createdAt: new Date()}, function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			db.close();
		});
	});

	res.redirect('/');
});


router.get('/lick', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('redcounter').insertOne({type:"lick", createdAt: new Date()}, function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			db.close();
		});
	});

	res.redirect('/');
});


router.get('/sex', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('redcounter').insertOne({type:"sex", createdAt: new Date()}, function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			db.close();
		});
	});

	res.redirect('/');
});

router.get('/stats', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('redcounter').count({type:"kiss"}).then(function(kiss) {
			db.collection('redcounter').count({type:"lick"}).then(function(lick) {
				db.collection('redcounter').count({type:"sex"}).then(function(sex) {
					db.close();
					res.json({kiss:kiss, lick:lick, sex:sex});
				});
			});
		});
	});
});



module.exports = router;
