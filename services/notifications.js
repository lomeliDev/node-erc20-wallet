'use strict'

let configs = require('../configs');
let https = require('https');
let sqlite3 = require('sqlite3').verbose();



let Sql = `
SELECT
    txs.hash,
    txs.type,
    address.uuid,
    address.type as device,
    txs.address,
    txs.desde,
    txs.amount
FROM
    txs
INNER JOIN address ON txs.address = address.address
WHERE
    txs.status=0
`;



function xlog(x) {
    if (configs.logB == true) {
        console.log(x);
    }
}




async function sendNotificationOneSignal(data) {
    let headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic " + configs.oneSignal.secret
    };
    let options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };
    let req = https.request(options, function (res) {
        res.on('data', function (data) { });
    });
    req.on('error', function (e) { });
    req.write(JSON.stringify(data));
    req.end();
}



async function sendNotificacion(message) {
    return new Promise(async (resolve, reject) => {
        await sendNotificationOneSignal(message);
        resolve(null);
    }).then(function (data) {
        return data;
    });
}



async function sendNotification(d) {
    return new Promise(async (resolve, reject) => {
        let db = new sqlite3.Database(configs.pathDB);
        try {
            db.run("UPDATE txs SET status=1 WHERE hash = ?", d['hash'], (err, rows) => { });
        } catch (e) { }
        db.close();
        let dataUsers = [];
        dataUsers.push({
            field: "tag",
            key: "wallet_address",
            relation: "=",
            value: "" + d.address
        });
        let t = '';
        if (d.type == 'eth') {
            t = 'ETH';
        } else {
            t = configs.symbolToken;
        }
        let mensajeES = 'Acabas de recibir ' + d.amount + ' ' + t + ' con el hash ' + d.hash;
        let mensajeEN = 'You just received ' + d.amount + ' ' + t + ' with the hash ' + d.hash;
        let tituloES = 'Acabas de recibir ' + d.amount + ' ' + t;
        let tituloEN = 'You just received ' + d.amount + ' ' + t;
        let messageApp = {
            app_id: configs.oneSignal.appID,
            contents: {
                en: mensajeES,
                es: mensajeEN,
            },
            headings: {
                en: configs.titleToken,
                es: configs.titleToken,
            },
            subtitle: {
                en: tituloES,
                es: tituloEN
            },
            small_icon: 'ic_stat_onesignal_default',
            large_icon: configs.imgPush,
            data: {
                msg: "" + mensajeEN
            },
            filters: dataUsers
        };
        //xlog(messageApp);
        await sendNotificacion(messageApp);
        resolve(true);
    });
}


async function check() {
    xlog("check");
    let db = new sqlite3.Database(configs.pathDB);
    try {
        (async () => {
            await db.serialize(async () => {
                await db.all(Sql, async (err, row) => {
                    db.close();
                    if (!err && row.length > 0) {
                        for (let k in row) {
                            let d = row[k];
                            xlog(d);
                            await sendNotification(d);
                        }
                    }
                });
            });
            setTimeout(() => { check(); }, 5000);
        })();
    } catch (e) {
        db.close();
        setTimeout(() => { check(); }, 5000);
    }
}




async function sendNotificationNews(d) {
    return new Promise(async (resolve, reject) => {
        let db = new sqlite3.Database(configs.pathDB);

        try {
            await db.serialize(async () => {
                await db.all("SELECT uuid, address FROM address where type='phone'", async (err, row) => {
                    try {
                        db.run("UPDATE news SET status=1 WHERE uuid = ?", d['uuid'], (err, rows) => { });
                    } catch (e) { }
                    let dataPhones = [];
                    if (!err && row.length > 0) {
                        for (let k in row) {
                            let d = row[k];
                            dataPhones.push({
                                field: "tag",
                                key: "wallet_address",
                                relation: "=",
                                value: "" + d["address"]
                            });
                            dataPhones.push({
                                operator: "OR"
                            });
                        }
                        dataPhones.push({
                            field: "tag",
                            key: "wallet_address",
                            relation: "=",
                            value: "xxxxxxxxxxx"
                        });
                    }
                    let messageApp = {
                        app_id: configs.oneSignal.appID,
                        contents: {
                            en: d.msg_en,
                            es: d.msg_es,
                        },
                        headings: {
                            en: configs.titleToken,
                            es: configs.titleToken,
                        },
                        subtitle: {
                            en: d.title_en,
                            es: d.title_es
                        },
                        small_icon: 'ic_stat_onesignal_default',
                        large_icon: configs.imgPush,
                        data: {
                            msg: "" + d.msg_en
                        },
                        filters: dataPhones
                    };
                    xlog(messageApp);
                    await sendNotificacion(messageApp);
                    db.close();
                });
            });
        } catch (e) {
            try {
                db.close();
            } catch (e) { }
        }
        resolve(true);
    });
}




async function news() {
    xlog("news");
    let db = new sqlite3.Database(configs.pathDB);
    try {
        (async () => {
            await db.serialize(async () => {
                await db.all("select * from news where status=0", async (err, row) => {
                    db.close();
                    if (!err && row.length > 0) {
                        for (let k in row) {
                            let d = row[k];
                            xlog(d);
                            await sendNotificationNews(d);
                        }
                    }
                });
            });
            setTimeout(() => { news(); }, 30000);
        })();
    } catch (e) {
        db.close();
        setTimeout(() => { news(); }, 30000);
    }
}


module.exports = {
    check,
    news
};