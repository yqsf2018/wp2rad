var express = require('express');
var router = express.Router();
let config = require('config');
let dbg = require('debug')('wpCntRte');
let wp2rSvc = require('../services/wp2rSvc/wp2rSvc');
let errEnum = config.get('srv.svcSet.wpcnt.errEnum');

/* GET home page. */
router.get('/', function(req, res, next) {
  dbg('wpcnt/');
  res.render('index', { title: 'Express' });
});

router.get('/ver', function(req, res){
    dbg('wpcnt/ver');
    let verStr = wpcnt.getVer(req);
    let resp = {
        status:errEnum.ERR_NONE,
        detail:"Unknown"
    };
    if ( ('string' == typeof verStr) && (verStr.length>0) ) {
        resp.detail = verStr;   
    }
    res.status(200).send(resp);
});

router.post('/newuser', function(req, res){
    dbg('wpu2rad/newuser, req.body=', req.body);
    wp2rSvc.adduser(req.body, function(err, mysql_resp){
        dbg('record CB, err=', ',mysql_resp=', mysql_resp);
        let resp = {
            status:err,
            detail:mysql_resp
        };
        let httpStatus = 500;
        if ( errEnum.ERR_NONE == err ) {
            httpStatus = 200;
        }
        else if ( errEnum.ERR_DUPLICATE == err ) {
            httpStatus = 400;
        }
        res.status(httpStatus).send(resp);
    });
});

router.post('/deluser', function(req, res){
    dbg('wpu2rad/deluser, req.body=', req.body);
    resp = {
        err:INVALID_REQUEST
        , msg:"COMING SOON"
    };
    res.status(httpStatus).send(resp);
});

module.exports = router;
