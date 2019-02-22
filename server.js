const express = require('express');
const bodyParser = require('body-parser');
var dbConfig = require('./config/config.js');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
var http = require('http');
var url = require('url');
var fileUpload = require('express-fileupload');
var multipart = require('connect-multiparty');
var path = require('path');
mongoose.Promise = global.Promise;
var csv = require('fast-csv');
// create express app
const app = express();
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
// MongoDB Connection
var dbo;
var dbout;
MongoClient.connect(dbConfig.url, function (err, db) {
    if (err) throw err;
    dbo = db.db("Prematixwebcontent");
    dbout = db;
});

/* 
-----------------------------------------------------------------------------------------------------------
Admin Login
-----------------------------------------------------------------------------------------------------------
*/
app.post('/prematixlogin', function (req, res) {
    var Username = req.query.Username;
    var Password = req.query.Password;
    var obj = { $or: [{ "UserId": Username }, { "Username": Username }], $and: [{ "Passsword": Password }] };

    // var odj={$and:[{Username:Username,Passsword:Password}]};

    dbo.collection('login').find(obj).toArray(function (err, result) {
        if (err) {
            throw err;
        } else if (result !== null && result != '') {
            res.json({ StatusCode: 200, Message: "Login Success", Response: result });
        } else {
            res.json({ StatusCode: 400, Message: "Login Failed" });
        }
    });
});
/* 
-----------------------------------------------------------------------------------------------------------
Home Image Upload
-----------------------------------------------------------------------------------------------------------
*/
app.post('/homeimagechange', function (req, res) {
    if (req.files !== (null && undefined && '')) {
        try {
            var imagefile = req.files.homeimage;
            var filepath = "./images/home/" + imagefile.name;
            imagefile.mv(filepath, function (err) {
                if (err) {
                    throw err;
                } else {
                    var oldvalue = { Status: "Y" };
                    var newvalue = { $set: { Status: "N" } };
                    dbo.collection('home').updateMany(oldvalue, newvalue, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            var obj = { Path: filepath, Status: "Y" };
                            dbo.collection('home').insertOne(obj, function (err) {
                                if (err) {
                                    throw err;
                                } else {
                                    res.json({ StatusCode: 200, Message: "Insert Success" });
                                }
                            });
                        }
                    });
                }
            });
        } catch (e) {
            res.json({ StatusCode: 400, Message: e.message })
        }
    } else {
        res.json({ StatusCode: 400, Message: "Please Send file first!!!" });
    }
});
/* 
-----------------------------------------------------------------------------------------------------------
Home Image Get
-----------------------------------------------------------------------------------------------------------
*/
app.get("/homeimageget", function (req, res) {
    var keyword = { Status: 'Y' };
    dbo.collection('home').findOne(keyword, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.json({ StatusCode: 200, Message: "Home Image Data.", Response: result });
        }
    });
});
/* 
-----------------------------------------------------------------------------------------------------------
Services get
-----------------------------------------------------------------------------------------------------------
*/
app.get('/servicesget', function (req, res) {
    dbo.collection('services').find({}).limit(6).toArray(function (err, result) {
        if (err) { throw err } else {
            res.json({ StatusCode: 200, Message: "Service Content", Response: result });
        }
    });
});
/* 
-----------------------------------------------------------------------------------------------------------
Services Update
-----------------------------------------------------------------------------------------------------------
*/
app.post("/servicesupdate", function (req, res) {
    var Title = req.query.title;
    var Description = req.query.description;
    var Oldtitle = req.query.oldtitle;
    if (req.files != null) {
        var image = req.files.iconfile;
        var filepath = "./images/services/" + image.name;
        image.mv(filepath, function (err) {
            if (err) { throw err } else {
                var obj = { title: Oldtitle };
                var newobj = { $set: { path: filepath, title: Title, description: Description } };
                dbo.collection('services').updateOne(obj, newobj, function (err, result) {
                    if (err) {
                        throw err;
                    } else {
                        res.json({ StatusCode: 200, Message: "Data Updated Successfully." });
                    }
                });
            }
        });
    } else {
        var obj = { title: Oldtitle };
        var newobj = { $set: { title: Title, description: Description } };
        dbo.collection('services').updateOne(obj, newobj, function (err, result) {
            if (err) {
                throw err;
            } else {
                res.json({ StatusCode: 200, Message: "Data Updated Successfully." });
            }
        });
    }

});
/* 
-----------------------------------------------------------------------------------------------------------
Gallory get
-----------------------------------------------------------------------------------------------------------
*/
app.get('/galloryget', function (req, res) {
    dbo.collection('gallory').find({}).sort({ _id: -1 }).limit(6).toArray(function (err, result) {
        if (err) { throw err; } else if (result !== null) {
            res.json({ StatusCode: 200, Message: "Gallory Images", Response: result });
        } else {
            res.json({ StatusCode: 400, Message: "No Image Found" });
        }
    });
});
/* 
-----------------------------------------------------------------------------------------------------------
Gallory Update
-----------------------------------------------------------------------------------------------------------
*/
app.post('/galloryupdate', function (req, res) {
    var insobj = [];
    try {
        var imagecollection = req.files.images;
        for (var i = 0; i < imagecollection.length; i++) {
            var filepath = "./images/gallory/" + imagecollection[i].name;
            imagecollection[i].mv(filepath, function (err) {
                if (err) throw err;
            });
            insobj.push({ "path": filepath });
            if (i === imagecollection.length - 1) {
                dbo.collection('gallory').insertMany(insobj, function (err, result) {
                    if (err) { throw err; } else {
                        res.json({ StatusCode: 200, Message: "Gallory Images Inserted" });
                    }
                });
            }
        }

    } catch (e) {
        res.json({ StatusCode: 400, Message: e.message });
    }
});
/* 
-----------------------------------------------------------------------------------------------------------
Clients get
-----------------------------------------------------------------------------------------------------------
*/
app.get("/clientsget", function (req, res) {
    dbo.collection('clients').find({}, { "ClientName": 1, _id: 0 }).toArray(function (err, result) {
        if (err) { throw err; } else if (result != null) {
            res.json({ StatusCode: 200, Message: "Our Clients", Response: result });
        } else {
            res.json({ StatusCode: 400, Message: "No Clients Found" });
        }
    });
});
/*
-----------------------------------------------------------------------------------------------------------
Clients Insert
-----------------------------------------------------------------------------------------------------------
*/
app.post("/clientinsert", function (req, res) {
    try {
        var ClientImage = req.files.clientimage;
        var ClientName = req.query.ClientName;
        var filepath = "./images/clients/" + ClientImage.name;
        ClientImage.mv(filepath, function (err) {
            if (err) {
                throw err;
            } else {
                var obj = { ClientName: ClientName, image: filepath }
                dbo.collection('clients').insertOne(obj, function (err, result) {
                    if (err) {
                        throw err;
                    } else {
                        res.json({ StatusCode: 200, Message: "Client Added Successfully." });
                    }
                });
            }
        });
    } catch (e) {
        res.json({ StatusCode: 400, Message: "One or more parameter(s) is missing.", Error_description: e.message });
    }
});
/*
-----------------------------------------------------------------------------------------------------------
Products Get
-----------------------------------------------------------------------------------------------------------
*/
app.get("/productsget", function (req, res) {
    var obj = { Status: 'Y' };
    dbo.collection('products').find(obj).toArray(function (err, result) {
        if (err) { throw err; } else if (result != null && result.length > 0) {
            res.json({ StatusCode: 200, Message: "List Of products", Response: result });
        } else {
            res.json({ StatusCode: 400, Message: "No Products Found" });
        }
    });
});

/*
----------------------------------------------------------------------------------------------------------
Products insert
----------------------------------------------------------------------------------------------------------
*/
var fs = require('fs');
var csv = require('fast-csv');

var jsonfile = require('jsonfile');
app.post("/productinsert", function (req, res) {
    var productscreenshots = [];
    var exceldataobj = [];
    var screenlocation;
    var browcherlocation;
    var location;
    try {
        //Model No for check before insert
        var modelno = req.query.modelno;
        var productscreen = req.files.screenshots;
        var browcher = req.files.browcher;
        var tempsec = new Date().getTime() / 1000;
        browcherlocation = './images/browcher/' + browcher.name.split('.')[0] + tempsec + "." + browcher.name.split('.')[1];
        var jsonfiledata = req.files.jsonfilesend;
        location = './images/productjson/' + tempsec + '.json';
        if (jsonfiledata.name.split('.')[1] === 'json' && modelno !== '' && modelno !== null && modelno !== undefined) {
            jsonfiledata.mv(location, function (err) {
                if (err) throw err;
                jsonfile.readFile(location, function (err, obj) {
                    browcher.mv(browcherlocation, function (err) {
                        if (err) throw err;
                        for (var i = 0; i < productscreen.length; i++) {
                            screenlocation = './images/productscreenshot/' + productscreen[i].name.split('.')[0] + tempsec + '.png';
                            productscreen[i].mv(screenlocation, function (err) {
                                if (err) throw err;
                            });
                            productscreenshots.push(screenlocation);
                            if (i === productscreen.length - 1) {
                                obj.Screenshot = productscreenshots;
                                obj.Browcher = browcherlocation;
                                var findobj = { "modelno": modelno }
                                dbo.collection('products').findOne(findobj, function (err, result) {
                                    if (err) throw err;
                                    if (result != null) {
                                        res.json({ StatusCode: 400, Message: "Same product already exist!!!" });
                                    } else {
                                        dbo.collection('products').insertOne(obj, function (err, data) {
                                            if (err) throw err;
                                            res.json({ StatusCode: 200, Message: "Product Inserted Successfully", Response: data });
                                        });
                                    }
                                });
                            }
                        }
                    });

                })
            });
        } else {
            throw "Please select correct json file. ";
        }
    } catch (e) {
        res.json({ StatusCode: 400, Message: "One or more parameter(s) is missing or select right files.", Error_description: e.message });
    }
});
/*
----------------------------------------------------------------------------------------------------------
Product Delete
----------------------------------------------------------------------------------------------------------
*/
app.delete("/deleteproduct", function (req, res) {
    try {
        var modelno = req.query.modelno;
        if (modelno !== ('' && null && undefined)) {
            var obj = { "modelno": modelno };
            dbo.collection('products').deleteOne(obj, function (err, data) {
                if (err) throw err;
                res.json({ StatusCode: 200, Message: "Product Deleted Successfully", Response: data });
            });
        } else {
            throw "Parameter 'modelno' not undefined";
        }
    } catch (e) {
        res.json({ StatusCode: 400, Message: "Parameter 'modelno' should not undefined", Error_description: e.message });
    }

});


/*
-----------------------------------------------------------------------------------------------------------
Attainments get
-----------------------------------------------------------------------------------------------------------
*/
app.get("/attainmentsget", function (req, res) {
    var obj = { Status: 'Y' };
    dbo.collection('attainments').find(obj).sort({ _id: -1 }).toArray(function (err, result) {
        if (err) throw err;
        if (result !== null && result.length > 0) {
            res.json({ StatusCode: 200, Message: "Attainments list", Response: result });
        } else {
            //res.json({StatusCode:400,Message:"No attainments found!!!"});
        }
    });
});

/*
-----------------------------------------------------------------------------------------------------------
Attainments insert
-----------------------------------------------------------------------------------------------------------
*/
app.post("/attainmentsinsert", function (req, res) {
    try {
        var appname = req.query.appname;
        var applogo = req.files.applogo;
        var inventers = req.query.inventers;
        var downloadlink = req.query.downloadlink;
        var description = req.query.description;
        var path = './images/attainments/' + applogo.name;
        applogo.mv(path, function (err) {
            if (err) throw err;
            var obj = { appname: appname, applogo: path, inventers: inventers, downloadlink: downloadlink, description: description, Status: 'Y' };
            dbo.collection('attainments').findOne(obj, function (err, data) {
                if (data !== null && data.length > 0) {
                    res.json({ StatusCode: 400, Message: "Same attainment found!!!" });
                } else {
                    dbo.collection('attainments').insertOne(obj, function (err, result) {
                        if (err) throw err;
                        res.json({ StatusCode: 200, Message: "Attainment inserted successfully", Response: result });
                    });
                }
            });
        });
    } catch (e) {
        res.json({ StatusCode: 400, Error_description: e.message });
    }
});
/*
-----------------------------------------------------------------------------------------------------------
Attainments delete
-----------------------------------------------------------------------------------------------------------
*/
app.delete("/attainmentdelete", function (req, res) {
    var appname = req.query.appname;
    var obj = { appname: appname };
    dbo.collection('attainments').deleteOne(obj, function (err, result) {
        if (err) throw err;
        res.json({ StatusCode: 200, Message: "Attainments deleted successfully!!!", Response: result });
    });
});

/*
-----------------------------------------------------------------------------------------------------------
Career Updates insert
-----------------------------------------------------------------------------------------------------------
*/
app.get("/careerupdates", function (req, res) {
    var content = req.query.content;
    var obj = { content: content, Status: 'Y' };
    dbo.collection('careerupdates').updateMany({ Status: 'Y' }, { $set: { Status: 'N' } }, function (err) {
        if (err) throw err;
        dbo.collection('careerupdates').insertOne(obj, function (err, result) {
            if (err) throw err;
            res.json({ StatusCode: 200, Message: "Career updated successfully!!!", Response: result });
        });
    });
});
/*
-----------------------------------------------------------------------------------------------------------
Career Updates get
-----------------------------------------------------------------------------------------------------------
*/
app.get("/careerupdatesget", function (req, res) {
    dbo.collection('careerupdates').find({ Status: 'Y' }).toArray(function (err, result) {
        if (err) throw err;
        if (result !== null && result.length > 0) {
            res.json({ StatusCode: 200, Message: "Career details", Response: result });
        } else {
            res.json({ StatusCode: 400, Message: "Career details not found!!!" });
        }
    });
});

/*
-----------------------------------------------------------------------------------------------------------
Our Expertise insert
-----------------------------------------------------------------------------------------------------------
*/
app.post("/ourexpertiseins", function (req, res) {
    try {
        var logo = req.files.logo;
        var techname = req.query.techname;
        var locationmv = './images/expertise/' + logo.name;
        logo.mv(locationmv, function (err) {
            if (err) throw err;
            var obj = { techname: techname, logopath: locationmv };
            var obj1 = { techname: techname };
            dbo.collection('expertise').find(obj1).toArray(function (err, result) {
                if (err) throw err;
                if (result != null && result.length > 0) {
                    res.json({ StatusCode: 400, Message: "Expertise already exist!!!." });
                } else {
                    dbo.collection('expertise').insertOne(obj, function (err) {
                        if (err) throw err;
                        res.json({ StatusCode: 200, Message: "Inserted Successfully." });
                    });
                }
            });
        });
    } catch (e) {
        res.json({ StatusCode: 400, Message: "One or more parameter(s) is missing ", Error_description: e.message });
    }
});
/*
-----------------------------------------------------------------------------------------------------------
Our Expertise get
-----------------------------------------------------------------------------------------------------------
*/
app.get("/ourexpertiseget", function (req, res) {
    dbo.collection('expertise').find({}).toArray(function (err, result) {
        if (err) throw err;
        if (result != null && result.length > 0) {
            res.json({ StatusCode: 200, Message: "Expertise details.", Response: result });
        } else {
            res.json({ StatusCode: 400, Message: "No expertise found." });
        }
    });
});

app.get("/ourexpertisedelete", function (req, res) {
    var techname = req.query.techname;
    var obj = { techname: techname };
    dbo.collection('expertise').remove(obj, function (err, result) {
        if (err) throw err;
        res.json({ StatusCode: 200, Message: "Expertise deleted successfully." });

    });
});

// For Sample Code for insert images in sql server

//

/* checkimages */
var sql = require('mssql');
var config = {
    user: 'sa',
    password: 'y@h00.c0m',
    server: '192.168.2.3',
    database: 'ExamApp',
    pool: { max: 30000, min: 0, idleTimeoutMillis: 30000 }
};


app.post('/checkimages', function (req, res) {

    var QType = req.query.QType;
    var register = req.files.regfile;
    var PDFdocument = req.files.PDFdocument;
    let certificatelocation = '';
    let registerlocation = '';
    let pdflocation = '';
    //res.json(req.files)

    try {
        var certificate = req.files.certificate;
        certificatelocation = './images/' + certificate.name;
        certificate.mv(certificatelocation, function (err) {
            if (err) res.json({ Message: err });
        });
    } catch (e) {
        console.log(e)
    }
    registerlocation = './images/' + register.name;
    pdflocation = './images/' + PDFdocument.name;
    register.mv(registerlocation, function (err) {
        if (err) res.json({ Message: err });
        PDFdocument.mv(pdflocation, function (err) {
            if (err) res.json({ Message: err });

            var Connect = new sql.Connection(config, function (err) {
                if (err) res.json({ Message: err });
                var request = new sql.Request(Connect);

                request.input('QType', QType);
                request.input('register', registerlocation);
                request.input('PDFdocument', pdflocation);
                request.input('certificate', certificatelocation);
                request.output("SQLReturn");

                request.execute('Insert_IAMGE', function (err, recordsets, returnValue, results) {
                    // ... error checks
                    if (err) {
                        console.log(err);
                        
                        res.json({ code: 1, message: err });
                    } else {
                        console.log(request.parameters.SQLReturn.value);
                        res.json({ code: 1, message: request.parameters.SQLReturn.value });
                    }
                });
            });

        });


    });
});


app.post('/filesdemo', (req, res) => {
    
    res.json(req.files);
});


// listen for uests
app.listen(3001);
console.log("Server Listening Port 3001")