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
api.post('/delete-news', initController.deleteNews);

api.post('/delete-wallet', initController.deleteWallet);

api.post('/get-provider', initController.getProvider);
api.post('/set-provider', initController.setProvider);

api.post('/set-prices', initController.setPrices);
api.post('/get-prices', initController.getPrice);


api.post('/prices', initController.getPrices);
api.get('/data-general', initController.getDataGeneral);
api.post('/data-general', initController.getDataGeneral);

api.get('/get-total', initController.getTotal);
api.post('/get-total', initController.getTotal);


module.exports = api;