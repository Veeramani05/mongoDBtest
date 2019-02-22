var express = require('express');
var sql = require('mssql');
var app = express();
var bodyParser  = require('body-parser');
var multer = require('multer');
var multipart = require('connect-multiparty');
var formidable = require('formidable');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var SqlString = require('sqlstring');
var path = require('path');
var stringify = require('json-stringify-safe');
var nodemailer = require('nodemailer');
var upload = multer();

//var upload = multer({ dest: 'uploads/' });

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+'.jpg');
}
  
});
var upload = multer({ storage : storage })
app.use(bodyParser.urlencoded({ extended: false }))

//app.use(express.static(__dirname));
//app.use(bodyParser.json());
//app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());


var config = {
    user: 'sa',
    password: 'y@h00.c0m',
    server: '192.168.2.3', 
    database: 'ExamApp' 
};

var config3 = {
    user: 'sa',
    password: 'y@h00.c0m',
    server: '192.168.2.3', 
    database: 'Krishnagiri' 
};
var config1 = {
    user: 'sa',
    password: 'y@h00.c0m',
    server: '192.168.2.3', 
    database: 'MarketingTest',
    pool: {max: 30000, min: 0, idleTimeoutMillis: 30000}
};
var config2 = {
    user: 'sa',
    password: 'y@h00.c0m',
    server: '192.168.2.3', 
    database: 'OMSNew',
    pool: {max: 30000, min: 0, idleTimeoutMillis: 30000}
};
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* checkimages */

app.post('/checkimages', function(req, res) {
	
    var QType = req.query.QType;
	console.log(req.files)
    var register = req.files.register;
    var PDFdocument= req.files.PDFdocument;
    let certificatelocation= '';
    let registerlocation='';
    let pdflocation='';
	
    
	try{
		var certificate = req.files.certificate;
		certificatelocation='./uploads/'+certificate.name;
		certificate.mv(certificatelocation,function(err){
			if(err) res.json({Message:err});
		});
	}catch(e){
		console.log(e)
	}
	registerlocation='./uploads/'+register.name;
	pdflocation='./uploads/'+PDFdocument.name;
	register.mv(registerlocation,function(err){
		if(err) res.json({Message:err});
		PDFdocument.mv(pdflocation,function(err){
			if(err) res.json({Message:err});
			var Connect = new sql.Connection(config, function (err) {    
					if (err) res.json({Message:err});	
				var request = new sql.Request(Connect);
				
				request.input('QType', QType);
				request.input('register', registerlocation);
				request.input('PDFdocument', pdflocation);
				request.input('certificate', certificatelocation);
				request.output("SQLReturn"); 

			request.execute('Insert_IAMGE', function(err, recordsets, returnValue, results) {
				// ... error checks
				if(err){ 
				console.log(err);
				res.json({code:1,message:err});
			  }else{        
					console.log(request.parameters.SQLReturn.value);
					res.json({code:1,message:request.parameters.SQLReturn.value});   
			  }
			});
		});
		
	});
	
    
});
});

/* InsertExams */

app.get('/InsertExams', function(req, res) {
	
    var QType = req.query.QType;
    var Type = req.query.Type;
    var Exams= req.query.Exams;
    var Level = req.query.Level;
    var UpdatedBy = req.query.UpdatedBy;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Type', Type);
    request.input('Exams', Exams);
    request.input('Level', Level);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('InsertExams', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/*getType*/

app.get('/getType', function(req, res) {

    var Type =req.query.Type;
	var Level =req.query.Level;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Exams from Exams_Table where Type='"+Type+"' And Level='"+Level+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/*getType*/

app.get('/getTypelist', function(req, res) {

    var Type =req.query.Type;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Exams from Exams_Table where Type='"+Type+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* InsertGroupName */

app.get('/InsertGroups', function(req, res) {
	
    var QType = req.query.QType;
    var Code = req.query.Code;
    var GroupName= req.query.GroupName;
    var Subjects = req.query.Subjects;
    var UpdatedBy = req.query.UpdatedBy;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Code', Code);
    request.input('GroupName', GroupName);
    request.input('Subjects', Subjects);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('InsertGroupName', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


/*Group_table*/

app.get('/Group_table', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select GroupName,Subjects ,Description from Group_table ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* InsertGraduate */

app.get('/InsertGraduate', function(req, res) {
	
    var QType = req.query.QType;
    var Type = req.query.Type;
    var Exams= req.query.Exams;
    var Level = req.query.Level;
    var UpdatedBy = req.query.UpdatedBy;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Type', Type);
    request.input('Exams', Exams);
    request.input('Level', Level);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('InsertGraduate', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


/*getGraduate*/

app.get('/getGraduate', function(req, res) {

    var Type =req.query.Type;
	var Level =req.query.Level;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
//request.query("select Exams from graduate_table where Type='"+Type+"' And Level='"+Level+"'", function(err, recordsets, returnValue, results) {
	request.query("select * from Duty ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* InsertResultsUrl */

app.get('/InsertResults', function(req, res) {
	
    var QType = req.query.QType;
    var Type = req.query.Type;
    var Result= req.query.Result;
    var Url = req.query.Url;
    var UpdatedBy = req.query.UpdatedBy;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Type', Type);
    request.input('Result', Result);
    request.input('Url', Url);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('InsertResultsUrl', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


/*getURL*/

app.get('/GetURLResult', function(req, res) {

    var Result = req.query.Result;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Url from Result_table where Result='"+Result+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* InsertCourses */

app.get('/InsertCourses', function(req, res) {
	
    var QType = req.query.QType;
    var Courses = req.query.Courses;
    var Duration= req.query.Duration;
    var Eligibility = req.query.Eligibility;
	var Jobs = req.query.Jobs;
    var UpdatedBy = req.query.UpdatedBy;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Courses', Courses);
    request.input('Duration', Duration);
    request.input('Eligibility', Eligibility);
	request.input('Jobs', Jobs);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('InsertCourses', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


/*GetCourses*/

app.get('/GetCourses', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Courses,Duration,Eligibility from Courses_table ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/*GetJobs*/

app.get('/GetJobs', function(req, res) {

   
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Jobs from Jobs_table ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
	
/*competitive_Exams*/

app.get('/competitive_Exams', function(req, res) {

   
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from competitive_Exams ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
/*courses_12th*/

app.get('/Artscourses', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from courses_12th ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//Commerce_Courses//
app.get('/Commerce_Courses', function(req, res) {

   
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Commerce_Courses ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//Science_Courses//

app.get('/Science_Courses', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Science_Courses ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//Science_Courses//

app.get('/Science_Courses_list', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Courses from Science_Courses ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//PureScience_Courses//

app.get('/PureScience_Courses', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from PureScience_Courses ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//PureScience_Jobs//

app.get('/PureScience_Jobs', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from pure_science_Jobs ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
//MATHEMATICS_COURSES//

app.get('/MATHEMATICS_COURSES', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from MATHEMATICS_COURSES ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//Arts_Graduate//

app.get('/Arts_Graduate', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Arts_Graduate ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
//Courses_Jobs//

app.get('/GetCourses_Jobs', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Courses_Jobs ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//career_options//

app.get('/Getcareer_options', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from career_options ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//Arts_PostGraduate//

app.get('/Arts_PostGraduate', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Arts_PostGraduate ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
//Arts_Maths//

app.get('/Arts_Maths', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Arts_Maths ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//Arts_Commerce//

app.get('/Arts_Commerce', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Arts_Commerce ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
//Graduate_Medical//

app.get('/Graduate_Medical', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select * from Graduate_Medical ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/*TopRecords*/

app.get('/TopRecords', function(req, res) {
  
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
 
request.query("SELECT TOP 2 * FROM competitive_Exams ORDER BY UniqueId,competitive_Exams DESC", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//school_link//

app.get('/school_link', function(req, res) {
	
	var ResultType =req.query.ResultType;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Link from school_list where ResultType='"+ResultType+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//school_Name//

app.get('/school_Name', function(req, res) {
	
	var ResultType =req.query.ResultType;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select Name,Link from school_list where ResultType='"+ResultType+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
//school_List//

app.get('/school_List', function(req, res) {
	
	var ResultType =req.query.ResultType;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("select ResultType,Name,Link from school_list where ResultType='"+ResultType+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* Display_Question*/

app.get('/Display_Question', function(req, res,chunk) {

	var CategoryType = req.query.CategoryType;
	var DifficultyLevel = req.query.DifficultyLevel;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Question_Table.QuestionNo,Question_Table.Question ,Question_Table.Answer FROM Question_Table INNER JOIN Quiz_table ON Question_Table.Code = Quiz_table.Code WHERE Quiz_table.CategoryType='"+CategoryType+"' AND Quiz_table.DifficultyLevel='"+DifficultyLevel+"' OR Quiz_table.CategoryType='"+CategoryType+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});



/* Display_GK_Question*/

app.get('/Display_GK_Question', function(req, res,chunk) {

	var CategoryType = req.query.CategoryType;
	
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Question_Table.QuestionNo,Question_Table.Question ,Question_Table.Answer FROM Question_Table INNER JOIN Quiz_table ON Question_Table.Code = Quiz_table.Code WHERE  Quiz_table.CategoryType='"+CategoryType+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{         
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* InsertFeedBack */

app.get('/InsertFeedBackDetails', function(req, res) {
	
    var QType = req.query.QType;
    var Username = req.query.Username;
    var Email= req.query.Email;
    var FeedBack_Message = req.query.FeedBack_Message;
	var Rating = req.query.Rating;
    var UpdatedBy = req.query.UpdatedBy;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Username', Username);
    request.input('Email', Email);
    request.input('FeedBack_Message', FeedBack_Message);
	request.input('Rating', Rating);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('InsertFeedBack', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* GetFeedBack*/

app.get('/GetFeedBack', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM FeedBack_table ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Insert_Question_Table */

app.get('/Insert_Question', function(req, res) {
	
    var QType = req.query.QType;
    var QuestionNo = req.query.QuestionNo;
    var Question= req.query.Question;
    var CorrectAnswer = req.query.CorrectAnswer;
	var UserAnswer = req.query.UserAnswer;
    var Explanation = req.query.Explanation;
	var Code = req.query.Code;
	var Answer = req.query.Answer;
    var UniqueId = req.query.UniqueId;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('QuestionNo', QuestionNo);
    request.input('Question', Question);
    request.input('CorrectAnswer', CorrectAnswer);
	request.input('UserAnswer', UserAnswer);
    request.input('Explanation', Explanation);
	request.input('Code', Code);
	request.input('Answer', Answer);
    request.input('UniqueId', UniqueId);
    request.output("SQLReturn"); 

request.execute('Insert_Question_Table', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});
/* GetCorrectAnswer*/

app.get('/GetCorrectResult', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT COUNT(*) CorrectAnswer FROM Question_Table  WHERE CorrectAnswer = UserAnswer", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

// Update //

app.get('/Update',function(req,res,next){
	  
	var UserAnswer = req.query.UserAnswer; 
    var SerialNo= req.query.SerialNo;
    var QuestionNo = req.query.QuestionNo;
    var Code = req.query.Code;
    var UserName = req.query.UserName;
	var UniqueId = req.query.UniqueId;
  
    var data={
        "error":1,
        "clients":""
    };
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
		
    var request = new sql.Request(Connect);

 request.query("UPDATE  Question_Table set UserAnswer = 'D' FROM Question_Table INNER JOIN username_table ON Question_Table.UniqueId = username_table.UniqueId WHERE username_table.UserName = 'sairam' AND username_table.SerialNo= '454645756' AND Question_Table.QuestionNo = '1' AND Question_Table.Code = '1'",function(err, rows){        

            // ... error checks
      if(!err) {
                  res.json("Successfully updated!");
                }
                else {
                   data["error"]=1;
                   data["clients"]="no details found";
                        res.json("There was an error with MySQL.");
                }
        //connection.release();
    })
  
});
});


/* GetFeedNotification*/

app.get('/GetFeedNotification', function(req, res) {

	var Id = req.query.Id;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT B.UniqueId, A.Full_name, A.user_photo, B.timing, B.status,C.post_id FROM tbl_register AS A LEFT JOIN tbl_notification AS B ON A.User_Id = B.liked_user_id LEFT JOIN tbl_news_feed AS C ON C.post_id = B.post_id LEFT JOIN tbl_likes AS D ON D.post_id = C.post_id WHERE C.page_admin_id='"+Id+"' ORDER BY B.UniqueId desc", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* GetWrongAnswer*/

app.get('/GetWrongResult', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT COUNT(*) WrongAnswer FROM Question_Table WHERE CorrectAnswer <> UserAnswer", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* GetEmptyResult*/

app.get('/GetEmptyResult', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT COUNT(*) empty FROM Question_Table WHERE UserAnswer  IS NULL", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});


/* InsertStatus */

app.get('/InsertStatus', function(req, res) {
	
    var QType = req.query.QType;
    var UniqueId = req.query.UniqueId;
    var Status= req.query.Status;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UniqueId', UniqueId);
    request.input('Status', Status);
    request.output("SQLReturn"); 

request.execute('InsertStatus', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* GetStatus*/

app.get('/GetStatus', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Status FROM status_table ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* InsertUsername */

app.get('/InsertUsername', function(req, res) {
	
    var QType = req.query.QType;
    var UserName = req.query.UserName;
    var SerialNo= req.query.SerialNo;
	var Email= req.query.Email;
	var Password= req.query.Password;
	var Phone= req.query.Phone;
	var UniqueId= req.query.UniqueId;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserName', UserName);
    request.input('SerialNo', SerialNo);
	request.input('Email', Email);
	request.input('Password', Password);
	request.input('Phone', Phone);
	request.input('UniqueId', UniqueId);
    request.output("SQLReturn"); 

request.execute('Insert_username_Table', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* UserLogin*/

app.get('/UserLogin', function(req, res) {
	
	var QType = req.query.QType;
    var UserName = req.query.UserName;
	var Password= req.query.Password;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserName', UserName);
	request.input('Password', Password);
    request.output("SQLReturn"); 
	
request.execute('View_UserLogin', function(err, recordsets, returnValue,rows, results) {
    // ... error checks
   res.json(rows);
   console.log(rows);
  
});
});
});
/* UserLogin*/

app.get('/UserLogin1', function(req, res) {
	
    var UserName = req.query.UserName;
	var Password= req.query.Password;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Email ,UserName FROM username_table where UserName='"+UserName+"' AND Password='"+Password+"'", function(err, rows) {
    // ... error checks
   res.json(rows);
   console.log(rows);
  
});
});
});

/* UserSerialNo */
 
app.get('/UserSerialNo', function(req, res) {

  
    var UserName = req.query.UserName;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect); 

request.query("SELECT CASE WHEN MAX(SerialNo) IS NULL THEN 'FALSE' ELSE 'TRUE' END SerialNo FROM  username_table WHERE UserName = '"+UserName+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
	
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* ViewCorrectResult */
 
app.get('/ViewCorrectResult', function(req, res) {

  
    var UserName = req.query.UserName;
	 var SerialNo = req.query.SerialNo;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect); 

request.query("SELECT COUNT(*) CorrectAnswer FROM Question_Table Question_Table INNER JOIN username_table on username_table.UniqueId =Question_Table.UniqueId where UserName='"+UserName+"'and SerialNo='"+SerialNo+"' and CorrectAnswer = UserAnswer ", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
	
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* ViewtimeResult */
 
app.get('/ViewtimeResult', function(req, res) {

    var Id = req.query.Id;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect); 

request.query("SELECT tbl_likes.time FROM tbl_likes SELECT B.UniqueId, A.Full_name, A.user_photo, D.time, B.status,C.post_id FROM tbl_register AS A LEFT JOIN tbl_notification AS B ON A.User_Id = B.liked_user_id LEFT JOIN tbl_news_feed AS C ON C.post_id = B.post_id LEFT JOIN tbl_likes AS D ON D.post_id = C.post_id WHERE C.page_admin_id='"+Id+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
	
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

/* FetchtimeResult */
 
app.get('/FetchtimeResult', function(req, res) {

    var Id = req.query.Id;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect); 

request.query("SELECT tbl_not_related.time FROM tbl_likes SELECT B.UniqueId, A.Full_name, A.user_photo, D.time, B.status,C.post_id FROM tbl_register AS A LEFT JOIN tbl_notification AS B ON A.User_Id = B.liked_user_id LEFT JOIN tbl_news_feed AS C ON C.post_id = B.post_id LEFT JOIN tbl_likes AS D ON D.post_id = C.post_id WHERE C.page_admin_id='"+Id+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
	
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});


/* Fetch_register_details */
 
app.get('/Fetch_register_details', function(req, res) {

    var Id = req.query.Id;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect); 

request.query("SELECT tbl_not_related.time FROM tbl_likes SELECT B.UniqueId, A.Full_name, A.user_photo, D.time, B.status,C.post_id FROM tbl_register AS A LEFT JOIN tbl_notification AS B ON A.User_Id = B.liked_user_id LEFT JOIN tbl_news_feed AS C ON C.post_id = B.post_id LEFT JOIN tbl_likes AS D ON D.post_id = C.post_id WHERE C.page_admin_id='"+Id+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
	
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});


/* State_Master*/

app.get('/States',function(req,res){
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT StateID,StateName from StateMaster ", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});

// MEME //

/* Insertregister */

app.post('/Insertregister', function(req, res) {
	
    var QType = req.query.QType;
    var full_name = req.query.full_name;
    var email= req.query.email;
    var password = req.query.password;
	var registered_date = req.query.registered_date;
	var page_name = req.query.page_name;
    var updatedby = req.query.updatedby;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('full_name', full_name);
	request.input('email', email);
    request.input('password', password);
	request.input('registered_date', registered_date);
	request.input('page_name', page_name);
    request.input('updatedby', updatedby);
    request.output("SQLReturn"); 

request.execute('Insert_tbl_register', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

// Update//

app.post('/Update1',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var user_photo = req.files.image.name;
	
	var name ="http://paypre.info/images/"+user_photo;	
	
	var user_id = req.query.user_id;
	var full_name = req.query.full_name;
    var email= req.query.email;
    var password = req.query.password;
	var registered_date = req.query.registered_date;
	var page_name = req.query.page_name;
    var updatedby = req.query.updatedby;
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


	request.query("update tbl_register set full_name='"+full_name+"',email='"+email+"',registered_date='"+registered_date+"',page_name='"+page_name+"',updatedby='"+updatedby+"',password='"+password+"',user_photo='"+name+"' where user_id='"+user_id+"'",function(err){
      // ... error checks
  if(!user_photo){
      console.log("There was an error")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + user_photo;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("update success");
      });
    }
});
});
});
});
/* Getregister*/

app.get('/Getregister', function(req, res) {

     var email= req.query.email;
	 
     var password= req.query.password;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM tbl_register where password='"+password+"' AND email='"+email+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* GetPassword*/

app.get('/GetPassword', function(req, res) {

     var email= req.query.email;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT password FROM tbl_register where email='"+email+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});


/* Insertnotification */

app.post('/Insertnotification', function(req, res) {
	
    var QType = req.query.QType;
    var id = req.query.id;
    var liked_user_id= req.query.liked_user_id;
    var post_id = req.query.post_id;
	var status = req.query.status;
	var timing = req.query.timing;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('id', id);
	request.input('liked_user_id',liked_user_id);
    request.input('post_id', post_id);
	request.input('status', status);
	request.input('timing', timing);
    request.output("SQLReturn"); 

request.execute('Insert_tbl_notification', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Gettbl_notification*/

app.get('/Getnotification', function(req, res) {

    var liked_user_id = req.query.liked_user_id;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM tbl_notification where liked_user_id ='"+liked_user_id+"' ORDER BY id,liked_user_id ,post_id,status,timing DESC ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Fetch_Status*/

app.get('/Fetch_Status', function(req, res) {
    
    var page_admin_id = req.query.page_admin_id;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
	request.input('page_admin_id', page_admin_id);

request.execute('Fetch_Status', function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Fetch_admin_id*/

app.get('/Fetch_admin_id', function(req, res) {
    var QType = req.query.QType;
    var page_admin_id = req.query.page_admin_id;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('page_admin_id', page_admin_id);
	
request.query("SELECT * FROM tbl_news_feed WHERE page_admin_id = '"+page_admin_id+"' ", function(err, recordsets, returnValue, results) {
//request.execute('Fetch_News_Feed', function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* 
app.get('/Get_newfeed', function(req, res) {
    
    var page_admin_id = req.query.page_admin_id;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('page_admin_id', page_admin_id);
	
request.execute('Get_newfeed', function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});*/

/* Insert_tbl_achievements */

app.get('/Insert_tbl_achievements', function(req, res) {
	
    var QType = req.query.QType;
    var user_id = req.query.user_id;
    var level= req.query.level;
    var trophy_500 = req.query.trophy_500;
	var trophy_1000 = req.query.trophy_1000;
    var trophy_10000 = req.query.trophy_10000;
	var rank = req.query.rank;
	var page_name = req.query.page_name;
	var points = req.query.points;
	var full_name= req.query.full_name;
    var email = req.query.email;
	var password = req.query.password;
    var registered_date = req.query.registered_date;
	var user_photo = req.query.user_photo;
	var updatedby = req.query.updatedby;
	
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('user_id', user_id);
    request.input('level', level);
    request.input('trophy_500', trophy_500);
	request.input('trophy_1000', trophy_1000);
    request.input('trophy_10000', trophy_10000);
	request.input('rank', rank);
	request.input('page_name', page_name);
	request.input('points', points);
	request.input('full_name', full_name);
	request.input('email', email);
    request.input('password', password);
	request.input('registered_date', registered_date);
	request.input('user_photo', user_photo);
	request.input('updatedby', updatedby);
    request.output("SQLReturn"); 

request.execute('Insert_tbl_achievements', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Insert_tbl_topic */

app.post('/Insert_tbl_topic', function(req, res) {
	
    var QType = req.query.QType;
    var topic_id = req.query.topic_id;
	var topic_name = req.query.topic_name;
	var timing = req.query.timing;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('topic_id', topic_id);
	request.input('topic_name', topic_name);
	request.input('timing', timing);
    request.output("SQLReturn"); 

request.execute('Insert_tbl_topic', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Topic_Last_Record*/

app.get('/Topic_Last_Record', function(req, res) {
    
   // var liked_user_id = req.query.liked_user_id;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT TOP 1 * FROM tbl_topic ORDER BY UniqueId DESC", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

// UpdateDp//

app.post('/UpdateDp',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var user_photo = req.files.image.name;
	
	var name ="http://paypre.info/images/"+user_photo;	
	
	var user_id = req.query.user_id;
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


	request.query("update tbl_register set user_photo='"+name+"' where user_id='"+user_id+"'",function(err){
      // ... error checks
  if(!user_photo){
      console.log("0")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + user_photo;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("1");
      });
    }
});
});
});
});

/* post_news_feed */

app.post('/post_news_feed', function(req, res) {
	
    var QType = req.query.QType;
    var page_admin_id = req.query.page_admin_id;
    var page_admin_name= req.query.page_admin_name;
    var page_dp = req.query.page_dp;
	var time = req.query.time;
	var rank = req.query.rank;
	var likes = req.query.likes;
	var comments = req.query.comments;
	var not_related = req.query.not_related;
	var meme = req.query.meme;
	var posted_userid = req.query.posted_userid;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('page_admin_id', page_admin_id);
	request.input('page_admin_name',page_admin_name);
    request.input('page_dp', page_dp);
	request.input('time', time);
	request.input('rank', rank);
	request.input('likes', likes);
	request.input('comments',comments);
    request.input('not_related', not_related);
	request.input('meme', meme);
	request.input('posted_userid', posted_userid);
    request.output("SQLReturn"); 

request.execute('Insert_news_feed', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

// UpdateMEME//

app.post('/Update_MeMe',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var meme = req.files.image.name;
	
	var name ="http://paypre.info/images/"+meme;	
	
	var post_id = req.query.post_id;
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


	request.query("update tbl_news_feed set meme='"+name+"' where post_id='"+post_id+"'",function(err){
      // ... error checks
  if(!meme){
      console.log("0")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + meme;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("1");
      });
    }
});
});
});
});
/* GetNewsFeed*/

app.get('/GetNewsFeed', function(req, res) {
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select * from tbl_news_feed order by post_id desc", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* post_likes */

app.post('/post_likes', function(req, res) {
	
    var QType = req.query.QType;
    var post_id = req.query.post_id;
    var user_id= req.query.user_id;
    var likes = req.query.likes;
	var time = req.query.time;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('post_id', post_id);
	request.input('user_id',user_id);
    request.input('likes', likes);
	request.input('time', time);
    request.output("SQLReturn"); 

request.execute('Insert_tbl_likes', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Insert_tbl_comments */

app.post('/Insert_tbl_comments', function(req, res) {
	
    var QType = req.query.QType;
    var post_id = req.query.post_id;
	var user_id = req.query.user_id;
	var comment = req.query.comment;
	var time = req.query.time;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('post_id', post_id);
	request.input('user_id', user_id);
	request.input('comment', comment);
	request.input('time', time);
    request.output("SQLReturn"); 

request.execute('Insert_tbl_comments', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


/* Get_tbl_comments*/

app.get('/Get_tbl_comments', function(req, res) {
	
	var post_id= req.query.post_id;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT tbl_news_feed.page_admin_id,tbl_news_feed.page_admin_name,tbl_news_feed.page_dp, tbl_news_feed.time,tbl_news_feed.rank,tbl_news_feed.likes,tbl_news_feed.comments,tbl_news_feed.not_related,tbl_news_feed.meme,tbl_news_feed.posted_userid,tbl_comments.user_id,tbl_comments.comment,tbl_comments.time FROM tbl_news_feed INNER JOIN tbl_comments ON tbl_news_feed.post_id=tbl_comments.post_id where tbl_news_feed.post_id='"+post_id+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});


//police app//

/* Insert_User_Registration */

app.get('/Insert_User_Registration', function(req, res) {
	
    var QType = req.query.QType;
	//var UserId = req.query.UserId;
    var Name = req.query.Name;
    var ContactNo= req.query.ContactNo;
    var Sec_ContactNo = req.query.Sec_ContactNo;
	var Gender = req.query.Gender;
    var Email = req.query.Email;
	var Password = req.query.Password;
	var Address = req.query.Address;
	var Type = req.query.Type;
	var StationName = req.query.StationName;
	var Role = req.query.Role;
	var Firebase_id = req.query.Firebase_id;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	//request.input('UserId', UserId);
    request.input('Name', Name);
    request.input('ContactNo', ContactNo);
    request.input('Sec_ContactNo', Sec_ContactNo);
	request.input('Gender', Gender );
    request.input('Email', Email);
	request.input('Password', Password);
	request.input('Address', Address);
	request.input('Type', Type);
	request.input('StationName', StationName);
	request.input('Role', Role);
	request.input('Firebase_id',Firebase_id);
    request.output("SQLReturn"); 

request.execute('Insert_User_Registration', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


/* Update_User_Registration */

app.get('/Update_User_Registration', function(req, res) {
	
    var QType = req.query.QType;
	var UserId = req.query.UserId;
    var Name = req.query.Name;
    var ContactNo= req.query.ContactNo;
    var Sec_ContactNo = req.query.Sec_ContactNo;
	var Gender = req.query.Gender ;
    var Email = req.query.Email;
	var Password = req.query.Password;
	var Address = req.query.Address;
	var Type = req.query.Type;
	var StationName = req.query.StationName;
	var Role = req.query.Role;
	var Firebase_id = req.query.Firebase_id;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('UserId', UserId);
    request.input('Name', Name);
    request.input('ContactNo', ContactNo);
    request.input('Sec_ContactNo', Sec_ContactNo);
	request.input('Gender', Gender );
    request.input('Email', Email);
	request.input('Password', Password);
	request.input('Address', Address);
	request.input('Type', Type);
	request.input('StationName', StationName);
	request.input('Role', Role);
	request.input('Firebase_id',Firebase_id);
    request.output("SQLReturn"); 

request.execute('UpdateUser', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* UpdatePassword */

app.get('/UpdatePassword', function(req, res) {
	
    var QType = req.query.QType;
    var MobileNo = req.query.MobileNo;
	var Password = req.query.Password;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('MobileNo', MobileNo);
	request.input('Password', Password);
    request.output("SQLReturn"); 

request.execute('UpdatePassword', function(err, recordsets, returnValue, results) {
    // ... error checks
     if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Insert_sub_complaint */

app.get('/Insert_sub_complaint', function(req, res) {
	
    var QType = req.query.QType;
    var UserId = req.query.UserId;
    var ComplaintNo= req.query.ComplaintNo;
    var Status = req.query.Status;
	var Description  = req.query.Description ;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserId', UserId);
    request.input('ComplaintNo', ComplaintNo);
    request.input('Status', Status);
	request.input('Description', Description );
    request.output("SQLReturn"); 

request.execute('Insert_sub_complaint_table', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Getlogin*/

app.get('/GetDescription', function(req, res) {

      var ComplaintNo =req.query.ComplaintNo;
   
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Description FROM sub_complaint_table where ComplaintNo='"+ComplaintNo+"' ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* GetUser_Registration*/

app.get('/GetUser_Registration', function(req, res) {

      var Type =req.query.Type;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT StationName,Role FROM User_Registration where Type='"+Type+"' ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* FetchUser_Registration*/

app.get('/FetchUser_Registration', function(req, res) {

    var Type =req.query.Type;
	var StationName =req.query.StationName;
	
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM User_Registration where Type='"+Type+"' AND StationName ='"+StationName+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* Fetch_Alertment*/

app.get('/Fetch_Alertment', function(req, res) {

    var UserId =req.query.UserId;
	var StationName =req.query.StationName;
	var Status =req.query.Status;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT A.UserId, A.Police_Name ,A.Role,A.Shift,A.Location,A.Duty,A.Shift_Hours,A.StationName,A.Category,A.Type,A.Status FROM Alertment_table A INNER JOIN User_Registration B ON A.UserId=B.UserId WHERE B.StationName='"+StationName+"' AND B.UserId='"+UserId+"' AND A.Status='Y'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

// Update_Register_Password//

app.post('/Update_Register_Password', function(req, res) {
	
	var UserId = req.query.UserId;
	var password = req.query.password;
	var data={
        "error":1,
        "clients":""
    };
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


request.query("update User_Registration set password='"+password+"' where UserId='"+UserId+"'",function(err){
      // ... error checks
  if(!err) {
		res.json("Successfully updated!");
		}
		else {
		   data["error"]=1;
		   data["clients"]="no details found";
				res.json("There was an error with MySQL.");
		}
});
});
});

// Update_Using_Status //

app.get('/Update_Using_Status',function(req,res){
   
    var UserId= req.query.UserId;
    var Using_Status= req.query.Using_Status;
   
    var data={
        "error":1,
        "clients":""
    };
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("update User_Registration set Using_Status='"+Using_Status+"' where UserId='"+UserId+"'",function(err){
      // ... error checks
  if(!err) {
		res.json("Successfully updated!");
		}
		else {
		   data["error"]=1;
		   data["clients"]="no details found";
				res.json("There was an error with MySQL.");
		}
});
});
});

/* Retrive_Using_Status*/

app.get('/Retrive_Using_Status', function(req, res) {

    var UserId = req.query.UserId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM User_Registration where UserId='"+UserId+"' AND Using_Status='1' ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});


// Update_FireBase//

app.get('/Update_FireBase', function(req, res) {
	
	var UserId = req.query.UserId;
	var Firebase_id = req.query.Firebase_id;
	
    var data={
        "error":1,
        "clients":""
    };
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
		
    var request = new sql.Request(Connect);

 request.query("UPDATE User_Registration SET Firebase_id='"+Firebase_id+"' WHERE UserId='"+UserId+"'",function(err, rows){        

            // ... error checks
      if(!err) {
                  res.json("Successfully updated!");
                }
                else {
                   data["error"]=1;
                   data["clients"]="no details found";
                        res.json("There was an error with MySQL.");
                }
        //connection.release();
    })
  
});
});

/* Insert_Complaint_table */

app.post('/uploaded',multipart(), function(req, res) {
	
	fs.readFile(req.files.Document.path, function (err, data) {
		
	var FIR_Document = req.files.Document.name;
	
	var name ="http://paypre.info/images/"+FIR_Document;
		
    var QType = req.query.QType;
    var UID = req.query.UID;
    var First_Name= req.query.First_Name;
    var Middle_Name = req.query.Middle_Name;
	var Last_Name  = req.query.Last_Name ;
    var LandlineNo = req.query.LandlineNo;
	var Email = req.query.Email;
    var MobileNo= req.query.MobileNo;
    var Nature_of_Information  = req.query.Nature_of_Information;
	var ID_Type = req.query.ID_Type;
    var ID_Number = req.query.ID_Number;
	var Add_HosueNo = req.query.Add_HosueNo;
	var StreetName = req.query.StreetName;
	var Colony = req.query.Colony;
	var Village = req.query.Village;
	var Block = req.query.Block;
	var Country = req.query.Country;
	var State = req.query.State;
	var District = req.query.District;
	var Police_Station = req.query.Police_Station;
	var Pincode = req.query.Pincode;
	var FIR_No = req.query.FIR_No;
	var Incident_details = req.query.Incident_details;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UID', UID);
    request.input('First_Name', First_Name);
    request.input('FIR_Document', name);
    request.input('Middle_Name', Middle_Name);
	request.input('Last_Name', Last_Name);
    request.input('LandlineNo', LandlineNo);
	request.input('Email', Email);
    request.input('MobileNo', MobileNo);
    request.input('Nature_of_Information', Nature_of_Information );
	request.input('ID_Type', ID_Type);
    request.input('ID_Number', ID_Number);
	request.input('Add_HosueNo', Add_HosueNo);
	request.input('StreetName', StreetName);
	request.input('Colony', Colony);
	request.input('Village', Village);
	request.input('Block', Block);
    request.input('Country', Country);
	request.input('State', State);
	request.input('District', District);
	request.input('Police_Station', Police_Station);
	request.input('Pincode', Pincode);
	request.input('FIR_No', FIR_No);
    request.input('Incident_details', Incident_details);
    request.output("SQLReturn"); 

request.execute('Insert_FIR_Details', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{     
if(!FIR_Document){
      console.log("There was an error")
	  res.redirect('/images/' + req.files.Document.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + FIR_Document;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }  
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});
});
/* Retrive_FireBase*/

app.get('/Retrive_FireBase', function(req, res) {

    var Type = req.query.Type;
	var StationName = req.query.StationName;
	var UserId = req.query.UserId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Firebase_id FROM User_Registration where Type='"+Type+"' OR StationName='"+StationName+"' OR UserId='"+UserId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* GetUser_Registre_MobileNo*/

app.get('/GetUser_Registre_MobileNo', function(req, res) {

    var ContactNo =req.query.ContactNo;
	 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
request.query("SELECT CASE WHEN MAX(ContactNo) IS NULL THEN 'FALSE' ELSE 'TRUE' END ContactNo FROM User_Registration WHERE ContactNo = '"+ContactNo+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});


/* Get_Alertment_table*/

app.get('/Get_Alertment_table', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT TOP 1 * FROM Alertment_table ORDER BY DESC ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

app.get('/getuser',function(req,res){
	
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
    request.query("select top 1 * from ImageTest_ELocker  ",function(err, rows){

        res.json(rows);
        console.log(rows);
    });
});
});

/* Insert_Complaint_table */

app.post('/Insert_Complaint',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
	var picture = req.files.image.name;
	var name ="http://localhost:2020/uploads/"+picture;
		
    var QType = req.query.QType;
    var UserId = req.query.UserId;
    var Name= req.query.Name;
    var Address = req.query.Address;
	var MobileNo = req.query.MobileNo;
    var EmailId = req.query.EmailId;
	var time_of_loss = req.query.time_of_loss;
    var Category_Name= req.query.Category_Name;
    var Complaint_Status  = req.query.Complaint_Status;
	var Description = req.query.Description;
    var severity = req.query.severity;
	var Station = req.query.Station;
	var S_from = req.query.S_from;
	var R_to = req.query.R_to;
	var location = req.query.location;
	var Role = req.query.Role;
	var UpdatedBy = req.query.UpdatedBy;
    

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserId', UserId);
    request.input('Name', Name);
    request.input('picture', name);
    request.input('Address', Address);
	request.input('MobileNo', MobileNo);
    request.input('EmailId', EmailId);
	request.input('time_of_loss', time_of_loss);
    request.input('Category_Name', Category_Name);
    request.input('Complaint_Status', Complaint_Status );
	request.input('Description', Description);
    request.input('severity', severity);
	request.input('S_from', S_from);
	request.input('R_to', R_to);
	request.input('Station', Station);
	request.input('Role', Role);
	request.input('location', location);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('Insert_Complaint_table', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{     
if(!picture){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.image.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }  
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});
});

/* Complaint_Station_list*/

app.get('/Complaint_Station_list',function(req,res){
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT Station from Complaint_table", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});

/* DispalyComplaint*/

app.get('/DispalyComplaint',function(req,res){
	
	var location = req.query.location;
	var UserId = req.query.UserId;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT * from Complaint_table where location='"+location+"' OR UserId='"+UserId+"' ", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});

/* list_Complaint_Records*/

app.get('/list_Complaint_Records',function(req,res){
	
	var Station = req.query.Station;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT * from Complaint_table where Station='"+Station+"'", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});

/* list_Category_Records*/

app.get('/Category_Records',function(req,res){
	
	var Category_Name = req.query.Category_Name;
	var UserId = req.query.UserId;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT * from Complaint_table where UserId='"+UserId+"' AND  Category_Name='"+Category_Name+"'", function(err, recordsets, returnValue, results) {

 if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});
/* New_Insert_Complaint */

app.post('/New_Insert_Complaint',multipart(),function(req, res) {
	
	
	fs.readFile(req.files.image.path, function (err, data) {
		
	var picture = req.files.image.name;
	
	var name ="http://paypre.info/imagess/"+picture;
	
	var UserId = req.query.UserId;
	var ComplaintNo = req.query.ComplaintNo;
    var Name= req.query.Name;
    var Address = req.query.Address;
	var MobileNo = req.query.MobileNo;
    var EmailId = req.query.EmailId;
	var Date_of_loss = req.query.Date_of_loss;
	var time_of_loss = req.query.time_of_loss;
    var Category_Name= req.query.Category_Name;
    var Complaint_Status  = req.query.Complaint_Status;
	var Description = req.query.Description;
	var location = req.query.location;
    var severity = req.query.severity;
	var Station = req.query.Station;
	var StationId = req.query.StationId;
	var Forward = req.query.Forward;
	var Flag = req.query.Flag;
	var UpdatedBy = req.query.UpdatedBy;
	var UpdatedOn = req.query.UpdatedOn;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
    request.input('UserId', UserId);
	request.input('ComplaintNo', ComplaintNo);
    request.input('Name', Name);
    request.input('picture', name);
    request.input('Address', Address);
	request.input('MobileNo', MobileNo);
    request.input('EmailId', EmailId);
	request.input('Date_of_loss', Date_of_loss);
	request.input('time_of_loss', time_of_loss);
    request.input('Category_Name', Category_Name);
    request.input('Complaint_Status', Complaint_Status );
	request.input('location', location);
	request.input('Description', Description);
    request.input('severity', severity);
	request.input('Station', Station);
	request.input('StationId', StationId);
	request.input('Forward', Forward);
	request.input('Flag', Flag);
    request.input('UpdatedBy', UpdatedBy);
	request.input('UpdatedOn', UpdatedOn);
    request.output("SQLReturn"); 

request.execute('Insert_Complaint_table_test1', function(err, recordsets, returnValue, results) {
    // ... error checks
      if(err){ 
    console.log(err);
    //res.json({code:1,message:err});
  }else{     
if(!picture){
      console.log("There was an error")
	  res.redirect('/imagess/' + req.files.image.name);
      res.redirect("/imagess/");
      res.end();
    } else {
      var newPath = __dirname + "/imagess/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }  
	console.log(request.parameters.SQLReturn.value);
	res.json({message:request.parameters.SQLReturn.value});   
  }
});
});
});
});

/* Update_Forward */

app.get('/Update_Forward', function(req, res) {
	
    var QType = req.query.QType;
    var UserId = req.query.UserId;
	var Station = req.query.Station;
	var S_from = req.query.S_from;
	var R_to = req.query.R_to;
	var Forward = req.query.Forward;
	var Complaint_Status = req.query.Complaint_Status;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserId', UserId);
	request.input('S_from', S_from);
	request.input('R_to', R_to);
	request.input('Forward', Forward);
	request.input('Station', Station);
	request.input('Complaint_Status', Complaint_Status);
    request.output("SQLReturn"); 

request.execute('Update_Forward', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Information */

app.post('/Information',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
		
	var Document = req.files.image.name;
	var name ="http://localhost:2020/uploads/"+Document;
		
    var QType = req.query.QType;
    var Information = req.query.Information;
   
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Information', Information);
    request.input('Document', name);
    request.output("SQLReturn"); 

request.execute('Insert_Information', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{     
if(!Document){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.image.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + Document;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }  
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});
});

/* Insert_Submission_Details */

app.get('/Insert_Submission_Details', function(req, res) {
	
    var QType = req.query.QType;
    var District = req.query.District;
	var PoliceStation = req.query.PoliceStation;
	var FirNumber  = req.query.FirNumber;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('District', District);
	request.input('PoliceStation', PoliceStation);
	request.input('FirNumber', FirNumber);
    request.output("SQLReturn"); 

request.execute('Insert_Submission_Details', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


//InsertComplent//

app.post('/InsertComplent',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var picture = req.files.image.name;
	
	var name ="http://localhost:2020/uploads/"+picture;
	
	var UserId = req.query.UserId;
	var Name = req.query.Name;
	var Address = req.query.Address;
	var MobileNo = req.query.MobileNo;
	var EmailId = req.query.EmailId;
	//var Date_of_loss = req.query.Date_of_loss;
	var time_of_loss = req.query.time_of_loss;
	var Category_Name = req.query.Category_Name;
	var Complaint_Status = req.query.Complaint_Status;
	var Description = req.query.Description;
	var severity = req.query.severity;
	var Station = req.query.Station;
	var UpdatedBy = req.query.UpdatedBy;
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


	request.query("insert into Complaint_table(UserId,Name,Address,MobileNo,EmailId,time_of_loss,Category_Name,Complaint_Status,Description,severity,Station,UpdatedBy,picture)values('"+UserId+"','"+Name+"','"+Address+"','"+MobileNo+"','"+EmailId+"','"+time_of_loss+"','"+Category_Name+"','"+Complaint_Status+"','"+Description+"','"+severity+"','"+Station+"','"+UpdatedBy+"','"+name+"')",function(err){
      // ... error checks
  if(!picture){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.image.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }
});
});
});
});

/* GetNationality*/

app.get('/GetNationality',function(req,res){
	
	var MobileNo = req.query.MobileNo;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("SELECT Nationality from Nationality", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});


// UpdateComplent//

app.get('/UpdateComplent', function(req, res) {

	var UserId = req.query.UserId;
	var Station = req.query.Station;
	var S_from = req.query.S_from;
	var R_to = req.query.R_to;
	
	 var data={
        "error":1,
        "clients":""
    };
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("Update Complaint_table set Station='"+Station+"',R_to='"+R_to+"' where S_from='"+S_from+"' AND UserId='"+UserId+"'" ,function(err, rows){        

            // ... error checks
      if(!err) {
		   res.end("Successfully Updated");
                  //res.json("Successfully Updated!");
                }
                else {
                   data["error"]=1;
                   data["clients"]="no details found";
                        res.json("There was an error with SQL.");
                }
});
});
});


// Update_Status //

app.get('/Update_Status', function(req, res) {

    var Complaint_Status =req.query.Complaint_Status;
    var ComplaintNo =req.query.ComplaintNo;
   
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
     
	  var data={
        "error":1,
        "clients":""
    }; 
request.query("Update  Complaint_table set Complaint_Status='"+Complaint_Status+"' where ComplaintNo='"+ComplaintNo+"'" ,function(err, rows){        

            // ... error checks
      if(!err) {
                  res.json("Successfully Updated!");
                }
                else {
                   data["error"]=1;
                   data["clients"]="no details found";
                        res.json("There was an error with SQL.");
                }
});
});
});


/* GetComplaint*/

app.get('/GetComplaint',function(req,res){
	
	var MobileNo = req.query.MobileNo;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT * from Complaintt_table where MobileNo='"+MobileNo+"'", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});

// tbl_from_to//

app.post('/Insert_tbl_from_to',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var picture = req.files.image.name;
	
	var name ="http://localhost:2020/uploads/"+picture;	
	
	var UserId = req.query.UserId;
	var U_from = req.query.U_from;
	var Role = req.query.Role;
	var Station = req.query.Station;
	var U_to = req.query.U_to;
	var Text = req.query.Text;
	var Password = req.query.Password;
	var UpdatedBy = req.query.UpdatedBy;
	
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


	request.query("insert into tbl_from_to(UserId,U_from,Role,Station,U_to,Text,Password,UpdatedBy,picture)values('"+UserId+"','"+U_from+"','"+Role+"','"+Station+"','"+U_to+"','"+Text+"','"+Password+"','"+UpdatedBy+"','"+name+"')",function(err){
      // ... error checks
  if(!picture){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.image.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }
});
});
});
});

//Insert_announcement //

app.get('/Insertannouncement',function(req, res) {
	
	var QType = req.query.QType;
	var Message = req.query.Message;
	var Subject = req.query.Subject;
	var Type = req.query.Type;
	var Type1 = req.query.Type1;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('Message', Message);
	request.input('Subject', Subject);
	request.input('Type', Type);
	request.input('Type1', Type1);
    request.output("SQLReturn"); 

request.execute('Insert_announcement', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* LIST count*/

app.get('/Count_List',function(req,res){
	
	var StationName = req.query.StationName;
	var StationName = req.query.Station;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('StationName', StationName);
	request.input('Station', StationName);
	
request.execute('Fetch_Count', function(err, recordsets, returnValue, results) {

 if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});
/* Announcement*/

app.get('/Announcement', function(req, res) {

    var Type1 = req.query.Type1;
	var Type = req.query.Type;
	
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select Message,Subject from announcement where Type='"+Type+"' AND  Type1='"+Type1+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* Announcement*/

app.get('/All_Announcement', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select Message,Subject from announcement", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Retrive_MobileNo*/

app.get('/Retrive_MobileNo', function(req, res) {

    var mobileno = req.query.ContactNo;
	var Password = req.query.Password;
	var mobileno = req.query.Email;
	var mobileno = req.query.Name;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM User_Registration where ContactNo='"+mobileno+"' AND Password='"+Password+"' OR Email='"+mobileno+"' AND Password='"+Password+"' OR Password='"+Password+"'AND Name='"+mobileno+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* Retrive_Eamil*/

app.get('/Retrive_Email', function(req, res) {

    var Email = req.query.Email;
	var Password = req.query.Password;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM User_Registration where Email='"+Email+"' AND Password='"+Password+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* Retrive_Eamil*/

app.get('/Retrive_UserId', function(req, res) {

    var UserId = req.query.UserId;
	var Password = req.query.Password;
	
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM User_Registration where UserId='"+UserId+"' AND Password='"+Password+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Retrive_FireBase*/

app.get('/Retrive_FireBase', function(req, res) {

    var Role = req.query.Role;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Firebase_id FROM User_Registration where Role='"+Role+"' ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Retrive_FireBase_Notification*/

app.get('/FireBase_Notification', function(req, res) {

    var Type = req.query.Type;
	var StationName = req.query.StationName;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Firebase_id FROM User_Registration where Type='"+Type+"' AND StationName='"+StationName+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Station_List*/

app.get('/Station_List', function(req, res) {

    var Police_Name = req.query.Police_Name;
	var Role = req.query.Role;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Police_Name,Role,Shift,Location,Duty,Shift_Hours,WeekDates,Type FROM Station_List where Police_Name='"+Police_Name+"' AND Role='"+Role+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Station_List_Details*/

app.get('/Station_List_Details', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Police_Name,Role,Shift,Duty,Shift_Hours,WeekDates FROM Station_List ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Insert_Alertment_table */

app.get('/Insert_Alertment_table', function(req, res) {
	
    var QType = req.query.QType;
    var Police_Name = req.query.Police_Name;
    var Role= req.query.Role;
    var Shift = req.query.Shift;
	var Location = req.query.Location;
    var Duty = req.query.Duty;
	var Shift_Hours = req.query.Shift_Hours;
    var WeekDates= req.query.WeekDates;
    var Type  = req.query.Type;
	var Status = req.query.Status;
    var UpdatedBy = req.query.UpdatedBy;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Police_Name', Police_Name);
    request.input('Role', Role);
    request.input('Shift', Shift);
	request.input('Location', Location);
    request.input('Duty', Duty);
	request.input('Shift_Hours', Shift_Hours);
    request.input('WeekDates', WeekDates);
    request.input('Type', Type);
	request.input('Status', Status);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('Insert_Alertment_table', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Alertment_list*/

app.get('/Alertment_list', function(req, res) {
	
	var UserId = req.query.UserId;
	var Status = req.query.Status;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM Alertment_table where UserId='"+UserId+"' AND Status='"+Status+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* View_FIR_Details*/

app.get('/View_FIR_Details', function(req, res) {

	var FIR_No = req.query.FIR_No;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM Information_Details where FIR_No='"+FIR_No+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* Insert_Station_table */

app.get('/Insert_Station_table', function(req, res) {
	
    var QType = req.query.QType;
    var Police_Name = req.query.Police_Name;
    var Role= req.query.Role;
    var Shift = req.query.Shift;
    var Duty = req.query.Duty;
	var Shift_Hours = req.query.Shift_Hours;
    var WeekDates= req.query.WeekDates;
    var UpdatedBy = req.query.UpdatedBy;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Police_Name', Police_Name);
    request.input('Role', Role);
    request.input('Shift', Shift);
    request.input('Duty', Duty);
	request.input('Shift_Hours', Shift_Hours);
    request.input('WeekDates', WeekDates);
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('Insert_Station_table', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Insert_tbl_Map */

app.get('/Insert_tbl_Map', function(req, res) {
	
    var QType = req.query.QType;
    var UserId = req.query.UserId;
    var UserName= req.query.UserName;
    var MobileNo = req.query.MobileNo;
	var Map_link   = req.query.Map_link;
    var UpdatedBy = req.query.UpdatedBy;
	

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserId', UserId);
    request.input('UserName', UserName);
    request.input('MobileNo', MobileNo);
	request.input('Map_link', Map_link  );
    request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('Insert_tbl_Map', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


//hotel app//

/* Hotel_Register */

app.get('/Hotel_Register', function(req, res) {
	
    var QType = req.query.QType;
    var MerchantName = req.query.MerchantName;
    var HotelName= req.query.HotelName;
    var MobileNo = req.query.MobileNo;
	var Location  = req.query.Location ;
    var Latitude = req.query.Latitude;
	var Longitude = req.query.Longitude;
	var Password = req.query.Password;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('MerchantName', MerchantName);
    request.input('HotelName', HotelName);
    request.input('MobileNo', MobileNo);
	request.input('Location', Location );
    request.input('Latitude', Latitude);
	request.input('Longitude', Longitude);
	request.input('Password', Password);
    request.output("SQLReturn"); 

request.execute('Insert_Hotel_Register', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* GetHotel_Register*/

app.get('/Get_Hotel_Register',function(req,res){
	
	var mobileno = req.query.MobileNo;
	var ComplaintNo = req.query.ComplaintNo;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT HotelName,Location,Latitude,Longitude FROM  Hotel_Register ", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});

/* Hotel_User_Register */

app.get('/Insert_Hotel_User', function(req, res) {
	
    var QType = req.query.QType;
    var Name = req.query.Name;
    var MobileNo= req.query.MobileNo;
    var Location = req.query.Location;
	var Password  = req.query.Password ;
    var Latitude = req.query.Latitude;
	var Longitude = req.query.Longitude;
	var C_Password = req.query.C_Password;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('Name', Name);
    request.input('MobileNo', MobileNo);
    request.input('Location', Location);
	request.input('Password', Password );
    request.input('Latitude', Latitude);
	request.input('Longitude', Longitude);
	request.input('C_Password', C_Password);
    request.output("SQLReturn"); 

request.execute('Insert_Hotel_User_Register', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* RetriveDetails*/

app.get('/RetriveDetails', function(req, res) {

   //var MobileNo= req.query.MobileNo;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT MobileNo, Password, 'HR' AS 'LType' FROM Hotel_Register UNION ALL SELECT MobileNo, Password, 'HUR' AS 'LType' FROM Hotel_User_Register ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

// news_feed//

app.post('/news_feed',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var meme = req.files.image.name;
	
	var name ="http://paypre.info/images/"+meme;

    var page_admin_id =req.query.page_admin_id;	
	var page_admin_name =req.query.page_admin_name;
    var time =req.query.time;
    var rank =req.query.rank;
    var likes =req.query.likes;
    var comments =req.query.comments;
    var not_related =req.query.not_related;
    //var user_id =req.query.user_id;		
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);

//request.query("INSERT INTO tbl_news_feed(page_admin_id,time,rank,likes,comments,not_related,meme)VALUES('"+page_admin_id+"','"+time+"','0','0','0','0','"+name+"')",function(err){
request.query("INSERT INTO tbl_news_feed(page_admin_id,page_admin_name,page_dp,time,rank,likes,comments,not_related,meme)VALUES('"+page_admin_id+"','"+time+"',,'0','0','0','0','"+name+"'(select full_name from tbl_register where user_id='"+user_id+"'),(select user_photo from tbl_register where user_id=@user_id))",function(err){
 
      // ... error checks
  if(!meme){
      console.log("0")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + meme;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("1");
      });
    }
});
});
});
});



// Hotel_Image_Details//

app.post('/Hotel_Image_Details',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var foodimage = req.files.image.name;
	
	var name ="http://paypre.info/images/"+foodimage;

    var category_item =req.query.category_item;	
	var foodname =req.query.foodname; 
    var description =req.query.description;
    var price =req.query.price;
    var discount =req.query.discount;
	var count =req.query.count;
    
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


request.query("INSERT INTO Hotel_Image(category_item,foodname,description,price,discount,count,foodimage)VALUES('"+category_item+"','"+foodname+"','"+description+"','"+price+"','"+discount+"','"+count+"','"+name+"')",function(err){
 
      // ... error checks
  if(!foodimage){
      console.log("0")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + foodimage;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("1");
      });
    }
});
});
});
});

// Update_count //

app.get('/Update_count', function(req, res) {

    var foodname =req.query.foodname;
    var MerchantId =req.query.MerchantId;
    var UserId =req.query.UserId;
    var count =req.query.count;	
    
    sql.connect(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request();
     
	  var data={
        "error":1,
        "clients":""
    }; 
request.query("Update  Hotel_Image set count='"+count+"' where foodname='"+foodname+"' AND MerchantId='"+MerchantId+"' AND UserId='"+UserId+"'" ,function(err, rows){        

            // ... error checks
      if(!err) {
                  res.json("Successfully Updated!");
                }
                else {
                   data["error"]=1;
                   data["clients"]="no details found";
                        res.json("There was an error with SQL.");
                }
});
});
});


/* Fetch_category_item*/

app.get('/Fetch_category_item', function(req, res) {

    var MerchantId =req.query.MerchantId;
  
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
request.query("SELECT category_item FROM Hotel_Image WHERE MerchantId = '"+MerchantId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* Fetch_Hotel_Image*/

app.get('/Fetch_Hotel_Image', function(req, res) {

    var MerchantId =req.query.MerchantId;
	var foodname =req.query.foodname;
  
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
request.query("SELECT * FROM Hotel_Image WHERE MerchantId = '"+MerchantId+"' AND foodname='"+foodname+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Order_Sub_table*/

app.get('/Order_Sub_table',function(req,res){
	
	var MobileNo = req.query.MobileNo;
	 
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("SELECT * from Order_Sub_table", function(err, recordsets, returnValue, results) {

       if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});



// remove_foodname //

app.get('/remove_foodname', function(req, res) {

    var foodname =req.query.foodname;
    var MerchantId =req.query.MerchantId;	
   
    sql.connect(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request();
     
	  var data={
        "error":1,
        "clients":""
    }; 
request.query("Delete from Hotel_Image where foodname='"+foodname+"' AND MerchantId='"+MerchantId+"'" ,function(err, rows){        

            // ... error checks
      if(!err) {
                  res.json("Successfully Deleted!");
                }
                else {
                   data["error"]=1;
                   data["clients"]="no details found";
                        res.json("There was an error with SQL.");
                }
});
});
});

/* HotelMobileNo */
 
app.get('/HotelMobileNo', function(req, res) {

  
    var MobileNo = req.query.MobileNo;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect); 

request.query("SELECT CASE WHEN MAX(MobileNo) IS NULL THEN 'FALSE' ELSE 'TRUE' END MobileNo FROM Hotel_Register WHERE MobileNo = '"+MobileNo+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
	
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

// Update_Hotel_Image//

app.post('/Update_Hotel_Image',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
		
	var foodimage = req.files.image.name;
	
	var name ="http://paypre.info/images/"+foodimage;	
	
	var category_item = req.query.category_item;
	var foodname = req.query.foodname;
    var description= req.query.description;
    var price = req.query.price;
	var discount = req.query.discount;
	var MerchantId = req.query.MerchantId;
	var UserId = req.query.UserId;
   
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


request.query("update Hotel_Image set category_item='"+category_item+"',foodname='"+foodname+"',description='"+description+"',price='"+price+"',discount='"+discount+"',foodimage='"+name+"' where MerchantId='"+MerchantId+"' AND UserId='"+UserId+"'",function(err){
      // ... error checks
  if(!foodimage){
      console.log("0")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + foodimage;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("1");
      });
    }
});
});
});
});




// Hotel_User_image//

app.post('/Hotel_User_image',multipart(), function(req, res) {
	fs.readFile(req.files.image.path, function (err, data) {
		
	var picture = req.files.image.name;
	
	var name ="http://paypre.info/images/"+picture;

    var foodname =req.query.foodname;
    var MerchantId =req.query.MerchantId;		
	var amount =req.query.amount; 
    var discount =req.query.discount;
    var count =req.query.count;
    var userid =req.query.userid;
	var username =req.query.username;
    
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);

request.query("INSERT INTO Hotel_User_Food(foodname,MerchantId,amount,discount,count,userid,username,picture)VALUES('"+foodname+"','"+MerchantId+"','"+amount+"','"+discount+"','"+count+"','"+userid+"','"+username+"','"+name+"')",function(err){
 
      // ... error checks
  if(!picture){
      console.log("0")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("1");
      });
    }
});
});
});
});

/* Retrive_OrderDetails*/

app.get('/Retrive_OrderDetails', function(req, res) {

    var userid = req.query.userid;
	var MerchantId = req.query.MerchantId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM Hotel_User_Food where userid='"+userid+"' AND MerchantId='"+MerchantId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});


//InsertComplent//

app.post('/Insertimage',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
	
	var picture = req.files.image.name;
	
	var name ="http://localhost:2020/uploads/"+picture;
	
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


	request.query("insert into image_complaint(picture)values('"+name+"')",function(err){
      // ... error checks
  if(!picture){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.image.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }
});
});
});
});




/* Insert_Delete_Orders */

app.get('/Insert_Delete_Orders', function(req, res) {
	
    var QType = req.query.QType;
	var UserId = req.query.UserId;
	var MerchantId = req.query.MerchantId;
	var UniqueId = req.query.UniqueId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserId', UserId);
	request.input('MerchantId', MerchantId);
	request.input('UniqueId', UniqueId);
    request.output("SQLReturn"); 

request.execute('Insert_Delete_Orders', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Top_RECORDS*/

app.get('/Top_RECORDS',function(req,res){
	
	
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("select top 10 * From Order_Sub_table Order By UniqueId Desc", function(err, recordsets, returnValue, results) {

   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});


/* GetTrackDetails*/

app.get('/GetTrackDetails',function(req,res){
	
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
   request.query("select * From Track_tbl", function(err, recordsets, returnValue, results) {

   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
    });
});
});


/* Insert_Cart_Orders */

app.get('/Insert_Cart_Orders', function(req, res) {
	
    var QType = req.query.QType;
	var MerchantId  = req.query.MerchantId;
    var UserId = req.query.UserId;
	var FoodName  = req.query.FoodName;
	var Amount = req.query.Amount;
	var Discount  = req.query.Discount;
	var Foodstock = req.query.Foodstock;
	var HotelName  = req.query.HotelName;
	var Discount_Amount = req.query.Discount_Amount;
	var Status  = req.query.Status;
	var Address  = req.query.Address;
	var UpdatedBy = req.query.UpdatedBy;
	
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('MerchantId', MerchantId);
	request.input('UserId', UserId);
	request.input('FoodName', FoodName);
	request.input('Amount', Amount);
	request.input('Discount', Discount);
	request.input('Foodstock', Foodstock);
	request.input('HotelName', HotelName);
	request.input('Discount_Amount', Discount_Amount);
	request.input('Status', Status);
	request.input('Address', Address);
	request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('Insert_Cart_Orders', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});
//Insert_announcement //

app.get('/Insert_announcement',function(req, res) {

    var user_id= req.query.user_id;
    var message= req.query.message;
    var subject = req.query.subject;
	var EmailId = req.query.EmailId;

    var data={
        "error":1,
        "clients":""
    };
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
request.query("insert into announcement(user_id,message,subject,EmailId) values('"+user_id+"','"+message+"','"+subject+"','"+EmailId+"')",function(err,rows,fields){
             if(!err){
            res.json({code:1,message:'Success'});
        }else{
            data["error"]=1;
            data["users"]="not added";
            res.json({code:0,message:'Failure'+err});
        }  
         
    })

  
  });
});
// Insert_Rating //

app.get('/Insert_Rating',function(req,res){
   
    var MerchantId= req.query.MerchantId;
    var FoodName= req.query.FoodName;
    var Rating = req.query.Rating;

    var data={
        "error":1,
        "clients":""
    };
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
request.query("insert into Rating_table(MerchantId,FoodName,Rating) values('"+MerchantId+"','"+FoodName+"','"+Rating+"')",function(err,rows,fields){
             if(!err){
            res.json({code:1,message:'Success'});
        }else{
            data["error"]=1;
            data["users"]="not added";
            res.json({code:0,message:'Failure'+err});
        }  
         
    })

  
  });
});

/* ShowRating*/

app.get('/ShowRating', function(req, res) {

    var FoodName = req.query.FoodName;
	var MerchantId = req.query.MerchantId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Rating FROM Rating_table where FoodName='"+FoodName+"' AND MerchantId='"+MerchantId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

// Update_Rating //

app.get('/Update_Rating', function(req, res) {

    var FoodName =req.query.FoodName;
    var MerchantId =req.query.MerchantId;
    var Rating =req.query.Rating;	
   
    sql.connect(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request();
     
	  var data={
        "error":1,
        "clients":""
    }; 
request.query("Update Rating_table set Rating='"+Rating+"' where FoodName='"+FoodName+"' AND MerchantId='"+MerchantId+"'" ,function(err, rows){        

            // ... error checks
      if(!err) {
                  res.json("Successfully Updated!");
                }
                else {
                   data["error"]=1;
                   data["clients"]="no details found";
                        res.json("There was an error with SQL.");
                }
});
});
});


/* UpdateStatus */

app.get('/UpdateStatus', function(req, res) {
	
    var QType = req.query.QType;
    var UserId = req.query.UserId;
	var MerchantId = req.query.MerchantId;
	var Complaint_Status  = req.query.Complaint_Status;
	var UniqueId = req.query.UniqueId;
	var Status = req.query.Status;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserId', UserId);
	request.input('MerchantId', MerchantId);
	request.input('Status', Status);
	request.input('UniqueId', UniqueId);
    request.output("SQLReturn"); 

request.execute('UpdateStatus', function(err, recordsets, returnValue, results) {
    // ... error checks
     if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* CountryMaster*/

app.get('/Get_Country', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Country FROM CountryMaster ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Get_States*/

app.get('/Get_States', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select m.StateName from [ExamApp].[dbo].[CountryMaster]c join [PayPre].[dbo].[State_Master]m on c.CountryId = m.StateID ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Get_State_Name*/

app.get('/Get_State_Name', function(req, res) {
	
	var StateID = req.query.StateID;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select m.StateName from [ExamApp].[dbo].[CountryMaster]c join [PayPre].[dbo].[State_Master]m on c.CountryId = m.StateID where m.StateID='"+StateID+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Insert_Favourite_Details */

app.get('/Insert_Favourite_Details', function(req, res) {
	
    var QType = req.query.QType;
    var UniqueId = req.query.UniqueId;
	var UserId = req.query.UserId;
	var MerchantId = req.query.MerchantId;
	var FoodName = req.query.FoodName;
	var Favourite = req.query.Favourite;
	var UpdatedBy = req.query.UpdatedBy;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UniqueId', UniqueId);
	request.input('UserId', UserId);
	request.input('MerchantId', MerchantId);
	request.input('FoodName', FoodName);
	request.input('Favourite', Favourite);
	request.input('UpdatedBy', UpdatedBy);
    request.output("SQLReturn"); 

request.execute('Insert_Favourite_Details', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Get_Favourite_Details*/

app.get('/Get_Favourite_Details', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM Favourite_Details ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* json*/

app.get('/json', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
var query = request.query("SELECT * FROM announcement ", function(err, nestedRows,returnValue, results) {
    // ... error checks
	 if(err){ 
    console.log(err);
    res.json({code:json,android:err});
  }else{  
    
    res.send(JSON.stringify(nestedRows));
  }
});
});
});

/* android*/

app.get('/android', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	

var query = request.query("SELECT * FROM Android ", function(err, nestedRows,returnValue, results) {
    // ... error checks
	 if(err){ 
    console.log(err);
    res.json({code:json,android:err});
  }else{  
     console.log(nestedRows);
	
    res.send(JSON.stringify(nestedRows));
  }
});
});
});

/* android1*/

app.get('/android1', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
var query1 = request.query("SELECT * FROM Android ", function(err,result) {
	var query2 = request.query("SELECT * FROM Android ", function(err,result1) {
		var query3 = request.query("SELECT * FROM Android ", function(err,result2) {
    // ... error checks
if(err){ 
    console.log(err);
     res.json({code:1,message:err});
  }else{  
     console.log(result);
	 res.json('{"android":'+JSON.stringify(result)+'"android1":'+JSON.stringify(result2)+'"android2":'+JSON.stringify(result2)+'}');
	//res.send('{"android":[{"ver":"1.5","name":"Cupcake","api":"API level 3"},{"ver":"1.6","name":"Donut","api":"API level 4"},{"ver":"2.0 - 2.1","name":"Eclair","api":"API level 5 - 7"},{"ver":"2.2","name":"Froyo","api":"API level 8"},{"ver":"2.3","name":"Gingerbread","api":"API level 9 - 10"},{"ver":"3.0 - 3.2","name":"Honeycomb","api":"API level 11 - 13"},{"ver":"4.0","name":"Ice Cream Sandwich","api":"API level 14 - 15"},{"ver":"4.1 - 4.3","name":"JellyBean","api":"API level 16 - 18"},{"ver":"4.4","name":"KitKat","api":"API level 19"},{"ver":"5.0 - 5.1","name":"Lollipop","api":"API level 21 - 22"},{"ver":"6.0","name":"Marshmallow","api":"API level 23"},{"ver":"7.0 - 7.1","name":"Nougat","api":"API level 24 - 25"}]}');
	

  }
  
});
});
});
	})
})

/* Insert_Cyber_Crime */

app.get('/Insert_Cyber_Crime', function(req, res) {
	
    var QType = req.query.QType;
	var UserId = req.query.UserId;
    var Name= req.query.Name;
	var Email = req.query.Email;
    var Address = req.query.Address;
	var Number = req.query.Number;
	var ControlDetails= req.query.ControlDetails;
	var Suspicion = req.query.Suspicion;
    var EmailContent = req.query.EmailContent;
	var Offending_Sender = req.query.Offending_Sender;
	var ServerContent = req.query.ServerContent;
	var Category = req.query.Category;
	var Question1 = req.query.Question1;
	var Question2 = req.query.Question2;
	var Question3 = req.query.Question3;
	var Question4 = req.query.Question4;
	var Question5 = req.query.Question5;
	var Question6 = req.query.Question6;
    
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('UserId', UserId);
    request.input('Name', Name);
	request.input('Email', Email);
    request.input('Address', Address);
	request.input('Number', Number);
	request.input('ControlDetails', ControlDetails);
    request.input('Suspicion', Suspicion);
	request.input('EmailContent', EmailContent);
	request.input('Offending_Sender', Offending_Sender);
	request.input('ServerContent', ServerContent);
	request.input('Category', Category);
	request.input('Question1', Question1);
	request.input('Question2', Question2);
	request.input('Question3', Question3);
	request.input('Question4', Question4);
	request.input('Question5', Question5);
	request.input('Question6', Question6);
    request.output("SQLReturn"); 

request.execute('Insert_Cyber_Crime', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});
	 	
/* Get_Cyber_Crime*/

app.get('/Get_Cyber_Crime', function(req, res) {

    var UserId = req.query.UserId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM Cyber_Crime where UserId='"+UserId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Retrive_Cyber_Category*/

app.get('/Retrive_Cyber_Category', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT UserId,Name,Category FROM Cyber_Crime", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Get_Cyber_Upload*/

app.get('/Get_Cyber_Upload', function(req, res) {

	  //var UniqueId = req.query.UniqueId;
	  var UserId = req.query.UserId;
    
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT Upload FROM Cyber_Upload where  UserId='"+UserId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Get_Cyber_Upload*/

app.get('/Get_Cyber_Upload1', function(req, res,cb) {

	  //var UniqueId = req.query.UniqueId;
	  var UserId = req.query.UserId;
    var result;
	var Connect = new sql.Connection(config3, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select Sign from VAODetails where Sno=2 ", function(err,recordset) {
	//request.query("SELECT Upload FROM Cyber_Upload ", function(err,recordset) {
    // ... error checks
  res.writeHead(200, {'Content-Type': 'image/jpeg'});
//var image = rs;
var image  = new Buffer(recordset[0].Sign);
console.log(recordset[0].Sign)
res.end(image);
/*console.log(recordset[0]);
res.json(recordset[0]);

res.writeHead(200, {"Content-Type": 'image/jpeg'});
console.log(recordset)
var image  = new Buffer(String(recordset[0]));
res.write(image)
res.end();
*/

});
});
});

/* Get_Cyber_SoftCofy*/

app.get('/Get_Cyber_SoftCofy', function(req, res) {

	  var UniqueId = req.query.UniqueId;
	  var UserId = req.query.UserId;
    
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT SoftCofy FROM Cyber_SoftCofy where UniqueId='"+UniqueId+"' AND UserId='"+UserId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
/* Get_Cyber_ServerLog*/

app.get('/Get_Cyber_ServerLog', function(req, res) {

	  var UniqueId = req.query.UniqueId;
	  var UserId = req.query.UserId;
    
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT ServerLog FROM Cyber_ServerLog where UniqueId='"+UniqueId+"' AND UserId='"+UserId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

/* Cyber_Investigation */

app.get('/Cyber_Investigation', function(req, res) {
	
    var QType = req.query.QType;
	var UserId = req.query.UserId;
    var Name= req.query.Name;
	var Category = req.query.Category;
	var Question1 = req.query.Question1;
	var Question2 = req.query.Question2;
	var Question3 = req.query.Question3;
	var Question4 = req.query.Question4;
	var Question5 = req.query.Question5;
	var Question6 = req.query.Question6;
    
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('UserId', UserId);
    request.input('Name', Name);
	request.input('Category', Category);
	request.input('Question1', Question1);
	request.input('Question2', Question2);
	request.input('Question3', Question3);
	request.input('Question4', Question4);
	request.input('Question5', Question5);
	request.input('Question6', Question6);
    request.output("SQLReturn"); 

request.execute('Insert_Cyber_Investigation', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});
/* Retrive_Cyber_Investigation*/

app.get('/Retrive_Cyber_Investigation', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT UserId,Name,Category,Question1,Question2,Question3,Question4,Question5,Question6 FROM Investigation_Details", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
		 
/* UpdateCrimeNo */

app.get('/UpdateCrimeNo', function(req, res) {

    var CrimeNo = req.query.CrimeNo;
	var UserId = req.query.UserId;
	var Status  = req.query.Status;
    var data={
        "error":1,
        "clients":""
    };
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("Update Cyber_Crime set Status='"+Status+"' where CrimeNo='"+CrimeNo+"'And UserId='"+UserId+"' ", function(err){
      // ... error checks
  if(!err) {
		res.json("Successfully updated!");
		}
		else {
		   data["error"]=1;
		   data["clients"]="no details found";
				res.json("There was an error with MySQL.");
		}
});
});
});

//InsertUserPhoto//

app.post('/InsertUserPhoto',multipart(), function(req, res) {
	
	fs.readFile(req.files.UserPhoto.path, function (err, data) {
	
	var UserPhoto = req.files.UserPhoto.name;
	
	var name ="http://localhost:2020/uploads/"+UserPhoto;
	var UserId = req.query.UserId;
	var Send_to = req.query.Send_to;
	var Location = req.query.Location;
	var Latitude = req.query.Latitude;
	var Longtitude = req.query.Longtitude;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);

	request.query("insert into UserPhoto(UserId,Send_to,Location,Latitude,Longtitude,UserPhoto)values('"+UserId+"','"+Send_to+"','"+Location+"','"+Latitude+"','"+Longtitude+"','"+name+"')",function(err){
      // ... error checks
  if(!UserPhoto){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.UserPhoto.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + UserPhoto;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }
});
});
});
});

//InsertImages//

app.post('/InsertImages',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
	
	var Images = req.files.image.name;
	
	var name ="http://localhost:2020/uploads/"+Images;
	var UserId = req.query.UserId;
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


request.query("insert into Images_tbl(Images)values('"+name+"')",function(err){
      // ... error checks
  if(!Images){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.image.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + Images;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }
});
});
});
});



app.get('/Retrive_Images1', function(req, res) {

var Send_to =req.query.Send_to;
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select * from UserPhoto where Send_to="+Send_to, function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
	 


/*pagenation*/

app.get('/pagenation/:starting/:ending', function(req, res) {
	
   var starting = req.params.starting;
   var ending = req.params.ending;
   var Using_Status = req.query.Using_Status;
   
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("SELECT *,Using_Status AS starting, Using_Status AS ending FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY UniqueId) as row FROM User_Registration where Type='User')Using_Status WHERE Using_Status.row>='"+starting+"' AND Using_Status.row<='"+ending+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});

//CareerImage_tbl//

app.post('/CareerImage',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
	
	var CareerImage = req.files.image.name;
	
	var name ="http://localhost:2020/uploads/"+CareerImage;
	var UserId = req.query.UserId;
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


request.query("insert into CareerImage_tbl(CareerImage)values('"+name+"')",function(err){
      // ... error checks
  if(!CareerImage){
      console.log("There was an error")
	  res.redirect('/uploads/' + req.files.image.name);
      res.redirect("/uploads/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/" + CareerImage;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }
});
});
});
});


app.get('/Retrive_CareerImage', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT CareerImage FROM CareerImage_tbl order by ImageId desc", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

app.get('/UserName_List', function(req, res) {

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("  select UserId,Name from User_Registration", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});
	
/* Insert_Setting_App */

app.get('/Insert_Setting_App', function(req, res) {
	
	var UserId = req.query.UserId;
    var Announcement= req.query.Announcement;
	var FIR_Registration = req.query.FIR_Registration;
	var IncidentDetails = req.query.IncidentDetails;
	var Forwarded_Complaints = req.query.Forwarded_Complaints;
	var CyberCrime = req.query.CyberCrime;
	var SensitiveData = req.query.SensitiveData;
	var Role = req.query.Role;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('UserId', UserId);
    request.input('Announcement', Announcement);
	request.input('FIR_Registration', FIR_Registration);
	request.input('IncidentDetails', IncidentDetails);
	request.input('Forwarded_Complaints', Forwarded_Complaints);
	request.input('CyberCrime', CyberCrime);
	request.input('SensitiveData', SensitiveData);
	request.input('Role', Role);
    request.output("SQLReturn"); 

request.execute('Insert_Setting_App', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

// App_List
app.get('/App_List', function(req, res) {
	
	var Role= req.query.Role;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select * from Setting_App where Role='"+Role+"' ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

//30/11/2017
	  
/* Insert_PoliceDetails */

app.get('/Insert_PoliceDetails', function(req, res) {
	
	var QType = req.query.QType;
	var Name = req.query.Name;
	var ContactNo = req.query.ContactNo;
	var Gender = req.query.Gender;
	var Email = req.query.Email;
	var Password = req.query.Password;
	var Address = req.query.Address;
	var Type = req.query.Type;
	var StationName = req.query.StationName;
	var StationId = req.query.StationId;
	var Handling_UserId = req.query.Handling_UserId;
	var Handling_CaseId = req.query.Handling_CaseId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('Name', Name);
	request.input('ContactNo', ContactNo);
	request.input('Gender', Gender);
	request.input('Email', Email);
	request.input('Password', Password);
	request.input('Address', Address);
	request.input('Type', Type);
	request.input('StationName', StationName);
	request.input('StationId', StationId);
	request.input('Handling_UserId', Handling_UserId);
	request.input('Handling_CaseId', Handling_CaseId);
    request.output("SQLReturn"); 

request.execute('Insert_Police_Registration', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

// Policelist
app.get('/Display_Policelist', function(req, res) {
	
	var UserId= req.query.UserId;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select * from PoliceTable where UserId='"+UserId+"' ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});	
	
/* Insert_User_Registration_sample */

app.get('/User_Registration_Sample', function(req, res) {
	
    var QType = req.query.QType;
	//var UserId = req.query.UserId;
    var Name = req.query.Name;
    var ContactNo= req.query.ContactNo;
    var Sec_ContactNo = req.query.Sec_ContactNo;
	var Gender = req.query.Gender;
    var Email = req.query.Email;
	var Password = req.query.Password;
	var Address = req.query.Address;
	var Type = req.query.Type;
	var StationName = req.query.StationName;
	var Role = req.query.Role;
	var Firebase_id = req.query.Firebase_id;
	var Handling_PC_id = req.query.Handling_PC_id;
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	var StationId = req.query.StationId;
	var DistrictId = req.query.DistrictId;
	var TalukId = req.query.TalukId;
	var DesigId = req.query.DesigId;
	var Using_Status = req.query.Using_Status;
 
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	//request.input('UserId', UserId);
    request.input('Name', Name);
    request.input('ContactNo', ContactNo);
    request.input('Sec_ContactNo', Sec_ContactNo);
	request.input('Gender', Gender );
    request.input('Email', Email);
	request.input('Password', Password);
	request.input('Address', Address);
	request.input('Type', Type);
	request.input('StationName', StationName);
	request.input('Role', Role);
	request.input('Firebase_id',Firebase_id);
	request.input('Handling_PC_id', Handling_PC_id);
	request.input('latitude', latitude);
	request.input('longitude', longitude);
	request.input('StationId', StationId);
	request.input('DistrictId', DistrictId);
	request.input('TalukId', TalukId);
	request.input('DesigId',DesigId);
	request.input('Using_Status',Using_Status);
    request.output("SQLReturn"); 

request.execute('Insert_User_Registration_Sample', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});


//Taluk_Stations
app.get('/Taluk_Stations', function(req, res) {
	
	var TalukId= req.query.TalukId;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT st.StationName FROM Station_Master st join User_Registration ur  on ur .StationId=st.TalukId WHERE ur.TalukId='"+TalukId+"' ", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});	
/* Display _Assignment*/

app.get('/Display_Assignment', function(req, res) {

    var Flag =req.query.Flag;
	var StationId =req.query.StationId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT UserId,Role, Police_Name  FROM Alertment_table  WHERE StationId='"+StationId+"' AND Flag='1'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

//Insertsignature//

app.post('/Insertsignature',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
	
	var signature = req.files.image.name;
	
	var name ="http://paypre.info/images/"+signature;
	//var UserId = req.query.UserId;
	
 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


request.query("insert into signature_tbl(signature)values('"+name+"')",function(err){
      // ... error checks
  if(!signature){
      console.log("There was an error")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + signature;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }
});
});
});
});


/* GPS_Tracking details */

app.get('/GPS_Tracking', function(req, res) {
	
    var QType = req.query.QType;
    var UserId= req.query.UserId;
	var StationId = req.query.StationId;
    var latitude = req.query.latitude;
	var longtitude  = req.query.longtitude ;
    
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
    request.input('UserId', UserId);
    request.input('StationId', StationId);
    request.input('latitude', latitude);
	request.input('longtitude', longtitude );
    request.output("SQLReturn"); 

request.execute('Insert_GPS_Tracking', function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(request.parameters.SQLReturn.value);
        res.json({code:1,message:request.parameters.SQLReturn.value});   
  }
});
});
});

/* Get _GPS */

app.get('/Get_GPS', function(req, res) {

	var  UserId =req.query.UserId;
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("SELECT * FROM GPS_Tracking  WHERE UserId='"+UserId+"'", function(err, recordsets, returnValue, results) {
    // ... error checks
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
  
});
});
});

// Policelist
app.get('/Display_Policelist1', function(req, res) {
	
	var args={
		UserId:UserId
	}
	var jsonxml = require('jsontoxml');
var xmlArgs = jsonxml(args);
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select * from PoliceTable",xmlArgs, function(err, nestedRows, returnValue, results) {
   if(err){ 
    console.log(err);
    res.json({code:json,message:err});
  }else{  
     console.log(nestedRows);
	
    res.send(JSON.stringify(nestedRows));
  }
});
});
});	
	
 /* Insert_announcement_sample */

app.post('/Insert_announcement_sample1',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
		
	var picture = req.files.image.name;
	
	var name ="http://paypre.info/images/"+picture;
		
    var QType = req.query.QType;
	var Message = req.query.Message;
	var Subject = req.query.Subject;
    var Type = req.query.Type;
    var Type1= req.query.Type1;
    var StationId = req.query.StationId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('QType', QType);
	request.input('Message', Message);
	request.input('Subject', Subject);
    request.input('Type', Type);
    request.input('Type1', Type1);
    request.input('StationId', StationId);
	request.input('picture', name);
    request.output("SQLReturn"); 

request.execute('Insert_announcement_sample', function(err, recordsets, returnValue, results) {
    // ... error checks
      if(err){ 
    console.log(err);
    //res.json({code:1,message:err});
  }else{     
if(!picture){
      console.log("There was an error")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.end();
    } else {
      var newPath = __dirname + "/images/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.end("upload success");
      });
    }  
        console.log(request.parameters.SQLReturn.value);
        res.json({message:request.parameters.SQLReturn.value});   
  }
});
});
});
})

/* Insert_announcement_sample */

app.post('/Insert_announcement_sample',multipart(), function(req, res) {
	
	fs.readFile(req.files.image.path, function (err, data) {
	var picture = req.files.image.name;
	var name ="http://paypre.info/images/"+picture;
	
	var Message = req.query.Message;
	var Subject = req.query.Subject;
    var Type = req.query.Type;
    var Type1= req.query.Type1;
	var StationId= req.query.StationId;
  
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	

request.query("Insert into announcement_tbl(Message,Subject,Type,Type1,StationId,picture)values('"+Message+"','"+Subject+"','"+Type+"','"+Type1+"','"+StationId+"','"+name+"')", function(err, recordsets, returnValue, results) {
    // ... error checks
     
if(!picture){
      console.log("0")
	  res.redirect('/images/' + req.files.image.name);
      res.redirect("/images/");
      res.send();
    } else {
      var newPath = __dirname + "/images/" + picture;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
       res.send(name);
		
      });
	    
		
    }  
})
});
});
});

/* Insert_Complaint_sample */

app.post('/Insert_Complaint_sample',upload.any(), function(req, res) {
	
		if(req.files.length>=3){
		
		var picture = req.files[0].path;
		var picture1 = req.files[1].path;
		var picture2 = req.files[2].path;
		
		req.files[0].path = "http://localhost:2020/"+picture;
		req.files[1].path = "http://localhost:2020/"+picture1;
		req.files[2].path = "http://localhost:2020/"+picture2;
		
	var UserId = req.query.UserId;
	var Name = req.query.Name;
	var Address = req.query.Address;
	var MobileNo = req.query.MobileNo;
	var EmailId = req.query.EmailId;
	var time_of_loss = req.query.time_of_loss;
	var Category_Name = req.query.Category_Name;
	var Complaint_Status = req.query.Complaint_Status;
	var Description = req.query.Description;
	var severity = req.query.severity;
	var Station = req.query.Station;
	var StationId = req.query.StationId;
	var Forward = req.query.Forward;
	var UpdatedBy = req.query.UpdatedBy;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);


request.query("insert into Complaint_table(UserId,Name,Address,MobileNo,EmailId,time_of_loss,Category_Name,Complaint_Status,Description,severity,Station,Forward,StationId,UpdatedBy,picture,picture1,picture2)values('"+UserId+"','"+Name+"','"+Address+"','"+MobileNo+"','"+EmailId+"','"+time_of_loss+"','"+Category_Name+"','"+Complaint_Status+"','"+Description+"','"+severity+"','"+Station+"','N','"+StationId+"','"+UpdatedBy+"','"+req.files[0].path+"','"+req.files[1].path+"','"+req.files[2].path+"')",function(err){
    // ... error checks
})
	})
     res.send("Upload success");
   }/*else{
   res.send("Please upload  3 photos");
   }*/
	})

	
	
// Designation_Master //

app.get('/Insert_Designation',function(req,res){
   
    var DesignationId= req.query.DesignationId;
    var DesignationName= req.query.DesignationName;

    var data={
        "error":1,
        "clients":""
    };
	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
request.query("insert into Designation_Master(DesignationId,DesignationName) values('"+DesignationId+"','"+DesignationName+"')",function(err,rows,fields){
             if(!err){
            res.json({code:1,message:'Success'});
        }else{
            data["error"]=1;
            data["users"]="not added";
            res.json({code:0,message:'Failure'+err});
        }  
         
    })

  
  });
});

// Display_Designation

app.get('/Display_Designation', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select * from Designation_Master",function(err, recordsets, returnValue, results) {
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets); 
  }
  
});
});
});	

/* Fetch_Login */

app.get('/Login', function(req, res) {
	
    var mobileno = req.query.ContactNo;
	var Password = req.query.Password;
	var mobileno = req.query.Email;
	var mobileno = req.query.UserId;
	var mobileno = req.query.UserName;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

var myObj=request.query("select (CASE WHEN ContactNo <> 'none' OR UserName <> 'none' OR Email <> 'none' OR UserId <>'none'THEN 'EXESITS' ELSE 'NOT EXESITS' END) as Message FROM User_Registration where ContactNo='"+mobileno+"' OR UserName='"+mobileno+"'  OR Email='"+mobileno+"' OR UserId='"+mobileno+"'", function(err, myObj) {
    // ... error checks
  	 var test = {
		"Message":"NOT EXESITS"
	};
	
	if(myObj.length>0){
		 res.json(myObj);
	}else{
		 res.json(test);
	}
	 
});
});
});


/* Fetch_DSP */

app.get('/Fetch_DSP', function(req, res) {
	
    var District = req.query.District;
    var Division = req.query.Division;
	var SP = req.query.SP;
    var DSP = req.query.DSP;
	var StationId = req.query.StationId;
	var PoliceId = req.query.PoliceId;
	var rStatus = req.query.rStatus;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);

var myObj=request.query("SELECT DivisionId,DivisionName FROM SMP_mstrSubDivision WHERE District='"+District+"'", function(err, myObj,returnValue, results) {
    // ... error checks
    var err = [{
		"Message":"No Records"
}];
	
	if(myObj.length>0){
		 res.json(myObj);
	}else{
		 res.json(err);
	}
});
});
});


//Count_cStatus_test

app.get('/Count_cStatus_test', function(req, res) {
	
	var ClientId= req.query.ClientId;
	var AssignDate= req.query.AssignDate;
	var UserId= req.query.UserId;
	var TargetMonth= req.query.TargetMonth;
	var EmpCode= req.query.EmpCode;
	
    var Connect = new sql.Connection(config1, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	

var query1 = request.query("select count(*)as TotalCount,COUNT(CASE WHEN cStatus = 'Pending' then 1 ELSE 0 END) as Pending,COUNT(CASE WHEN cStatus = 'Working' then 1 ELSE 0 END) as Working,COUNT(CASE WHEN cStatus = 'Cancelled' then 1 ELSE 0 END) as Cancelled,COUNT(CASE WHEN cStatus = 'OnProcess' then 1 ELSE 0 END) as OnProcess,COUNT(CASE WHEN cStatus = 'Completed' then 1 ELSE 0 END) as Completed From ClientAssign  where  UserId='"+UserId+"'", function(err,result) {
var query2 = request.query("select count(*)as TotalCount,COUNT(CASE WHEN cStatus = 'Pending' then 1 ELSE 0 END) as Pending,COUNT(CASE WHEN cStatus = 'Working' then 1 ELSE 0 END) as Working,COUNT(CASE WHEN cStatus = 'Cancelled' then 1 ELSE 0 END) as Cancelled,COUNT(CASE WHEN cStatus = 'OnProcess' then 1 ELSE 0 END) as OnProcess,COUNT(CASE WHEN cStatus = 'Completed' then 1 ELSE 0 END) as Completed From ClientAssign WHERE  AssignDate ='"+AssignDate+"' AND UserId='"+UserId+"'", function(err,result1) {
var query3 = request.query("SELECT A.EmpCode,CAST(A.FirstName AS NVARCHAR) + ' ' + CAST(A.LastName AS NVARCHAR) AS 'EmpName',C.DeptName,D.DesgName,B.ClientId,COALESCE(E.TargetAmount,0) 'TargetAmount',COALESCE(SUM(B.Budget),0) 'Achieved',COALESCE(E.TargetAmount,0) - COALESCE(SUM(B.Budget),0) 'Pending',(COALESCE(SUM(B.Budget),0)*100)/nullif(COALESCE(E.TargetAmount,0),0) 'Percent'  FROM mstrEmployee As A LEFT JOIN ApprovedClient AS B ON A.EmpCode = B.EmpCode LEFT JOIN mstrDepartment AS C ON A.DeptCode =C.DeptCode LEFT JOIN mstrDesignation AS D ON A.DeptCode = D.DeptCode LEFT JOIN mstrEmployeeTarget AS E ON A.EmpCode=E.EmployeeName WHERE A.DesigCode = D.DesgCode AND D.DeptCode = C.DeptCode AND A.BranchCode=C.BranchCode AND C.BranchCode=D.BranchCode AND  A.EmpStatus = 'Y' AND C.DeptStatus = 'Y' AND C.DeptName IN ('Marketing Dept', 'Marketing')AND A.EmpCode = '"+EmpCode+"' AND E.TargetMonth = '"+TargetMonth+"' GROUP BY A.EmpCode,A.FirstName,A.LastName,C.DeptName,D.DesgName,B.ClientId,E.TargetAmount ORDER BY Achieved DESC", function(err,result2) {
var query4 = request.query("SELECT cStatus,SUM(CASE datepart(month,AssignDate) WHEN 1 THEN 1 ELSE 0 END ) AS 'January',SUM(CASE datepart(month,AssignDate) WHEN 2 THEN 1 ELSE 0 END) AS 'February',SUM(CASE datepart(month,AssignDate) WHEN 3 THEN 1 ELSE 0 END) AS 'March',SUM(CASE datepart(month,AssignDate) WHEN 4 THEN 1 ELSE 0 END) AS 'April',SUM(CASE datepart(month,AssignDate) WHEN 5 THEN 1 ELSE 0 END) AS 'May',SUM(CASE datepart(month,AssignDate) WHEN 6 THEN 1 ELSE 0 END) AS 'June',SUM(CASE datepart(month,AssignDate) WHEN 7 THEN 1 ELSE 0 END) AS 'July',SUM(CASE datepart(month,AssignDate) WHEN 8 THEN 1 ELSE 0 END) AS 'August',SUM(CASE datepart(month,AssignDate) WHEN 9 THEN 1 ELSE 0 END) AS 'September',SUM(CASE datepart(month,AssignDate) WHEN 10 THEN 1 ELSE 0 END) AS 'October',SUM(CASE datepart(month,AssignDate) WHEN 11 THEN 1 ELSE 0 END) AS 'November',SUM(CASE datepart(month,AssignDate) WHEN 12 THEN 1 ELSE 0 END) AS 'December' FROM ClientAssign GROUP BY cStatus", function(err,result3) {

   // ... error checks
if(err){ 
    console.log(err);
     res.json({code:1,message:err});
  }else{  
     console.log(result);
	//res.json('{"cSTATUS_COUNT":'+JSON.stringify(result)+'",YEAR_COUNT":'+JSON.stringify(result1)+'",CURRENTDate_COUNT":'+JSON.stringify(result2)+'",EMP_TARGET_AMOUNT":'+JSON.stringify(result3)+'}');
	// res.json('"cSTATUS_COUNT":'+JSON.stringify(result)+'",CURRENTDATE_COUNT":'+JSON.stringify(result1)+'",EMP_TARGET_AMOUNT":'+JSON.stringify(result2)+'",YEAR_COUNT":'+JSON.stringify(result3)+'');
	 //res.json('{'"list1:"+JSON.stringify(result)+",list2:"+JSON.stringify(result1)+",list3:"+JSON.stringify(result2)+",list4:"+JSON.stringify(result3)+"}");
	res.json(
	{'cSTATUSCOUNT':JSON.stringify(result).replace(",", "\",\""),
"list2":JSON.stringify(result1),
"list3":JSON.stringify(result2),
"list4":JSON.stringify(result3)});
//res.json({'cSTATUS_COUNT':+JSON.stringify(result)+,"YEAR_COUNT":+JSON.stringify(result)+,"CURRENTDate_COUNT":+JSON.stringify(result)+,"EMP_TARGET_AMOUNT":+JSON.stringify(result)+);
	
  }
 
});
});
});
	})
})
	})

//test

app.get('/test1', function(req, res) {
	
	var ClientId= req.query.ClientId;
	var AssignDate= req.query.AssignDate;
	var UserId= req.query.UserId;
	var TargetMonth= req.query.TargetMonth;
	var EmpCode= req.query.EmpCode;

    var Connect = new sql.Connection(config1, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
var query1 = request.query("select count(*)as TotalCount,COUNT(CASE WHEN cStatus = 'Pending' then 1 ELSE 0 END) as Pending,COUNT(CASE WHEN cStatus = 'Working' then 1 ELSE 0 END) as Working,COUNT(CASE WHEN cStatus = 'Cancelled' then 1 ELSE 0 END) as Cancelled,COUNT(CASE WHEN cStatus = 'OnProcess' then 1 ELSE 0 END) as OnProcess,COUNT(CASE WHEN cStatus = 'Completed' then 1 ELSE 0 END) as Completed From MTS_ClientAssign  where  UserId='"+UserId+"'", function(err,result) {
var query2 = request.query("select count(*)as TotalCount,COUNT(CASE WHEN cStatus = 'Pending' then 1 ELSE 0 END) as Pending,COUNT(CASE WHEN cStatus = 'Working' then 1 ELSE 0 END) as Working,COUNT(CASE WHEN cStatus = 'Cancelled' then 1 ELSE 0 END) as Cancelled,COUNT(CASE WHEN cStatus = 'OnProcess' then 1 ELSE 0 END) as OnProcess,COUNT(CASE WHEN cStatus = 'Completed' then 1 ELSE 0 END) as Completed From MTS_ClientAssign WHERE  AssignDate ='"+AssignDate+"' AND UserId='"+UserId+"'", function(err,result1) {
var query3 = request.query("SELECT A.EmpCode,CAST(A.FirstName AS NVARCHAR) + ' ' + CAST(A.LastName AS NVARCHAR) AS 'EmpName',C.DeptName,D.DesgName,B.ClientId,COALESCE(E.TargetAmount,0) 'TargetAmount',COALESCE(SUM(B.Budget),0) 'Achieved',COALESCE(E.TargetAmount,0) - COALESCE(SUM(B.Budget),0) 'Pending',(COALESCE(SUM(B.Budget),0)*100)/nullif(COALESCE(E.TargetAmount,0),0) 'Percent'  FROM mstrEmployee As A LEFT JOIN MTS_ApprovedClient AS B ON A.EmpCode = B.EmpCode LEFT JOIN mstrDepartment AS C ON A.DeptCode =C.DeptCode LEFT JOIN mstrDesignation AS D ON A.DeptCode = D.DeptCode LEFT JOIN MTS_mstrEmployeeTarget AS E ON A.EmpCode=E.EmployeeName WHERE A.DesigCode = D.DesgCode AND D.DeptCode = C.DeptCode AND A.BranchCode=C.BranchCode AND C.BranchCode=D.BranchCode AND  A.EmpStatus = 'Y' AND C.DeptStatus = 'Y' AND C.DeptName IN ('Marketing Dept', 'Marketing')AND A.EmpCode = '"+EmpCode+"' AND E.TargetMonth = '"+TargetMonth+"' GROUP BY A.EmpCode,A.FirstName,A.LastName,C.DeptName,D.DesgName,B.ClientId,E.TargetAmount ORDER BY Achieved DESC", function(err,result2) {
var query4 = request.query("SELECT cStatus,SUM(CASE datepart(month,AssignDate) WHEN 1 THEN 1 ELSE 0 END ) AS 'January',SUM(CASE datepart(month,AssignDate) WHEN 2 THEN 1 ELSE 0 END) AS 'February',SUM(CASE datepart(month,AssignDate) WHEN 3 THEN 1 ELSE 0 END) AS 'March',SUM(CASE datepart(month,AssignDate) WHEN 4 THEN 1 ELSE 0 END) AS 'April',SUM(CASE datepart(month,AssignDate) WHEN 5 THEN 1 ELSE 0 END) AS 'May',SUM(CASE datepart(month,AssignDate) WHEN 6 THEN 1 ELSE 0 END) AS 'June',SUM(CASE datepart(month,AssignDate) WHEN 7 THEN 1 ELSE 0 END) AS 'July',SUM(CASE datepart(month,AssignDate) WHEN 8 THEN 1 ELSE 0 END) AS 'August',SUM(CASE datepart(month,AssignDate) WHEN 9 THEN 1 ELSE 0 END) AS 'September',SUM(CASE datepart(month,AssignDate) WHEN 10 THEN 1 ELSE 0 END) AS 'October',SUM(CASE datepart(month,AssignDate) WHEN 11 THEN 1 ELSE 0 END) AS 'November',SUM(CASE datepart(month,AssignDate) WHEN 12 THEN 1 ELSE 0 END) AS 'December' FROM MTS_ClientAssign GROUP BY cStatus", function(err,result3) {

var str =[('{"body":'+JSON.stringify(result)+','+'"body1":'+JSON.stringify(result1)+','+'"body2":'+JSON.stringify(result2)+','+'"body3":'+JSON.stringify(result3)+'}')];
  //var str = ('{"body":'+JSON.stringify(result)+',"body1":'+JSON.stringify(result1)+',"body2":'+JSON.stringify(result2)+',"body3":'+JSON.stringify(result3)+'}')
var obj  = JSON.parse(str);

res.json(obj)

               });
            });
        });
     });
   });
});	


//test

app.get('/test121', function(req, res) {
	
	var Type =req.query.Type;
	var StationId =req.query.StationId;
	var TalukId =req.query.TalukId;
	var DistrictId =req.query.DistrictId;
    var Flag =req.query.Flag;
	var UserId =req.query.UserId;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
var query1 = request.query("select DISTINCT UserId,Name,UserName,Role,Firebase_id from User_Registration  WHERE  Type='"+Type+"' And StationId='"+StationId+"' AND  TalukId='"+TalukId+"' AND DistrictId='"+DistrictId+"'", function(err,result) {
var query2 = request.query("SELECT UserId,COUNT(*) as COUNT From Alertment_table where  UserId='"+UserId+"' and ComplaintStatus='Pending' AND Flag='1' group by UserId", function(err,result1) {
var query3 = request.query("SELECT DISTINCT Category FROM Alertment_table where UserId='"+UserId+"' AND StationId='"+StationId+"' AND Type='"+Type+"' AND DistrictId='"+DistrictId+"' AND TalukId='"+TalukId+"' AND ComplaintStatus='Pending' AND Category IS NOT NULL", function(err,result2) {

var str =[('{"GetUser_Registration":'+JSON.stringify(result)+','+'"User_Assign_Count":'+JSON.stringify(result1)+','+'"Get_Category":'+JSON.stringify(result2)+'}')];

var obj  = JSON.parse(str);
res.json(obj)
         

      });
     })
    });
 });
});
 app.get('/test101', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	    
var myJson = {'key':'dfdf', 'key2':'dfdfd'};
for(var myKey in myJson) {
   console.log("key:"+myKey+", value:"+myJson[myKey]);
}
	});
 });
	 
//soap xml response:
	
app.get('/Display_Designation0', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select * from Designation_Master",function(err, recordsets, returnValue, results) {
   	
		 var o2x = require('object-to-xml');
    res.set('Content-Type', 'text/xml');
    res.send(o2x({
       '?xml version="1.0" encoding="utf-8"?' : null,
         Role: { Designation: recordsets}
        }));
})
	})
})

//test

app.get('/small', function(req, res) {
	
	var Type =req.query.Type;
	var StationId =req.query.StationId;
	var TalukId =req.query.TalukId;
	var DistrictId =req.query.DistrictId;
    var Flag =req.query.Flag;
	var UserId =req.query.UserId;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
var query1 = request.query("select DISTINCT UserId,Name,UserName,Role,Firebase_id from User_Registration  WHERE  Type='"+Type+"' And StationId='"+StationId+"' AND  TalukId='"+TalukId+"' AND DistrictId='"+DistrictId+"'", function(err,result) {
//var query2 = request.query("SELECT UserId,COUNT(*) as COUNT From Alertment_table where  Type='"+Type+"' And StationId='"+StationId+"' AND  TalukId='"+TalukId+"' AND DistrictId='"+DistrictId+"'", function(err,result1) {
/*var query3 = request.query("SELECT DISTINCT Category FROM Alertment_table where UserId='"+UserId+"' AND StationId='"+StationId+"' AND Type='"+Type+"' AND DistrictId='"+DistrictId+"' AND TalukId='"+TalukId+"' AND ComplaintStatus='Pending' AND Category IS NOT NULL", function(err,result2) {

var str =[('{"GetUser_Registration":'+JSON.stringify(result)+','+'"User_Assign_Count":'+JSON.stringify(result1)+','+'"Get_Category":'+JSON.stringify(result2)+'}')];*/

var jsonStr = {"Result" : {
  "GetUser_Registration" : '['+JSON.stringify(result)+']',
  "Result1" : {"GetUser_Registration" : '['+JSON.stringify(result)+']',
   "Result2" : {"GetUser_Registration" : '['+JSON.stringify(result)+']'
}}}}


//var parsed = JSON.parse(array);
var json=JSON.stringify(jsonStr);
var jsons=JSON.parse(json)
//var obj  = JSON.parse(array);
res.json(jsons)
         

      });
     })
    });
//});
//});

//test

app.get('/getfiles',function(req,res){
	
	 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
	var string1 = request.query("SELECT UserId,SerialNo,Send_to,DateTime from UserPhoto",function(err, result){
	var string2= request.query("SELECT Emergency_Id,UserPhoto from UserPhoto",function(err, result1){
	var string3= request.query("SELECT Location,Latitude,Longitude,StationId from UserPhoto",function(err, result2){

  //var json = '{"reports":[{"columnHeader":{"dimensions":["ga:landingPagePath"],"metricHeader":{"metricHeaderEntries":[{"name":"ga:pageviews","type":"INTEGER"},{"name":"ga:sessions","type":"INTEGER"}]}},"data":{"rows":[{"dimensions":["/-chandigarh/axis-bank-sarsini-branch_chandigarh_chg_850458.html"],"metrics":[{"values":["1","1"]}]},{"dimensions":["/267249-1.compliance-alex.xyz"],"metrics":[{"values":["29","10"]}]},{"dimensions":["/267249-1.compliance-don.xyz"],"metrics":[{"values":["27","9"]}]},{"dimensions":["/267249-1.compliance-fred.xyz"],"metrics":[{"values":["20","7"]}]},{"dimensions":["/abohar/axis-bank-the-fazilka-central-cooperative-bank-ltd-branch_abohar_frp_135.html"],"metrics":[{"values":["1","1"]}]},{"dimensions":["/about-us/career.htm"],"metrics":[{"values":["8","5"]}]},{"dimensions":["/about-us/company-profile.htm"],"metrics":[{"values":["34","14"]}]},{"dimensions":["/about-us/infrastructure.htm"],"metrics":[{"values":["3","1"]}]},{"dimensions":["/adilabad/gk-hospital-multispeciality-care_adilabad_adi_399806.html"],"metrics":[{"values":["2","1"]}]},{"dimensions":["/ahmedabad/akhani-jagdish-kumar_ahmedabad_ahd_1124498.html"],"metrics":[{"values":["7","3"]}]}],"totals":[{"values":["3420452","1333496"]}],"rowCount":347614,"minimums":[{"values":["0","1"]}],"maximums":[{"values":["56660","49274"]}],"isDataGolden":true},"nextPageToken":"1000"}]}'
  var jsonStr = {"reports":[{"columnHeader":{"filename":'['+JSON.stringify(result)+']',"metricHeader":{"UserId":'['+JSON.stringify(result1)+']'}},"data":{"rows":[{"picture":'['+JSON.stringify(result2)+']'}]}}]}

var json=JSON.stringify(jsonStr);
var jsons=JSON.parse(json)
//var obj  = JSON.parse(array);
res.json(jsons)
/*var string = connection.query("SELECT * from file",function(err, result){
var myObject = JSON.stringify(string);
console.log(myObject);
//res.parse(myObject);*/

    });
	});
	});
	});
});

	
app.get('/forloop', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

//request.query("select * from Designation_Master",function(err, recordsets, returnValue, results) {
  
var cars = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];
var text = "";
var i;
for (i = 0; i < cars.length; i++) {
    text += cars[i];
}
console.log(text);
res.json(text);
//});
	});
});

//test

app.get('/small123', function(req, res) {
	
	var Type =req.query.Type;
	var StationId =req.query.StationId;
	var TalukId =req.query.TalukId;
	var DistrictId =req.query.DistrictId;
    var Flag =req.query.Flag;
	var UserId =req.query.UserId;

    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);
	
var query1 = request.query("select DISTINCT UserId,Name,UserName,Role,Firebase_id from User_Registration  WHERE  Type='"+Type+"' And StationId='"+StationId+"' AND  TalukId='"+TalukId+"' AND DistrictId='"+DistrictId+"'", function(err,result) {
//var query2 = request.query("SELECT UserId,COUNT(*) as COUNT From Alertment_table where  Type='"+Type+"' And StationId='"+StationId+"' AND  TalukId='"+TalukId+"' AND DistrictId='"+DistrictId+"'", function(err,result1) {
/*var query3 = request.query("SELECT DISTINCT Category FROM Alertment_table where UserId='"+UserId+"' AND StationId='"+StationId+"' AND Type='"+Type+"' AND DistrictId='"+DistrictId+"' AND TalukId='"+TalukId+"' AND ComplaintStatus='Pending' AND Category IS NOT NULL", function(err,result2) {

var str =[('{"GetUser_Registration":'+JSON.stringify(result)+','+'"User_Assign_Count":'+JSON.stringify(result1)+','+'"Get_Category":'+JSON.stringify(result2)+'}')];*/

var jsonStr = {"Result" : {
  "GetUser_Registration" : '['+JSON.stringify(result)+']'
}}
});
});
});

// Display_Designation

app.get('/Display_Designation232', function(req, res) {
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);
    var request = new sql.Request(Connect);

request.query("select max(DesignationId)as ss from Designation_Master",function(err, recordsets, returnValue, results) {
   if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets[0].ss); 
  }
  
});
});
});	
//data_counselling

app.get('/Get_data_counselling1', function(req, res) {
  var courseId = req.query.courseId;
  var responses = [];
  var responses1 = [];
  var responses2 = [];
  var rep1=[];          

  var reps=[];
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
var obj =request.query("select * from data_counselling where courseId='"+courseId+"'",function myFunction(array,result){
	
for(i=0;i<result.length;i++){
	   var rep={};
	 rep.UniqueId=result[i].UniqueId
	  rep.courseId=result[i].courseId
	   rep.DepTitle=result[i].DepTitle
	    rep.Summary=result[i].Summary
		 rep.Path_One=result[i].Path_One
		  rep.Path_Two=result[i].Path_Two
		 
var obj=result[i].Career_Opportunities.split(";")
var obj1=result[i].Pros.split(";")
var obj2=result[i].Cons.split(";")
console.log(obj);
responses.push(obj)
responses1.push(obj1)
responses2.push(obj2)
rep.Career_Opportunities=obj
rep.Pros=obj1
rep.Cons=obj2
reps.push(rep)
}
  res.json({'Data Counselling':reps});
  });
  });
});

//CheckAptitude

app.get('/CheckAptitude', function(req, res) {

    var UserId = req.query.UserId;
	var Aptitude = req.query.Aptitude;
	var Status = req.query.Status;
	var ValidTime = req.query.ValidTime;
	var Flag = req.query.FlagName;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	console.log('sss',Status);
	
	if (Status=='Eligible'){
			if(Flag=='Aptitude'){
				request.query("SELECT CASE WHEN AptitudeTime  IS NULL THEN 'False' ELSE 'TRUE' END AptitudeTime  FROM CME_flag WHERE UserId ='"+UserId+"'", function(err,result){	
            if(err){
			throw err;
		}else if(Status=='Eligible'){
			if(result[0].AptitudeTime=='TRUE'){
			request.query("SELECT * FROM CME_flag WHERE  UserId ='"+UserId+"' AND AptitudeTime <= getdate()", function(err,result1){	
			if(result1.length > 0){
			request.query("update CME_flag set  Aptitude='1',AptitudeTime=(Getdate()+1) where UserId='"+UserId+"'",function(err,result){
					if(err){	
				res.json({"StatusCode" : 400,"Message":"Not Eligible"})
		    }else{
			res.json({"StatusCode" : 200,"Message":"Aptitude Eligible"});
			res.end();
		   }
				
     });
	}else{
	res.json({"StatusCode" : 400,"Message":"Not Eligible"})	
	}
	 })
    
}else{
request.query("update CME_flag set  Aptitude='1',AptitudeTime=(Getdate()+1) where UserId='"+UserId+"'",function(err,result){
		res.json({"StatusCode" : 200,"Message":"Aptitude Eligible"});
	res.end();
})	
	
}
}
});
		
	}
	else if(Flag=='Logical'){
						request.query("SELECT CASE WHEN LogicalTime  IS NULL THEN 'False' ELSE 'TRUE' END LogicalTime  FROM CME_flag WHERE UserId ='"+UserId+"'", function(err,result){	
            if(err){
			throw err;
		}else if(Status=='Eligible'){
			if(result[0].LogicalTime=='TRUE'){
			request.query("SELECT * FROM CME_flag WHERE  UserId ='"+UserId+"' AND LogicalTime <= getdate()", function(err,result1){	
			if(result1.length > 0){
			console.log('aaa',result1)
			request.query("update CME_flag set  Logical='1',LogicalTime=(Getdate()+1) where UserId='"+UserId+"'",function(err,result){
					if(err){
             console.log(err)						
				res.json({"StatusCode" : 400,"Message":"Not Eligible"})
		    }else{
			res.json({"StatusCode" : 200,"Message":"Logical Eligible"});
			res.end();
		   }
				
     });
	}else{
	res.json({"StatusCode" : 400,"Message":"Not Eligible"})	
	}
	 })
    
}else{
request.query("update CME_flag set  Logical='1',LogicalTime=(Getdate()+1) where UserId='"+UserId+"'",function(err,result){
		res.json({"StatusCode" : 200,"Message":"Eligible"});
	res.end();
})	
	
}
}
});
	}
	else if(Flag=='Verbal'){
								request.query("SELECT CASE WHEN VerbalTime  IS NULL THEN 'False' ELSE 'TRUE' END VerbalTime  FROM CME_flag WHERE UserId ='"+UserId+"'", function(err,result){	
            if(err){
			throw err;
		}else if(Status=='Eligible'){
			console.log('verble',result[0].VerbalTime)
			if(result[0].VerbalTime=='TRUE'){
			request.query("SELECT * FROM CME_flag WHERE  UserId ='"+UserId+"' AND VerbalTime <= getdate()", function(err,result1){	
			if(result1.length > 0){
				console.log('res',result1)
			request.query("update CME_flag set  Verbal='1',VerbalTime=(Getdate()+1) where UserId='"+UserId+"'",function(err,result){
					if(err){	
				res.json({"StatusCode" : 400,"Message":"Not Eligible"})
		    }else{
			res.json({"StatusCode" : 200,"Message":"verbal Eligible"});
			res.end();
		   }
				
     });
	}else{
	res.json({"StatusCode" : 400,"Message":"Not Eligible"})	
	}
	 })
    
}else{
request.query("update CME_flag set  Verbal='1',VerbalTime=(Getdate()+1) where UserId='"+UserId+"'",function(err,result){
		res.json({"StatusCode" : 200,"Message":"Eligible"});
	res.end();
})	
	
}
}
});
	}
		
	}
	else if(Status=='Flag'){
			if(Flag=='Aptitude'){
	request.query("update CME_flag set Aptitude='0' where UserId='"+UserId+"'",function(err,result){
		
 	res.json({"StatusCode" : 200,"Message":"Aptitude Updated"});
	res.end();
	})
	
}else if(Flag=='Verbal'){
	request.query("update CME_flag set Verbal='0' where UserId='"+UserId+"'",function(err,result){
		res.json({"StatusCode" : 200,"Message":"Verbal Updated"});
		res.end();
	})
}else{
	request.query("update CME_flag set Logical='0' where UserId='"+UserId+"'",function(err,result){
	res.json({"StatusCode" : 200,"Message":"Logical Updated"});
res.end();	
	})
}
	}


});
});
//
/*
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'esmartpass@gmail.com',
	  pass: 'smartpass'
	}
  });*/
  /* var transporter = nodemailer.createTransport({
	
  service: 'gmail',
  host:'www.prematix.com',
  auth: {
    user: 'jobs@prematix.com',
    pass: 'jobs123456'
  }
  
}); 
app.post("/prematix_resume_mail",function(req,res){
		
	console.log(req.files);
	if(req.files != null ){
		var file = req.files.uploaded_image;
		var imglocation="http://paypre.info/resumeimages/"+file.name;
		file.mv('resumeimages/'+file.name,function(err,data){
	var fromemail=req.query.fromemail;
	var Name =req.query.Name;
	var contact =req.query.contact;

	var mailOptions = {
	  from: 'jobs@prematix.com',
	  to: 'jobs@prematix.com',
	  subject:Name,
	  text:'Name: '+Name+'\nEmail: '+fromemail+'\ncontact :'+contact,
	 attachments: [{'filename': imglocation }]
	};

	transporter.sendMail(mailOptions, function(error, info){
					if (error) {
					  res.json(error);
					} else {
						console.log(info.response);
					  res.json({"StatusCode":200,"Message":info.response});
					  res.end();
					}
				  });
				
			})
	
	}else{
		console.log("End");
		res.json("End");
	}
}); */
//
//resumeupload
app.post("/resumeupload",function(req,res){ 
	
	console.log(req.files);
	if(req.files != null ){
		var file = req.files.uploaded_image;
		// var imglocation="http://paypre.info/resumeimages/"+file.name;
		// file.mv('resumeimages/'+file.name,function(err,data){
		// 	if(err){
		// 		throw err;
		// 	}else{
		// 		var mailOptions = {
		// 		from: 'jobs@prematix.com',
		// 		to: 'jobs@prematix.com',
		// 		subject: 'E-SMART PASS',
		// 		text: "Hello",
		// 		attachments: [{'filename': imglocation }]
				 
		// 		  };
		// 		  transporter.sendMail(mailOptions, function(error, info){
		// 			if (error) {
		// 			  res.json(error);
		// 			} else {
		// 				console.log(info.response);
		// 			  res.json({"StatusCode":200,"Message":info.response});
		// 			  res.end();
		// 			}
		// 		  });
				
		// 	}
		
		// });
    // New code
    let buffers = [];
    pdf.on('data', buffers.push.bind(buffers));
    const fileName = "PDF.pdf";
    pdf.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        let mailOptions = {
            from: 'jobs@prematix.com',
			to: 'jobs@prematix.com',
			subject: 'E-SMART PASS',
			text: "Hello",
            attachments: [{
                filename: fileName,
                content: pdfData,
                contentType: 'application/pdf'
            }]
        };
        EmailService(mailOptions, req, res);
    });
        pdf.pipe(res);
        pdf.end();
	}else{
		console.log("End");
		res.json("End");
	}
	
});
//
/* Date_diff*/

app.get('/Date_diff11', function(req, res) {
	
	var UserId = req.query.UserId;
	var LogicalTime = req.query.LogicalTime;
	var VerbalTime = req.query.VerbalTime;
	var AptitudeTime = req.query.AptitudeTime;
	var Status = req.query.Status;
	var Flag = req.query.FlagName;
	

	var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect); 
		
	if(Flag=='Aptitude'){
	request.query("SELECT CAST(DATEDIFF(d, AptitudeTime,GETDATE()) AS VARCHAR) +  ' Days :' +CAST(DATEDIFF(hh, AptitudeTime,GETDATE()) AS VARCHAR) + ' Hours :' +CAST(DATEDIFF(mi, AptitudeTime,GETDATE()) AS VARCHAR) + ' Min :' +CAST(DATEDIFF(ss, AptitudeTime,GETDATE()) AS VARCHAR) + ' Seconds'  as 'Date Difference'  from CME_flag where  UserId='"+UserId+"'",function(err,result1){
	console.log(result1)	
 	res.json({"StatusCode" : 200,"Message":result1});
	res.end();
	})
	
}else if(Flag=='Verbal'){
	request.query("SELECT CAST(DATEDIFF(d,  VerbalTime,GETDATE()) AS VARCHAR) +  ' Days :' +CAST(DATEDIFF(hh,  VerbalTime, GETDATE()) AS VARCHAR) + ' Hours :' +CAST(DATEDIFF(mi,  VerbalTime, GETDATE()) AS VARCHAR) + ' Min :' +CAST(DATEDIFF(ss,  VerbalTime, GETDATE()) AS VARCHAR) + ' Seconds '  as 'Date Difference'  from CME_flag where  UserId='"+UserId+"'",function(err,result2){
		res.json({"StatusCode" : 200,"Message":result2});
		res.end();
	})
}else{
	request.query("SELECT CAST(DATEDIFF(d,  LogicalTime, GETDATE()) AS VARCHAR) +  ' Days :' +CAST(DATEDIFF(hh,  LogicalTime, GETDATE()) AS VARCHAR) + ' Hours :' +CAST(DATEDIFF(mi,  LogicalTime, GETDATE()) AS VARCHAR) + ' Min :' +CAST(DATEDIFF(ss,  LogicalTime, GETDATE()) AS VARCHAR) + ' Seconds'  as 'Date Difference'  from CME_flag where  UserId='"+UserId+"'",function(err,result){
	res.json({"StatusCode" : 200,"Message":result});
res.end();	
	})
}
	

	})
});


//
//Update_CME2_Mark
	app.post('/Update_CME2_Mark_img',function(req, res) {
        
		var QuestionNo = req.query.QuestionNo;
		var UserId = req.query.UserId;
		var QuestionId = req.query.QuestionId;
		var CorrectAns  = req.query.CorrectAns;
		var Result  = req.query.Result;
        var UserName  = req.query.UserName;
		var GameCount  = req.query.GameCount;
		var Mark  = req.query.Mark;
		var Options  = req.query.CorrectAns;
		//var Attend=10;
		
		var Connect = new sql.Connection(config, function (err) {    
			if (err) console.log(err);	
			var request = new sql.Request(Connect);
			if(QuestionId=='A1'){
				request.query("select Marks from  A1 WHERE QuestionNo='"+QuestionNo+"' AND QuestionId='"+QuestionId+"' AND CorrectAns='"+CorrectAns+"' ", function(err,result) {
					if(err){ 
						console.log(err);
						res.json({'code':1,'message':err});
					}else if(result.length>0){
						var Mark=result[0].Marks;
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','"+Mark+"') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({'message':'success',"result":result});
										
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});
						
					}else{
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','0') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({"result":result});
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});	
					}
				});
				
			}else if(QuestionId=='V1'){
				request.query("select Marks from  V1 WHERE QuestionNo='"+QuestionNo+"' AND QuestionId='"+QuestionId+"' AND CorrectAns='"+CorrectAns+"' ", function(err,result) {
					if(err){ 
						console.log(err);
						res.json({'code':1,'message':err});
					}else if(result.length>0){
						var Mark=result[0].Marks;
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','"+Mark+"') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({'message':'success',"result":result});
										
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});
						
					}else{
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','0') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({"result":result});
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});	
					}
				});
				
			}else if(QuestionId=='L1'){
				request.query("select Marks from  L1 WHERE QuestionNo='"+QuestionNo+"' AND QuestionId='"+QuestionId+"' AND CorrectAns='"+CorrectAns+"' ", function(err,result) {
					if(err){ 
						console.log(err);
						res.json({'code':1,'message':err});
					}else if(result.length>0){
						var Mark=result[0].Marks;
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','"+Mark+"') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({'message':'success',"result":result});
										
									}
								});
							}else{
								res.json({"message":Response});
							}
						});
						
					}else{
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','0') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({"result":result});
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});	
					}
				});
				
			}
			
			
			
		});

	});
	
//Update_GameCount

app.get('/Update_GameCount',function(req, res) {
	
	var UserId = req.query.UserId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("SELECT * FROM CME2_table WHERE  UserId='"+UserId+"'",function(err,result){
		if(err){
			throw err;
		}else if(result.length>0){
			
			 request.query("UPDATE CME2_table SET GameCount = GameCount + 1 WHERE UserId = '"+UserId+"'",function(err,result){
				
				if(err){
					throw err;
				}else{
					res.json({"StatusCode" : 200,"Message":"Updated Succesfully","Response":result});
					res.end();
				}			
			});
		}else{
			
			res.json({"StatusCode" : 400,"Message":"Updated Failed"});
			res.end();
		}
	});

});
});
/*
app.post("/Insert_CME_profile",function(req,res){

    var Name = req.query.Name;
	var MobileNo = req.query.MobileNo;
	var Password = req.query.Password;
	var EmailId = req.query.EmailId;
	var Flag = req.query.Flag;
	
	 var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
    if(req.files != null ){
		
    var file = req.files.profile_image;
    var profile='http://paypre.info/imagess/'+Name+'.png';
  
        file.mv('./imagess/'+Name+'.png',function(err) {
            if(err){
                throw err;  
            }else{
              
				 request.query("SELECT * FROM CME_profile WHERE  MobileNo='"+MobileNo+"'",function(err,result){
					if(err){
						throw err;
					}else if(result.length === 0){
			request.query("insert into CME_profile(Name,MobileNo,Password,EmailId,Flag,UserPhoto)values('"+Name+"','"+MobileNo+"','"+Password+"','"+EmailId+"','"+Flag+"','"+name+"')",function(err){
					if(err){
						throw err;
					}
					else if(!result){
						
						res.json({"StatusCode" : 400,"Message":"Profile Image  Updated Failed"});
						res.end();
					}else{
						res.json({"StatusCode" : 200,"Message":"Profile Image Updated Succesfully","Response":result});
						res.end();
					}
					
				});	
            }
        });
    }else{
        res.end("Please upload image");
    }
});
});*/	
	//

//CME_profile

app.post('/Insert_CME_profile',multipart(), function(req, res) {
	
	fs.readFile(req.files.UserPhoto.path, function (err, data) {
	var UserPhoto = req.files.UserPhoto.name;
    var name ="http://paypre.info/Examimges/"+UserPhoto;
	var UserId = req.query.UserId;
	var Name = req.query.Name;
	var MobileNo = req.query.MobileNo;
	var Password = req.query.Password;
	var EmailId = req.query.EmailId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
	request.input('Name', Name);
	request.input('MobileNo', MobileNo);
	request.input('Password', Password);
	request.input('EmailId', EmailId);
    request.input('UserPhoto', name);
    request.output("SQLReturn");
	
	request.query("SELECT * FROM CME_profile WHERE  MobileNo='"+MobileNo+"'",function(err,result){
		if(err){
			throw err;
		}else if(result.length === 0){
request.execute('sp_CME2_SignUp',function(err, recordsets, returnValue, results){
    // ... error checks
      if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{   
		if(!UserPhoto){
			  console.log("0")
			  res.redirect('/Examimges/' + req.files.UserPhoto.name);
			  res.redirect("/Examimges/");
			  res.end();
			} else {
			  var newPath = __dirname + "/Examimges/" + UserPhoto;
			  // write file to uploads/fullsize folder
			  fs.writeFile(newPath, data, function (err) {
				// let's see it
				res.end('Success');
				
			  });
			}
			 console.log(request.parameters.SQLReturn.value);
          res.json({code:1,message:request.parameters.SQLReturn.value}); 
         }
		 
        });
		}else{
			
			res.json({"StatusCode" : 400,"Message":"MobileNo Already Exist!!!"});
			res.end();
		}
	 });
	});
  });	
});
	
	//	CME2_Users
app.get('/CME2_Rank', function(req, res) {
		var UserId = req.query.UserId;
		var QuestionId = req.query.QuestionId;
		
		var Connect = new sql.Connection(config, function (err) {    
			if (err) console.log(err);	
			var request = new sql.Request(Connect);
			
request.query("SELECT * FROM CME2_table WHERE  UserId='"+UserId+"'",function(err,result){
		if(err){
			throw err;
		}else if(result.length>0){
			request.query("SELECT UserId,UserName,UserPhoto,SUM(GameCount)as'GameCount',SUM(Result) as Coins,Rank()Over(Order By SUM(Result)desc)as'Rank' FROM CME2_table where UserId NOT IN('0000') GROUP BY UserId ,UserName,UserPhoto", function(err,Response) {
				if(err){
					throw err;
				}else if(Response){
					//res.json({'Response':Response});
					
					for(var i=0;i<Response.length;i++){
						if(Response[i].UserId==UserId){
							res.json({"Rank":Response[i],"StatusCode" : 200});
						}
					}
					
				}
			})
			
			}else{
			
			res.json({"Rank":result,"StatusCode" : 400,"Message":"UserId Not Found"});
			res.end();
				
		 }
          })
  })	
})
	
//	CME2_Users
app.get('/CME2_Rank_Users', function(req, res) {
		var UserId = req.query.UserId;
		var QuestionId = req.query.QuestionId;
		
		var Connect = new sql.Connection(config, function (err) {    
			if (err) console.log(err);	
			var request = new sql.Request(Connect);

			request.query("SELECT UserId,UserName,UserPhoto,SUM(GameCount)as'GameCount',SUM(Result) as Coins,Rank()Over(Order By SUM(Result)desc)as'Rank' FROM CME2_table where UserId NOT IN('0000') GROUP BY UserId ,UserName,UserPhoto", function(err,Response) {
				if(err){
					throw err;
				}else{
					res.json({'Response':Response});
				
					
				}
			})
			
  })	
})
				

//
//Update_GameCount

app.get('/Update_GameCount',function(req, res) {
	
	var UserId = req.query.UserId;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("SELECT * FROM CME2_table WHERE  UserId='"+UserId+"'",function(err,result){
		if(err){
			throw err;
		}else if(result.length>0){
			
			 request.query("UPDATE CME2_table SET GameCount = GameCount + 1 WHERE UserId = '"+UserId+"'",function(err,result){
				
				if(err){
					throw err;
				}else{
					res.json({"StatusCode" : 200,"Message":"Success","Response":result});
					res.end();
				}			
			});
		}else{
			
			res.json({"StatusCode" : 400,"Message":"UserId Not Found"});
			res.end();
		}
	});

});
});
//
//Update_CME_Profile

app.get('/Update_CME_Profile',function(req, res) {
	
	var UserId = req.query.UserId;
	var Name = req.query.Name;
	var MobileNo = req.query.MobileNo;
	var Password = req.query.Password;
	var EmailId = req.query.EmailId;
	
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	
request.query("SELECT * FROM CME_profile WHERE  UserId='"+UserId+"'",function(err,result){
		if(err){
			throw err;
		}else if(result.length>0){
			
			 request.query("UPDATE CME_profile SET Name = '"+Name+"',MobileNo = '"+MobileNo+"',Password = '"+Password+"',EmailId = '"+EmailId+"' WHERE UserId = '"+UserId+"'",function(err,result){
				
				if(err){
					throw err;
				}else{
					res.json({"StatusCode" : 200,"Message":"Success","Response":result});
					res.end();
				}			
			});
		}else{
			
			res.json({"StatusCode" : 400,"Message":"UserId Not Found"});
			res.end();
		}
	});

});
});

//Update_profile_Img

app.post('/Update_profile_Img',multipart(), function(req, res) {
	
	fs.readFile(req.files.UserPhoto.path, function (err, data) {
	var UserPhoto = req.files.UserPhoto.name;
    var name ="http://paypre.info/Examimges/"+UserPhoto;
	var UserId = req.query.UserId;
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	

request.query("Update CME_profile set UserPhoto='"+name+"' where UserId='"+UserId+"'",function(err,response){
    // ... error checks
     
		if(!UserPhoto){
			  console.log("0")
			  res.redirect('/Examimges/' + req.files.UserPhoto.name);
			  res.redirect("/Examimges/");
			  res.end();
			} else {
			  var newPath = __dirname + "/Examimges/" + UserPhoto;
			  // write file to uploads/fullsize folder
			  fs.writeFile(newPath, data, function (err) {
				// let's see it
				//res.json({'Message':"Success"})
				res.end(name);
			  });
			}  
})
});
});
});
//
//Update_CME2_Mark
	app.post('/Update_CME2_Mark_img1',function(req, res) {
        
		var QuestionNo = req.query.QuestionNo;
		var UserId = req.query.UserId;
		var QuestionId = req.query.QuestionId;
		var CorrectAns  = req.query.CorrectAns;
		var Result  = req.query.Result;
        var UserName  = req.query.UserName;
		var GameCount  = req.query.GameCount;
		var Mark  = req.query.Mark;
		var Options  = req.query.CorrectAns;
		//var Attend=req.query.Attend;
		
		var Connect = new sql.Connection(config, function (err) {    
			if (err) console.log(err);	
			var request = new sql.Request(Connect);
			if(QuestionId=='A1'){
				request.query("select Marks from  A1 WHERE QuestionNo='"+QuestionNo+"' AND QuestionId='"+QuestionId+"' AND CorrectAns='"+CorrectAns+"' ", function(err,result) {
					if(err){ 
						console.log(err);
						res.json({'code':1,'message':err});
					}else if(result.length>0){
						var Mark=result[0].Marks;
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result,Attend)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','"+Mark+"','"+Mark+"') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({'message':'success',"result":result});
										
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});
						
					}else{
						request.query("select Marks from  A1 WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='A1'", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length>0){
								var Mark=Response[0].Marks;
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result,Attend)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','0','"+Mark+"')" , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({"result":result});
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});	
					}
				});
				
			}else if(QuestionId=='V1'){
				request.query("select Marks from  V1 WHERE QuestionNo='"+QuestionNo+"' AND QuestionId='"+QuestionId+"' AND CorrectAns='"+CorrectAns+"' ", function(err,result) {
					if(err){ 
						console.log(err);
						res.json({'code':1,'message':err});
					}else if(result.length>0){
						var Mark=result[0].Marks;
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result,Attend)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','"+Mark+"','"+Mark+"') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({'message':'success',"result":result});
										
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});
						
					}else{
						request.query("select Marks from  V1 WHERE QuestionNo='"+QuestionNo+"' AND QuestionId='V1'", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length>0){
								var Mark=Response[0].Marks;
								console.log(Mark);
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result,Attend)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','0','"+Mark+"')" , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({"result":result});
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});	
					}
				});
				
			}else if(QuestionId=='L1'){
				request.query("select Marks from  L1 WHERE QuestionNo='"+QuestionNo+"' AND QuestionId='"+QuestionId+"' AND CorrectAns='"+CorrectAns+"' ", function(err,result) {
					if(err){ 
						console.log(err);
						res.json({'code':1,'message':err});
					}else if(result.length>0){
						var Mark=result[0].Marks;
						request.query("select * from  CME2_table WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='"+QuestionId+"'  AND UserId='"+UserId+"' ", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length==0){
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result,Attend)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','"+Mark+"','"+Mark+"') " , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({'message':'success',"result":result});
										
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});
						
					}else{
						request.query("select Marks from  L1 WHERE QuestionNo='"+QuestionNo+"'  AND QuestionId='L1'", function(err,Response) {
							if(err){
								throw err;
							}else if(Response.length>0){
								var Mark=Response[0].Marks;
								request.query("insert into CME2_table (UserName,GameCount,QuestionNo,UserId,QuestionId,Options,Result,Attend)values('"+UserName+"','0','"+QuestionNo+"','"+UserId+"','"+QuestionId+"','"+CorrectAns+"','0','"+Mark+"')" , function(err,result){
									if(err){
										throw err;
									}else{
										res.json({"result":result});
									}
								});
							}else{
								res.json({"message":"already attend"});
							}
						});	
					}
				});
				
				
			}
			
	
		});

	});
//
app.post("/prematix_resume_mail",function(req,res){
		  
	var fromemail=req.query.fromemail;
	var Name =req.query.Name;
	var Qualification =req.query.Qualification;
	var specialization =req.query.specialization;
	var experience =req.query.experience;
	var skills =req.query.skills;
	var contact =req.query.contact;
	 
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  host:'www.prematix.com',
	  auth: {
		user: 'jobs@prematix.com',
		pass: 'jobs123456'
	  }
	  
	}); 

	var mailOptions = {
	  from:req.query.fromemail,
	  to: 'jobs@prematix.com',
	  subject:Name,
	  text:'Name: '+Name+'\nEmail: '+fromemail+'\nQualification :'+Qualification+'\nspecialization :'+specialization+'\nexperience :'+experience+'\nskills :'+skills+'\ncontact :'+contact,
	 
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  res.json(error);
		} else {
			 
		 
		var mailOptions = { 
		  from:'jobs@prematix.com',
		  to: fromemail, 
		  text: 'Your details has been received  and if the Management feels, you are a Worthy Candidate, We will connect you soon.' 
		};
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			}else {
				
				res.json({"StatusCode":200,"Message":info.response});
		 
				res.end();
			}
		  });
		  
		}
	  });
			 
	
	 
});
	//
	
//	CME2_Users
app.get('/CME2_Rank_Users', function(req, res) {
		var UserId = req.query.UserId;
		var QuestionId = req.query.QuestionId;
		
		var Connect = new sql.Connection(config, function (err) {    
			if (err) console.log(err);	
			var request = new sql.Request(Connect);

			request.query("SELECT UserId,UserName,UserPhoto,SUM(GameCount)as'GameCount',SUM(Result) as Coins,Rank()Over(Order By SUM(Result)desc)as'Rank' FROM CME2_table where UserId NOT IN('0000') GROUP BY UserId ,UserName,UserPhoto", function(err,Response) {
				if(err){
					throw err;
				}else{
					res.json({'Response':Response});
	
				}
			})
			
  })	
})
	// Reply mailOptions
	
	function replymail(senderid,senderpsw,recivermailid,msg){
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  host:'www.prematix.com',
		  auth: {
			user: senderid,
			pass: senderpsw
		  }
		  
		}); 
		var mailOptions = { 
		  to: mailid, 
		  text: msg 
		};
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			}else {
				
				console.log(info.response);
			}
		  });
	}

//
//Graduate_Medical//

app.get('/stream', function(req, res) {

    var str=req.query.str;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	
request.query("SELECT * FROM Graduate_Medical WHERE Courses LIKE '"+str+"%'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
});
});
//
//Graduate_Medical//

app.get('/stream1', function(req, res) {

    var str=req.query.str;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	if(str !==  null  && str !==  undefined && str !== '' ){
	request.query("SELECT university FROM CME_colleges_mstr WHERE university LIKE '"+str+"%'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
	}else{
	res.json('failed no record')	
	}

});
});
//
//CME_College_List//

app.get('/CME_College_List', function(req, res) {

    var college=req.query.college;
	var category=req.query.engineeringid;
	var category=req.query.artsid;
	var category=req.query.medicalid;
	
    var Connect = new sql.Connection(config, function (err) {    
        if (err) console.log(err);		
    var request = new sql.Request(Connect);
	if(college !==  null  && college !==  undefined && college !== ''&& category!==  null && category !==  undefined && category !== ''){
	if(category=='1'){
	request.query("SELECT engineering as 'college' FROM CME_colleges_mstr WHERE engineeringid='"+category+"' and engineering  LIKE '"+college+"%'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
   }
  });
}else if(category=='2'){
		request.query("SELECT arts_science as 'college' FROM CME_colleges_mstr WHERE artsid='"+category+"' and arts_science  LIKE '"+college+"%'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
     }
  });	
}else{	
	request.query("SELECT medical as 'college' FROM CME_colleges_mstr WHERE medicalid='"+category+"' and medical LIKE '"+college+"%'", function(err, recordsets, returnValue, results) {
    // ... error checks
    if(err){ 
    console.log(err);
    res.json({code:1,message:err});
  }else{        
        console.log(recordsets);
        res.json(recordsets);   
  }
});
	}
	}else{
		res.json('Record Not Found')
	}
});
});

let printarr=[];
app.get('/TFS_Taskdetails' ,(req,res) => {
    printarr=[];
	let Assignval=req.query.Assigned || '';
	let TeamId=req.query.TeamId || '';
 var Connect = new sql.Connection(config2, function (err) {    
        if (err) console.log(err);	
    var request = new sql.Request(Connect);
	let temp= "select DISTINCT ProjectName,B.ProjectId from TFS_mstrProject AS A LEFT JOIN TFS_mstrTaskCreation AS B ON A.ProjectId=B.ProjectId WHERE A.BranchCode='HSR-01' "+assignedchk(Assignval,TeamId)+" ";
    request.query(temp,(err,result) =>{
        if(err) throw err;
		//res.json(result)
		if(result.length > 0){
			for(let [index,item] of result.entries()){
				sprintfetch(res,index,item,result.length,request,Assignval,TeamId)
			} 
		}else{
			
			res.json({StatusCode:400,Message:'No Record Found'});
		}
       
		
		});
    });
}); 
function sprintfetch(res,index,item,reslength,request,Assignval,TeamId){ 
let temp= 'SELECT DISTINCT Sprint FROM TFS_mstrTaskCreation WHERE ProjectId='+item.ProjectId+' '+assignedchk(Assignval,TeamId)+' ';
	//console.log('-------> 7207 -> ' + temp)
    request.query(temp,(err,result) =>{
        if(err) throw err;
        let temparr=[];
        //console.log('------------- 85 -> '+index,item.ProjectId)
		
        for(let [i,snditem] of result.entries()){
            taskfetch(res,index,item,reslength,i,snditem,result.length,temparr,request,Assignval,TeamId);
        }
	}); 
}

function taskfetch(res,index,item,reslength,i,snditem,sndreslength,temparr,request,Assignval,TeamId){
    let obj={};
    
    let tempobj={}; 
	let temp='SELECT TaskName FROM TFS_mstrTaskCreation WHERE ProjectId='+item.ProjectId+' AND Sprint='+snditem.Sprint+' '+assignedchk(Assignval,TeamId)+'';
	console.log('-------> 7224 -> ' +temp)
	request.query(temp ,(err,result) => {
        if(err) throw err;
        console.log(i ,sndreslength-1,index , reslength-1  )
        obj.ProjectName=item.ProjectName;
        obj.ProjectId=item.ProjectId;
        tempobj.SprintName='Sprint '+snditem.Sprint;
        tempobj.TaskDetails=result;
        temparr.push(tempobj);
        {i === 0  ? printarr.push({ProjectName:item.ProjectName,ProjectId:item.ProjectId,SprintDetails:temparr}) : null }
        if( (i === sndreslength-1) && (index === reslength-1) ){
            res.json({StatusCode:200,Message:'Project Details',Response:printarr});
        }else{
            
        }
    });
}

let assignedchk=function(numgot,TeamId){
	let temp=''; 
	if(numgot == '' || numgot == undefined || numgot == null  ) {
		temp ='';
	}else if(numgot === '0'){
		temp +=` AND AssignedTo IN ('0',NUll)`;
	}else if(numgot === '1'){
		temp +=` AND AssignedTo NOT IN ('0')`;
	}else{
		temp ='';
	}
	if(TeamId !=='' && TeamId !=undefined && TeamId !=null){
		temp +=` AND TeamId =${TeamId} `;
	}
	return temp;
	 
}
//
var fs = require('fs');  
var jsonfile = require('jsonfile');
app.post("/productinsert",function(req,res){
    var productscreenshots=[];
    var exceldataobj = []; 
    var screenlocation;
    var browcherlocation;
    var location;
    var productscreen=[];
    let productmainimagelocation;
    try{
        //Model No for check before insert
        var modelno=req.query.modelno; 
        if(req.files.screenshots.length == undefined){
            productscreen.push(req.files.screenshots);
        }else{
            productscreen=req.files.screenshots;
        } 
        let productmainimage=req.files.productmainimage;
        var browcher=req.files.browcher;
        var tempsec=new Date().getTime() / 1000; 
        browcherlocation='./images/browcher/'+browcher.name.split('.')[0]+tempsec+"."+browcher.name.split('.')[1]; 
        productmainimagelocation='./images/productmainimage/'+productmainimage.name.split('.')[0]+tempsec+'.png';
        var jsonfiledata=req.files.jsonfilesend;
        location='./images/productjson/'+tempsec+'.json';
        if(jsonfiledata.name.split('.')[1] === 'json' && modelno !=='' && modelno !==null && modelno !==undefined  ){
            jsonfiledata.mv(location,function(err){
                if(err) throw err;
                jsonfile.readFile(location, function(err, obj) {
                    productmainimage.mv(productmainimagelocation,function(err){
                        if(err) throw err;                        
                        browcher.mv(browcherlocation,function(err){
                            if(err) throw err;
                            for(var i=0;i<productscreen.length;i++){
                                screenlocation='./images/productscreenshot/'+productscreen[i].name.split('.')[0]+tempsec+'.png';
                                productscreen[i].mv(screenlocation,function(err){
                                    if(err) throw err;
                                });
                                productscreenshots.push(screenlocation);
                                if(i === productscreen.length - 1 ){
                                    obj.Screenshot=productscreenshots;
                                    obj.Browcher=browcherlocation;
                                    obj.productmainscreen=productmainimagelocation;
                                    obj.modelno=modelno;
                                    var findobj={"modelno":modelno,"Status":'Y'}
                                    dbo.collection('products').findOne(findobj,function(err,result){
                                        if(err) throw err;
                                        if(result !=null ){
                                            res.json({StatusCode:400,Message:"Same product already exist!!!"});  
                                        }else{
                                            dbo.collection('products').insertOne(obj,function(err,data){
                                                if(err) throw err;
                                                res.json({StatusCode:200,Message:"Product Inserted Successfully",Response:data});
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    });
                    
                })
            });
        }else{
            throw "Please select correct json file. ";
        } 
    }catch(e){
        res.json({StatusCode:400,Message:"One or more parameter(s) is missing or select right files.",Error_description:e.message});  
    }
});
//	
app.listen(2020);
console.log('Server running at port 2020');

