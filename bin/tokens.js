'use strit'

var eth = require('../services/eth');

eth.getAddress();

setTimeout(() => {
    eth.getTxTokens();
}, 1000);
