let util = require('util');
let mysql = require('promise-mysql');


let closeAll = function (conn, pl) {
    console.log('close curr conn');
    conn.release();
    console.log('close curr pool');
    pl.end();
};

pool = mysql.createPool({
  host: 'tinoq.cjkoblmkf5xx.us-west-2.rds.amazonaws.com',
  user: 'radius',
  password: '62VX2Pf*!4d8uP~5',
  database: 'radius',
  connectionLimit: 6
});

let theConn;

let query1 = `insert into userinfo (username, firstname, lastname, email, department, company, workphone, homephone, mobilephone, address, city, state, country, zip, notes, changeuserinfo, portalloginpassword, enableportallogin, creationdate, creationby) values ('usero3', '', '', 'usero3@tinoq.com', '', '', '', '', '', '', '', '', '', '', '', '0', '', '0', '2019-03-03 12:54:53', 'administrator');`
let query2 = `insert into radcheck (username, attribute, op, value) values ('usero3','Cleartext-Password',':=','vpn123');`;
let query3 = `insert into userbillinfo (username, contactperson, company, email, phone, address, city, state, country, zip, paymentmethod, cash, creditcardname, creditcardnumber, creditcardverification, creditcardtype, creditcardexp, notes, changeuserbillinfo, lead, coupon, ordertaker, billstatus, lastbill, nextbill, nextinvoicedue, billdue, postalinvoice, faxinvoice, emailinvoice, batch_id, creationdate, creationby) values ('usero3', '', '', 'usero3@tinoq.com', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '0', '', '', '', '', '0000-00-00', '0000-00-00', '0', '0', '', '', '', NULL, '2019-03-03 12:54:53', 'administrator');`;

pool.getConnection()
.then((connection) => {
    theConn = connection;
//    return connection.beginTransaction();
//})
//.then((err)=>{
//    if (err instanceof Error) { throw err; }
    return theConn.query(query1);
})
.then((rows)=>{
    console.log("query1=",rows);
    return theConn.query(query2);
})
.then((rows)=>{
    console.log("query2=",rows);
    return theConn.query(query3);
})
.then((rows)=>{
    console.log("query3=",rows);
    // return theConn.commmit();
/*
})
.then((err)=>{
    if (err) {
        console.log('commit err=', err);
        return theConn.rollback();      
    }
    console.log('commit succ');
*/
    closeAll(theConn, pool);
})
.catch((err)=>{
    if (err) {
        console.log('transaction err=', err); 
    }
    closeAll(theConn, pool);
});

