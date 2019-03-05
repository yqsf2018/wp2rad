let radAgent = require('./index');

try{
    radAgent.createAppSrv(null, function(err){
        if (err) {
            console.log('failed to create app server, err=', err);
            process.exit();
        }
        console.log('app srv created');
        setTimeout(radAgent.runAppSrv, 100, function(){
            console.log('app server started')
        });
    });
}catch(e) {
    console.log('Exception in server start:', e);
}