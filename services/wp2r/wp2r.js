let dbg = require('debug')('wp2rSvc');
let fs = require('fs');
let config = require('config');
let util = require('util');
let extend = Object.assign;
let RSVP = require('rsvp');
let striptags = require('striptags');
let mysql  = require('promise-mysql');

// let jwt = require('wordpress-jwt-auth');

let errEnum;

let myConn = null;
let myPool = null;
let svcCfg = null; 
let cntCache = {};
const infoTag = ['Count Type', 'Vendor', 'CalledBy', 'RecordDate'];
let userinfoEntryDflt = {
    username:''
    ,firstname:''
    ,lastname:''
    ,email:''
    ,department:''
    ,company:''
    ,workphone:''
    ,homephone:''
    ,mobilephone:''
    ,address:''
    ,city:''
    ,state:''
    ,country:''
    ,zip:''
    ,notes:''
    ,changeuserinfo:''
    ,portalloginpassword:''
    ,enableportallogin:''
    ,creationdate:''
    ,creationby:''
};

let radcheckEntryDflt = {
    username:''
    , attribute:''
    , op:''
    , value:''
}

let userbillinfoEntryDflt = {
    username:''
    ,contactperson:''
    ,company:''
    ,phone:''
    ,email:''
    ,department:''
    ,company:''
    ,workphone:''
    ,homephone:''
    ,mobilephone:''
    ,address:''
    ,city:''
    ,state:''
    ,country:''
    ,zip:''
    ,lead:''
    ,coupon:''
    ,paymentmethod:''
    ,cash:''
    ,creditcardname:''
    ,creditcardnumber:''
    ,creditcardverification:''
    ,creditcardtype:''
    ,creditcardexp:''
    ,notes:''
    ,changeuserbillinfo:''
    ,ordertaker:''
    ,billstatus:''
    ,lastbill:''
    ,nextbill:''
    ,nextinvoicedue:''
    ,billdue:''
    ,postalinvoice:''
    ,faxinvoice:''
    ,emailinvoice:''
    ,batch_id:''
    ,creationdate:''
    ,creationby:''
};

let genInsertSql = function (tbl, keys, values) {
    if ( ( 'array' != typeof keys ) 
        || ( 'array' != typeof values )
        || ( keys.length != values.length )
    ) {
        return null;
    }

    let sql = util.format('insert into %s (', tbl);
    sql += util.format('%s', keys[0]);
    for(let i = 1;i<keys.length;i++){
        sql += util.format(',%s', keys[i]);
    }
    
    sql += ') values (';
    sql += util.format('\'%s\'', values[0]);
    for(let i = 1;i<values.length;i++){
        if (values[i].length >0) {
            sql += util.format(',\'%s\'', keys[i]);    
        }
    }

    sql += ');';

    return sql;
}

let userinfo2sqlset = function (userinfo) {
    let userinfoEntry = extend({}, userinfoEntryDflt);
    let userinfoEntry = extend({}, userinfoEntryDflt);

    let sql1 = util.format();
    insert into userinfo 
(username, firstname, lastname, email, department
, company, workphone, homephone, mobilephone, address
, city, state, country, zip, notes
, changeuserinfo, portalloginpassword, enableportallogin, creationdate, creationby) 
values 
('usero3', '', '', 'usero3@tinoq.com', ''
, '', '', '', '', ''
, '', '', '', '', ''
, '0', '', '0', '2019-03-03 12:54:53', 'administrator');
insert into radcheck 
(                                   ) 
values 
('usero3','Cleartext-Password',':=','vpn123');
insert into userbillinfo 
(username, contactperson
, company, email, phone, address, city
, state, country, zip, paymentmethod, cash
, creditcardname, creditcardnumber, creditcardverification, creditcardtype, creditcardexp
, notes, changeuserbillinfo, lead, coupon, ordertaker
, billstatus, lastbill, nextbill, nextinvoicedue, billdue
, postalinvoice, faxinvoice, emailinvoice, batch_id, creationdate
, creationby) 
values 
('usero3', ''
, '', 'usero3@tinoq.com', '', '', ''
, '', '', '', '', ''
, '', '', '', '', ''
, '', '0', '', '', ''
, '', '0000-00-00', '0000-00-00', '0', '0'
, '', '', '', NULL, '2019-03-03 12:54:53'
, 'administrator');
    let sql = `INSERT INTO todos(title,completed)
           VALUES('Learn how to insert a new row',true)`;
    return sql;
};

exports.init = function (cfg, mySrv, initCB = null) {
    dbg("wp2rSvc.init():");
    svcCfg = extend({}, cfg);
    // let myConn = mysql.createConnection(svcCfg.mySrv);
    let myPool = mysql.createPool(mySrv);
    errEnum = cfg.errEnum;
    if ('function' == typeof initCB ) {
        initCB(null);
    }
};

exports.getErrEnum = function () {
    return errEnum;
}

exports.getVer = function (req) {
    dbg('wp2rSvc.gerVer():',svcCfg.ver);
    return svcCfg.ver;
};

let execQuery = function(sqlPhrase, cb) {
    myConn.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
     
        console.log('connected as id ' + myConn.threadId);
        // execute the insert statment
        myConn.query(sqlPhrase);
        myConn.end();
    });
};

let getConnProm = util.promisify(myPool.getConnection);

exports.adduser = function(req, recCB) {
    dbg('wp2rSvc.adduser(): recv req=', req);

    {
    "User_Id":19
    ,"login":"test13"
    ,"email":"test13@tinoq.com"
    ,"pass":"$P$BYTKTOcb08lGPd3u1IAR\/kgkIoFPBV\/"
    ,"uni_pass":"a123456z"
    }

    if( ('login' in req) && ('email' in req) && ('uni_pass' in req) ){
        let sql='';
        getConnProm()
        .then((conn)=>{
            let queryProm = util.promisify(conn.query);
            let entry = extend({}, userinfoEntryDflt);
            entry.username = req.login;
            entry.email = req.email;
            entry.creationby = 'administrator';
            sql = genInsertSql('userinfo')
            queryProm()
        })
        .then()=>{

        }
        .catch((err)=>{

        });
        myPool.getConnection(function(err, conn) {
            if (err) {
                recCB('Failed to get connection', err);
                return;
            }

            conn.beginTransaction(function(err) {
        }
        let sql = userinfo2sqlAddPhrase(req);
        execQuery(sql, function(err){

        });
    }
    else {
        setTimeout(recCB, 500, errEnum.ERR_INV_REQ, req);
    }
};
