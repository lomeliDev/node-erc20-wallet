'use strict'

let uuid = require('uuid');
let fs = require('fs');
let sqlite3 = require('sqlite3').verbose();
let f = require('../services/functions');
let configs = require('../configs');
let db = new sqlite3.Database(configs.pathDB);




db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS provider (provider TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS address (address TEXT NOT NULL , uuid TEXT NOT NULL , type TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS txs (hash TEXT NOT NULL PRIMARY KEY , type INTEGER NOT NULL , address TEXT NOT NULL , desde TEXT NOT NULL , amount TEXT NOT NUll , status INTEGER NOT NULL , created_at datetime NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS news (uuid TEXT NOT NULL PRIMARY KEY , title_es TEXT NOT NULL , title_en TEXT NOT NULL , msg_es TEXT NOT NULL , msg_en TEXT NOT NULL , img TEXT NUll , link TEXT NUll , notify TEXT NOT NULL , status INTEGER NOT NULL , created_at datetime NOT NULL)");
    db.run("CREATE INDEX IF NOT EXISTS idx_address ON address (address , type)");
    db.run("CREATE INDEX IF NOT EXISTS idx_txs ON txs (hash , status)");
    db.run("CREATE INDEX IF NOT EXISTS idx_news ON news (uuid , status)");
});
db.close();


function init(req, res) {
    res.status(500).send({ status: false, msg: 'ERROR' });
}



function pathAdmin(req, res) {
    fs.readFile(configs.pathServer + 'tmp/admin.html', function(err, html) {
        res.writeHeader(200, { "Content-Type": 'text/html' });
        res.write(html);
        res.end();
    });
}





async function save(req, res) {
    let p = req.body;
    if (f.vC(p, 'address') && f.vC(p, 'uuid') && f.vC(p, 'type')) {
        let address = p.address.toLowerCase();
        let uuid = p.uuid;
        let type = p.type;
        let db = new sqlite3.Database(configs.pathDB);
        try {
            db.serialize(() => {
                db.all("SELECT * FROM address where address='" + address + "' and type='" + type + "'", (err, row) => {
                    if (!err && row.length <= 0) {
                        let stmt = db.prepare("INSERT INTO address VALUES ('" + address + "' , '" + uuid + "' , '" + type + "')");
                        stmt.run();
                        stmt.finalize();
                    }
                    db.close();
                });
            });
        } catch (e) {}
        res.status(200).send({ status: true, msg: 'OK' });
    } else {
        res.status(500).send({ status: false, msg: 'enterFields' });
    }
}


async function newNews(req, res) {
    let p = req.body;
    if (f.vC(p, 'pwd') && p.pwd == configs.passAdmin) {
        if (f.vC(p, 'title_es') && f.vC(p, 'title_en') && f.vC(p, 'msg_es') && f.vC(p, 'msg_en') && f.vC(p, 'notify')) {
            let my_uuid = uuid.v4();
            let title_es = p.title_es;
            let title_en = p.title_en;
            let msg_es = p.msg_es;
            let msg_en = p.msg_en;
            let notify = p.notify;
            let img = null;
            let link = null;
            let status = 1;
            if (notify == 'yes') {
                status = 0;
            }
            let created_at = new Date().getTime();
            if (f.vC(p, 'img') && p.img != null && p.img != '') {
                img = p.img;
            }
            if (f.vC(p, 'link') && p.link != null && p.link != '') {
                link = p.link;
            }
            let db = new sqlite3.Database(configs.pathDB);
            try {
                db.run("INSERT INTO news (uuid,title_es,title_en,msg_es,msg_en,img,link,notify,status,created_at) values(?,?,?,?,?,?,?,?,?,?)", my_uuid, title_es, title_en, msg_es, msg_en, img, link, notify, status, created_at, (err, rows) => {
                    if (err) {
                        res.status(500).send({ status: false, msg: 'error inserting the news' });
                    } else {
                        res.status(200).send({ status: true, msg: 'news saved successfully' });
                    }
                });
            } catch (e) {}
            db.close();
        } else {
            res.status(500).send({ status: false, msg: 'enterFields' });
        }
    } else {
        res.status(500).send({ status: false, msg: 'password incorrect' });
    }
}



async function getNews(req, res) {
    let p = req.body;
    //if (f.vC(p, 'pwd') && p.pwd == configs.passAdmin) {
    let db = new sqlite3.Database(configs.pathDB);
    try {
        let dataNews = [];
        await db.serialize(async() => {
            await db.all("SELECT * FROM news order by created_at desc limit 100", async(err, row) => {
                if (!err && row.length > 0) {
                    for (let k in row) {
                        let d = row[k];
                        dataNews.push(d);
                    }
                }
                db.close();
                res.status(200).send({ status: true, msg: 'OK', data: dataNews });
            });
        });
    } catch (e) {
        res.status(500).send({ status: false, msg: 'Error' });
    }
    // } else {
    //     res.status(500).send({ status: false, msg: 'password incorrect' });
    // }
}



async function deleteWallet(req, res) {
    let p = req.body;
    if (f.vC(p, 'pwd') && p.pwd == configs.passAdmin) {
        try {
            let w = configs.pathDB;
            fs.unlink(w, function(err) {
                if (!err) {
                    let db = new sqlite3.Database(configs.pathDB);
                    db.serialize(() => {
                        db.run("CREATE TABLE IF NOT EXISTS provider (provider TEXT NOT NULL)");
                        db.run("CREATE TABLE IF NOT EXISTS address (address TEXT NOT NULL , uuid TEXT NOT NULL , type TEXT NOT NULL)");
                        db.run("CREATE TABLE IF NOT EXISTS txs (hash TEXT NOT NULL PRIMARY KEY , type INTEGER NOT NULL , address TEXT NOT NULL , desde TEXT NOT NULL , amount TEXT NOT NUll , status INTEGER NOT NULL , created_at datetime NOT NULL)");
                        db.run("CREATE TABLE IF NOT EXISTS news (uuid TEXT NOT NULL PRIMARY KEY , title_es TEXT NOT NULL , title_en TEXT NOT NULL , msg_es TEXT NOT NULL , msg_en TEXT NOT NULL , img TEXT NUll , link TEXT NUll , notify TEXT NOT NULL , status INTEGER NOT NULL , created_at datetime NOT NULL)");
                        db.run("CREATE INDEX IF NOT EXISTS idx_address ON address (address , type)");
                        db.run("CREATE INDEX IF NOT EXISTS idx_txs ON txs (hash , status)");
                        db.run("CREATE INDEX IF NOT EXISTS idx_news ON news (uuid , status)");
                    });
                    db.close();
                    res.status(200).send({ status: true, msg: 'The wallet was emptied correctly' });
                } else {
                    res.status(500).send({ status: false, msg: 'Error' });
                }
            });
        } catch (e) {
            res.status(500).send({ status: false, msg: 'Error' });
        }
    } else {
        res.status(500).send({ status: false, msg: 'password incorrect' });
    }
}



async function getProvider(req, res) {
    let p = req.body;
    //if (f.vC(p, 'pwd') && p.pwd == configs.passAdmin) {
    let db = new sqlite3.Database(configs.pathDB);
    try {
        let dataProvider = null;
        await db.serialize(async() => {
            await db.all("SELECT * FROM provider limit 1", async(err, row) => {
                if (!err && row.length > 0) {
                    for (let k in row) {
                        let d = row[k];
                        dataProvider = d['provider'];
                    }
                }
                db.close();
                res.status(200).send({ status: true, msg: 'OK', data: dataProvider });
            });
        });
    } catch (e) {
        res.status(500).send({ status: false, msg: 'Error' });
    }
    // } else {
    //     res.status(500).send({ status: false, msg: 'password incorrect' });
    // }
}



async function setProvider(req, res) {
    let p = req.body;
    if (f.vC(p, 'provider')) {
        let provider = p.provider;
        let db = new sqlite3.Database(configs.pathDB);
        try {
            db.serialize(() => {
                db.all("SELECT * FROM provider", (err, row) => {
                    if (!err && row.length <= 0) {
                        let stmt = db.prepare("INSERT INTO provider VALUES ('" + provider + "')");
                        stmt.run();
                        stmt.finalize();
                    }
                    if (!err && row.length > 0) {
                        let stmt = db.prepare("UPDATE provider set provider='" + provider + "'");
                        stmt.run();
                        stmt.finalize();
                    }
                    db.close();
                });
            });
        } catch (e) {}
        res.status(200).send({ status: true, msg: 'OK' });
    } else {
        res.status(500).send({ status: false, msg: 'enterFields' });
    }
}


async function getPrices(req, res) {
    let p = req.body;
    if (f.vC(p, 'eth') && f.vC(p, 'token')) {
        let data = { eth: 0, token: 0 };
        let eth = parseFloat(p.eth);
        let token = parseFloat(p.token);
        data.eth = (eth * 277.66) * 1;
        data.token = (token * 0.067547) * 1;
        res.status(200).send({ status: true, msg: 'OK', data: data });
    } else {
        res.status(500).send({ status: false, msg: 'enterFields' });
    }
}



async function getDataGeneral(req, res) {
    let p = req.body;
    let db = new sqlite3.Database(configs.pathDB);
    try {
        let data = { provider: null, tokenAddr: null, tokenDecimals: null, tokenSymbol: null, tokenName: null, apikeyEtherScan: null, networkEtherScan: null, timeoutScan: null };
        let dataProvider = null;
        await db.serialize(async() => {
            await db.all("SELECT * FROM provider limit 1", async(err, row) => {
                if (!err && row.length > 0) {
                    for (let k in row) {
                        let d = row[k];
                        dataProvider = d['provider'];
                    }
                }
                db.close();
                data.provider = dataProvider;
                data.tokenAddr = '0x53302445bca854f615053bcae2381f5b3db9fe78';
                data.tokenDecimals = '18';
                data.tokenSymbol = 'CHILA';
                data.tokenName = 'Chila';
                data.apikeyEtherScan = 'YourApiKey';
                data.networkEtherScan = 'ropsten';
                data.timeoutScan = '3000';
                res.status(200).send({ status: true, msg: 'OK', data: data });
            });
        });
    } catch (e) {
        res.status(500).send({ status: false, msg: 'Error' });
    }

}



module.exports = {
    init,
    pathAdmin,
    save,
    newNews,
    getNews,
    deleteWallet,
    getProvider,
    setProvider,
    getPrices,
    getDataGeneral,
}