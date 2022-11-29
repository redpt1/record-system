/* express的服务器 */

//1. 导入express
var express = require('express')
const FabricClient = require('./fabric/client.js');
const client = new FabricClient();
const bodyParser = require("body-parser");
const bent = require('bent');
const formurlencoded = require('form-urlencoded');
const https = require('https');
const fs = require('fs');


var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


//2. 创建express服务器
var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var httpsServer = https.createServer(credentials, app);




//3. 访问服务器(get或者post)
//参数一: 请求根路径
//3.1 get请求
app.get('/query', function (request, response) {

  var queryRequest = new Promise((resolve, reject) => {
      var records = client.query('admin', 'QueryAllRecords');
    resolve(records);
  });
    queryRequest.then((data)=>
  {
    response.send(data)
  });

});

app.post('/get',function(request, response){
  var identity = "creator1";
  var name = request.body.PatientName;
  var intime = request.body.In_time;
  var outtime = request.body.Out_time;
  var fee = request.body.Fee;
  console.log(request.body);
  request = new Promise((resolve, reject) => {
    try{
      var record = client.invoke("creator1", 'CreateRecord', [name, intime, outtime,fee,'3']);
      resolve(record);
      response.send('success!');
    }catch(error){
      reject(error);
    }
  })
});

app.post('/create',function(request, response){
  var identity = "creator1";
  var name = request.body.PatientName;
  var intime = request.body.In_time;
  var outtime = request.body.Out_time;
  var fee = request.body.Fee;
  console.log(request.body);
  request = new Promise((resolve, reject) => {
    try{
      var record = client.invoke("creator1", 'CreateRecord', [name, intime, outtime,fee,'3']);
      resolve(record);
      response.send('success!');
    }catch(error){
      reject(error);
    }
  })

const  data={
PatientName:name.toString(),
In_time:intime.toString(),
Out_time:outtime.toString(),
Fee:fee.toString(),
  }
  requestUrl = 'https://10.11.96.162:4040'
  console.log(formurlencoded(data));

const headers = { "content-type": "application/x-www-form-urlencoded" };
const post = bent(requestUrl, 'POST', 'string');
const res=post('/get', formurlencoded(data), headers);


});



app.post('/search', function (request, response) {

  var searchRequest = new Promise((resolve, reject) => {
    try{
      console.log(request.body.recordId);
      var records = client.query('admin', 'QueryRecord', [request.body.recordId]);
      resolve(records);
    }catch(error){
     reject(error);
  }
  });

    searchRequest.then((data)=>
  {
    response.send(data);
  },error=>{
    response.status(204).send("fail");
  }
);
});





var SSLPORT = 4040;
httpsServer.listen(SSLPORT)
console.log('httpsServer 4040')
module.exports = app;
