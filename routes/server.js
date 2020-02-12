'use strict'

let express = require('express');
let initController = require('../controllers/server');
let configs = require('../configs');
let api = express.Router();


api.get('/', initController.init);
api.get('/' + configs.pathAdmin, initController.pathAdmin);
api.post('/save-address', initController.save);
api.post('/new-news', initController.newNews);
api.post('/get-news', initController.getNews);
api.post('/delete-wallet', initController.deleteWallet);


module.exports = api;