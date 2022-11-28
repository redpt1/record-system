// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var productRouter = require('./routes/products');
//
// var app = express();
// var exphbs  = require('express-handlebars');
//
// // view engine setup
// app.engine('.hbs', exphbs({
//   helpers:{
//     ifNot: function(v1, v2, options) {
//       if(v1 != v2) {
//         return options.fn(this);
//       }
//       return options.inverse(this);
//     }
//   },
//   extname: '.hbs',
//   defaultLayout: 'layout'
// }));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/products', productRouter);
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
/* express的服务器 */

//1. 导入express
var express = require('express')
const FabricClient = require('./fabric/client.js');
const client = new FabricClient();
const bodyParser = require("body-parser");
const bent = require('bent');
const formurlencoded = require('form-urlencoded');
//2. 创建express服务器
var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
  // var data = new FormData();
  // data.append('PatientName',name.toString());
  // data.append('In_time',intime.toString());
  // data.append('Out_time',outtime.toString());
  // data.append('Fee',fee.toString());
  //data='PatientName='+name.toString()+'&In_time='+intime.toString()+'&Out_time='+outtime.toString()+'&Fee='+fee.toString();

const  data={
PatientName:name.toString(),
In_time:intime.toString(),
Out_time:outtime.toString(),
Fee:fee.toString(),
  }
  requestUrl = 'http://10.11.96.162:4040'
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






//4. 绑定端口
app.listen(4040)
console.log('listening 4040')
module.exports = app;
