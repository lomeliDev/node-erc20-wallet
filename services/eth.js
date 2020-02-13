'use strict'

let Web3 = require('web3');
let request = require('request');
let HookedWeb3Provider = require("hooked-web3-provider");
let configs = require('../configs');
let sqlite3 = require('sqlite3').verbose();
let addressGlobal = [];
let txsTokenGlobal = [];


let web3 = new Web3();
let idBlock = 0;




function xlog(x) {
    if (configs.logB == true) {
        console.log(x);
    }
}


async function setWeb3Provider() {
    let web3Provider = new HookedWeb3Provider({
        host: configs.redETH
    });
    web3.setProvider(web3Provider);
}




async function getBlock() {
    return new Promise((resolve, reject) => {
        web3.eth.getBlockNumber((error, block) => {
            if (error) {
                reject(error.message);
            } else {
                resolve(parseInt(block));
            }
        });
    });
}


async function start() {
    getAddress();
    setWeb3Provider();
    await getBlock().then((response) => {
        idBlock = response - 10;
        getTX();
    }).catch((error) => {
        console.error(error);
    });
}



function getAddress() {
    setWeb3Provider();
    let db = new sqlite3.Database(configs.pathDB);
    try {
        db.serialize(() => {
            db.all("SELECT address FROM address", (err, row) => {
                if (!err && row.length > 0) {
                    addressGlobal = [];
                    for (let k in row) {
                        let d = row[k];
                        addressGlobal.push(d.address.toLowerCase());
                    }
                }
                db.close();
                setTimeout(() => { getAddress(); }, 30000);
            });
        });
    } catch (e) {
        try {
            db.close();
        } catch (e) {}
        setTimeout(() => { getAddress(); }, 30000);
    }
}



function getTX() {
    try {
        xlog(addressGlobal);
        let dataTxs = [];
        let Data = web3.eth.getBlock('latest', true, (error, response) => {
            if (error) {
                setTimeout(() => { getTX(); }, 5000);
            } else {
                xlog(response.number);
                if (response.transactions.length > 0) {
                    for (let k in response.transactions) {
                        let d = response.transactions[k];
                        if (d.to != null && addressGlobal.indexOf(d.to.toLowerCase()) >= 0) {
                            dataTxs.push({
                                hash: d.hash,
                                type: 'eth',
                                address: d.to.toLowerCase(),
                                desde: d.from,
                                amount: '' + (d.value / 1.0e18),
                                status: 0,
                                created_at: new Date().getTime(),
                            });
                        }
                    }
                    if (dataTxs.length > 0) {
                        let db = new sqlite3.Database(configs.pathDB);
                        for (let k in dataTxs) {
                            let d = dataTxs[k];
                            try {
                                db.run("INSERT INTO txs(hash,type,address,desde,amount,status,created_at) values(?,?,?,?,?,?,?)", d['hash'], d['type'], d['address'], d['desde'], d['amount'], d['status'], d['created_at'], (err, rows) => {});
                            } catch (e) {}
                        }
                        db.close();
                    }
                    xlog(dataTxs);
                }
                idBlock++;
                setTimeout(() => { getTX(); }, 5000);
            }
        });
    } catch (e) {
        console.log(e.message);
        setTimeout(() => { getTX(); }, 5000);
    }
}




async function getTxTokens() {
    request({
        url: "https://" + configs.redTokensETH + "/api?module=account&action=tokentx&contractaddress=" + configs.token + "&page=1&offset=100&sort=desc&apikey=" + configs.apiEtherScan,
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        },
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let dataTxs = [];
            xlog("getTxTokens");
            if (parseInt(body.status) == 1) {
                if (body.result.length > 0) {
                    for (let k in body.result) {
                        let d = body.result[k];
                        if (d.to != null && addressGlobal.indexOf(d.to.toLowerCase()) >= 0 && txsTokenGlobal.indexOf(d.hash.toLowerCase()) < 0) {
                            txsTokenGlobal.push(d.hash.toLowerCase());
                            dataTxs.push({
                                hash: d.hash,
                                type: 'token',
                                address: d.to.toLowerCase(),
                                desde: d.from,
                                amount: '' + (d.value * 1) / (10 ** d.tokenDecimal),
                                status: 0,
                                created_at: new Date().getTime(),
                            });
                        }
                    }
                    if (dataTxs.length > 0) {
                        let db = new sqlite3.Database(configs.pathDB);
                        for (let k in dataTxs) {
                            let d = dataTxs[k];
                            try {
                                db.run("INSERT INTO txs(hash,type,address,desde,amount,status,created_at) values(?,?,?,?,?,?,?)", d['hash'], d['type'], d['address'], d['desde'], d['amount'], d['status'], d['created_at'], (err, rows) => {});
                            } catch (e) {}
                        }
                        db.close();
                    }
                    xlog(dataTxs);
                }
            }
            setTimeout(() => { getTxTokens(); }, 5000);
        } else {
            setTimeout(() => { getTxTokens(); }, 5000);
        }
    });
}



module.exports = {
    start,
    getTxTokens,

};