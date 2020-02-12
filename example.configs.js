'use strict'

let testnet = true;
let port = 5050;
let token = 'addresstoken';

let redETH = null;
let redTokensETH = null;
let logB = false;


let idProjectInfura = 'IDPROJECT';
let apiEtherScan = 'APIETHERSCAN';



if (testnet == true) {
    redETH = 'https://ropsten.infura.io/v3/' + idProjectInfura;
    redTokensETH = 'api-ropsten.etherscan.io';
    logB = true;
} else {
    redETH = 'https://mainnet.infura.io/v3/' + idProjectInfura;
    redTokensETH = 'api-ropsten.etherscan.io';
    logB = false;
}


let oneSignal = {
    appID: 'appIDoneSignak',
    secret: 'secretoneSignal',
};
let imgPush = 'iconPushNotifications';



let titleToken = 'nameToken';
let symbolToken = 'symbolToken';



let pathAdmin = 'admin';
let passAdmin = 'admin';




module.exports = {
    redETH,
    redTokensETH,
    port,
    logB,
    token,
    apiEtherScan,
    oneSignal,
    titleToken,
    symbolToken,
    imgPush,
    pathAdmin,
    passAdmin
};