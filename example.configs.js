'use strict'

let os = require('os');
let pathDB = null;
let pathServer = null;


let testnet = true;
let port = 5050;
let token = 'addresstoken';

let redETH = null;
let redTokensETH = null;
let logB = false;


let idProjectInfura = 'IDPROJECT';
let apiEtherScan = 'APIETHERSCAN';
let networkEtherScan = 'networkEtherScan';
let timeoutScan = '3000';
let tokenDecimals = '18';



if (os.platform().indexOf('win32') >= 0 || os.platform().indexOf('win64') >= 0) {
    pathDB = 'C:/apps/node-erc20-wallet/db/wallet';
    pathServer = 'C:/apps/node-erc20-wallet/';
} else {
    pathDB = '/home/<Mi-CARPETA-DEL-REPO>/db/wallet';
    pathServer = '/home/<Mi-CARPETA-DEL-REPO>/';
}


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
    pathServer,
    redETH,
    redTokensETH,
    port,
    logB,
    token,
    apiEtherScan,
    networkEtherScan,
    tokenDecimals,
    timeoutScan,
    oneSignal,
    titleToken,
    symbolToken,
    imgPush,
    pathAdmin,
    passAdmin,
    pathDB
};
