/**
 * Created by Martin on 16/08/2015.
 */
var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var products = require('./products.js');
var tests = require('./tests.js');
var user = require('./users.js');
var candidates = require('./candidates.js');


/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/takeTest/:id', candidates.getCandidateForTakeTest);
router.put('/takeTest/:id', candidates.takeTest);
router.post('/saveTest/:id', candidates.saveTest);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.post('/api/v1/product/', products.create);
router.put('/api/v1/product/:id', products.update);
router.delete('/api/v1/product/:id', products.delete);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/tests', tests.getAll);
router.get('/api/v1/test/:id', tests.getOne);
router.post('/api/v1/test', tests.create);
router.put('/api/v1/test/:id', tests.update);
router.delete('/api/v1/test/:id', tests.delete);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/candidates', candidates.getAll);
router.get('/api/v1/candidate/:id', candidates.getOne);
router.post('/api/v1/candidate', candidates.create);
router.put('/api/v1/candidate/:id', candidates.update);
router.delete('/api/v1/candidate/:id', candidates.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);

module.exports = router;