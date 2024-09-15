var express = require("express");
var mysql = require("mysql2");
var fileuploader = require("express-fileupload");
var app = express();
app.listen(2005 || process.env.PORT, function () {
  console.log("Server Started");
});
const nodemailer = require("nodemailer");
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
});
app.use(express.static("public"));
app.use(fileuploader());

// app.get("/profile",function(req,resp){
//     resp.sendFile(process.cwd()+"/public/profile.html");
// });

app.get("/profile-donor", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/profile-donor.html");
});
app.get("/avail-med", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/avail-med.html");
});

app.use(express.urlencoded(true));
//==========DataBase
var dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "signup",
  dateStrings: true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
  if (err == null)
    console.log("Connected Successfully");
  else
    resp.send(err);
})
//======================Email Checker===========
app.get("/chk-email", function (req, resp) {
  //saving data in table


  //fixed                             //same seq. as in table
  dbCon.query("select * from user where email=?", [req.query.kuchEmail], function (err, resultTable) {
    if (err == null) {
      if (resultTable.length == 1)
        resp.send("Already Taken...");
      else
        resp.send("Available....!!!!");
    }
    else
      resp.send(err);
  })
})
//======================Sign Up=================
app.get("/chk-submit", function (req, resp) {


  dbCon.query("insert into user(email,pwd,type1,dos,status) values(?,?,?,current_date(),1)", [req.query.kuchemail, req.query.kuchpwd, req.query.kuchtype], function (err) {
    if (err == null) {
      resp.send("Record Saved successfully")
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        else
          console.log("sent: " + info.response);

      })
    }
    else {
      resp.send(err);
    }
  })
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gargchahat2005@gmail.com',
      pass: 'prvbaofggfhtvqly'
    }
  });

  const options = {
    from: "gargchahat2005@gmail.com", // sender ahddress
    to: req.query.kuchemail, // list of receivers
    subject: "Sign Up", // Subject line
    text: "You have successfully signed up ", // plain text body
    html: "<h1>Congrats</h1><br><b>You have successfully signed up</b><br> Login Id =" + req.query.kuchemail + "<br>Password=" + req.query.kuchpwd,

  };

})
//==================Log In================
app.get("/chk-login-submit", function (req, resp) {
  dbCon.query("select * from user where email=? && pwd=?", [req.query.kuchemail, req.query.kuchpwd], function (err, resultJSONTable) {
    if (err == null) {
      if (resultJSONTable.length > 0) {
        if (resultJSONTable[0].status == 1) {
          resp.send(resultJSONTable[0].type1);
        }
        else {
          resp.send("USER BLOCKED");
        }
      }
      else {
        resp.send("INVALID EMAIL OR PASSWORD");
      }
    }
    else {
      resp.send(err);
    }
  });
});
// //=================Profile==========================
// //=============Submit Profile=============
// app.post("/signup",function(req,resp){
//     //  resp.send("Data Reached");
//     var fileName="nopic.jpg";
//     if(req.files!=null)
//       {
//         //console.log(process.cwd());
//          fileName=req.files.ppic.name;
//         var path=process.cwd()+"/public/upload/"+fileName;
//         req.files.ppic.mv(path);
//       }
//       console.log(req.files);
// var emailid=req.body.txtEmail;
// var name=req.body.txtname;
// var contact=req.body.txtcontact;
// var address=req.body.txtaddress;
// var city=req.body.combocity;
// var dob=req.body.dob;
// var gender=req.body.gender;
// var id=req.body.idproof;
// console.log(req.body);
// dbCon.query("insert into user2023 values(?,?,?,?,?,?,?,?,?)",[emailid,name,contact,address,city,dob,gender,id,fileName],function(err){
//     if(err==null){
//         resp.send("Record saved successfullyyyyyyy");
//     }
//     else{
//         resp.send(err);
//     }
// })
//  //resp.query("Welcome"+req.body.txtEmail +" "+"Name"+req.body.txtname+" "+" Contact"+req.body.txtcontact+" "+"Adress"+req.body.txtaddress+"City"+city+"dob"+dob+"Gender"+gender+"Id"+id+"Pic"+fileName);
// });

// //======================Delete Profile=================
// app.post("/db-delete-process-secure",function(req,resp)
// {
//      //saving data in table
//     var emailid=req.body.txtEmail;


//          //fixed                             //same seq. as in table
//     dbCon.query("delete from user2023 where emailid=?",[emailid],function(err,result)
//     {
//           if(err==null)
//           {
//             if(result.affectedRows==1)
//               resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
//             else
//               resp.send("Inavlid Email id");
//             }
//               else
//             resp.send(err);
//     })
// })
// //================Check Email===============
// app.get("/chk-email",function(req,resp)
// {
//      //saving data in table


//          //fixed                             //same seq. as in table
//     dbCon.query("select * from user2023 where emailid=?",[req.query.kuchEmail],function(err,resultTable)
//     {
//           if(err==null)
//           {
//             if(resultTable.length==1)
//               resp.send("Already Taken...");
//             else
//               resp.send("Available....!!!!");
//             }
//               else
//             resp.send(err);
//     })
// })
// //====================update Profile=====================

// app.post("/update-db-process-secure",function(req,resp){
//   var fileName;
//   if(req.files!=null)
//   {
//      // console.log(process.cwd());
//       var fileName=req.files.ppic.name;
//       var path=process.cwd()+"/public/upload/"+fileName;  // location
//        req.files.ppic.mv(path);  // move file to required path
//   }
//   else 
//   {
//     fileName=req.body.hdn;
//   }
//   var emailid=req.body.txtEmail;
// var name=req.body.txtname;
// var contact=req.body.txtcontact;
// var address=req.body.txtaddress;
// var city=req.body.combocity;
// var dob=req.body.dob;
// var gender=req.body.gender;
// var id=req.body.idproof;

//   dbCon.query("update  user2023 set name=?,contact=?,address=?,city=?,dob=?,gender=?,id=? where emailid=?",[name,contact,address,city,dob,gender,id,emailid],function(err,result){
//       if(err==null){
//           if(result.affectedRows==1){
//           resp.send("Updated Successfully..")
//           }
//           else{
//               resp.send("No such account exists");
//           }
//       }
//       else{
//           resp.send(err);
//       }

//   })
// })
// //======================search email==========================
// app.get("/get-json-record",function(req,resp)
// {
//          //fixed                             //same seq. as in table
//     dbCon.query("select * from user2023 where emailid=?",[req.query.kuchemail],function(err,resultJSONKuch)
//     {
//           if(err==null)

//             {
//               resp.send(resultJSONKuch);
//             }

//           else
//           resp.send(err);

//     })
// })

//================= Donor-Profile==========================
//=============Submit Profile=============
app.post("/submit-process", function (req, resp) {
  //  resp.send("Data Reached");
  var fileName = "nopic.jpg";
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;
    req.files.ppic.mv(path);
  }
  console.log(req.files);
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var id = req.body.idproof;
  var ahours = req.body.ah + "-" + req.body.bh;
  console.log(req.body);
  dbCon.query("insert into donors values(?,?,?,?,?,?,?,?,?,?)", [emailid, name, contact, address, city, dob, gender, id, fileName, ahours], function (err) {
    if (err == null) {
      resp.send("Record saved successfullyyyyyyy");
    }
    else {
      resp.send(err);
    }
  })
  //resp.query("Welcome"+req.body.txtEmail +" "+"Name"+req.body.txtname+" "+" Contact"+req.body.txtcontact+" "+"Adress"+req.body.txtaddress+"City"+city+"dob"+dob+"Gender"+gender+"Id"+id+"Pic"+fileName);
});


//================Check Email===============
// app.get("/email",function(req,resp)
// {
//      //saving data in table


//          //fixed                             //same seq. as in table
//     dbCon.query("select * from donors where emailid=?",[req.query.kuchEmail],function(err,resultTable)
//     {
//           if(err==null)
//           {
//             if(resultTable.length==1)
//               resp.send("Already Taken...");
//             else
//               resp.send("Available....!!!!");
//             }
//               else
//             resp.send(err);
//     })
// })
//====================update Profile=====================

app.post("/update-process", function (req, resp) {
  var fileName;
  if (req.files != null) {
    // console.log(process.cwd());
    var fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;  // location
    req.files.ppic.mv(path);  // move file to required path
  }
  else {
    fileName = req.body.hdn;
  }
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var id = req.body.idproof;
  var ahours = req.body.ah + "-" + req.body.bh;

  dbCon.query("update  donors set name=?,contact=?,address=?,city=?,dob=?,gender=?,fileName=?,id=?,ahours=? where emailid=?", [name, contact, address, city, dob, gender, fileName, id, ahours, emailid], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }

  })
})
//======================search email==========================
app.get("/json-record", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from donors where emailid=?", [req.query.kuchemail], function (err, resultJSONKuch) {
    if (err == null) {
      resp.send(resultJSONKuch);
    }

    else
      resp.send(err);

  })
})

//======================Avail Med.=========================
//////////////////////////

app.get("/submit", function (req, resp) {

  dbCon.query("insert into medsavailable(email,med,qty,packing,expdate) values(?,?,?,?,?)", [req.query.kuchemail, req.query.kuchmed, req.query.kuchquantity, req.query.kuchpacking, req.query.kuchdoe], function (err) {
    if (err == null) {
      resp.send("Record Saved successfully")
    }
    else {
      resp.send(err);
    }
  })

})


//==========================

// connect with the smtp


//==================Settings

app.get("/setting", function (req, resp) {

  dbCon.query("update  user set pwd=? where email=? && pwd=?", [req.query.kuchnewPwd, req.query.kuchemail, req.query.kucholdPwd], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
        transporter.sendMail(options, function (err, info) {
          if (err) {
            console.log(err);
            return;
          }
          else
            console.log("sent: " + info.response);

        })
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }
  })
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gargchahat2005@gmail.com',
      pass: 'prvbaofggfhtvqly'
    }
  });

  const options = {
    from: "gargchahat2005@gmail.com", // sender ahddress
    to: req.query.kuchemail, // list of receivers
    subject: "Sign Up", // Subject line
    text: "Your password is successfully updated ", // plain text body
    html: "<h1>Congrats</h1><br><b>Your password is successfully updated</b><br> Login Id =" + req.query.kuchemail + "<br>Password=" + req.query.kuchnewPwd,

  };

})
//============================needy-Profile===========================
//=============Submit Profile=============
app.post("/send_to_server", function (req, resp) {
  //  resp.send("Data Reached");
  var fileName = "nopic.jpg";
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;
    req.files.ppic.mv(path);
  }
  console.log(req.files);
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;

  console.log(req.body);
  dbCon.query("insert into needy values(?,?,?,?,?,?,?,?)", [emailid, name, contact, address, city, dob, gender, fileName], function (err) {
    if (err == null) {
      resp.send("Record saved successfullyyyyyyy");
    }
    else {
      resp.send(err);
    }
  })
  //resp.query("Welcome"+req.body.txtEmail +" "+"Name"+req.body.txtname+" "+" Contact"+req.body.txtcontact+" "+"Adress"+req.body.txtaddress+"City"+city+"dob"+dob+"Gender"+gender+"Id"+id+"Pic"+fileName);
});
///////////////////////update=============
app.post("/update-to-server", function (req, resp) {
  var fileName;
  if (req.files != null) {
    // console.log(process.cwd());
    var fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;  // location
    req.files.ppic.mv(path);  // move file to required path
  }
  else {
    fileName = req.body.hdn;
  }
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;


  dbCon.query("update  needy set name=?,contact=?,address=?,city=?,dob=?,gender=?,fileName=? where emailid=?", [name, contact, address, city, dob, gender, fileName, emailid], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }

  })
})
///////////////json========
app.get("/json", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from needy where emailid=?", [req.query.kuchemail], function (err, resultJSONKuch) {
    if (err == null) {
      resp.send(resultJSONKuch);
    }

    else
      resp.send(err);

  })
})
// app.get("/fetch-donor-data",function(req,resp){
//     // alert();
//     resp.sendFile(process.cwd()+"/public/panel-donors.html");
//   });
// //============
// app.get("/fetch-donor-records",function(req,resp)
// {
//          //fixed                             //same seq. as in table
//     dbCon.query("select * from donors",function(err,resultTableJSON)
//     {
//           if(err==null)
//             resp.send(resultTableJSON);
//               else
//             resp.send(err);
//     })
// });
app.get("/get-angular-all-records", function (req, resp) {
  //fixed                               //same seq. as in table
  dbCon.query("SELECT * FROM user ORDER BY type1 ASC;", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/do-angular-delete", function (req, resp) {
  //saving data in table
  var email = req.query.emailkuch;


  //fixed                             //same seq. as in table
  dbCon.query("delete from user where email=?", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
      else
        resp.send("Inavlid Email id");
    }
    else
      resp.send(err);
  })
})
///=================
app.get("/do-angular-block", function (req, resp) {
  var email = req.query.emailkuch;


  dbCon.query("update  user set status=0 where email=? ", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }
  })

})

//===================
app.get("/do-angular-resume", function (req, resp) {
  var email = req.query.emailkuch;


  dbCon.query("update  user set status=1 where email=? ", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }
  })

})
//======================donor-panel===================
app.get("/get-angular-donors-records", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from donors", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
//======================needy-panel===================
app.get("/get-angular-needys-records", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from needy", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
/////////////////////////////////
app.get("/fetch-donor-med-details", function (req, resp) {
  var email = req.query.emailkuch;
  dbCon.query("select * from medsavailable where email=?", [email], function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/do-delete", function (req, resp) {
  //saving data in table
  var srno = req.query.srnokuch;


  //fixed                             //same seq. as in table
  dbCon.query("delete from medsavailable where srno=?", [srno], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Medicine deleted");
      else
        resp.send("No expired medicine yet");
    }
    else
      resp.send(err);
  })
})
/////////////////////////
app.get("/get-cities", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select distinct city from donors", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/get-meds", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select distinct med from medsavailable", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
//////////////////////////
app.get("/do-remove", function (req, resp) {
  //saving data in table



  //fixed                             //same seq. as in table
  dbCon.query("delete from medsavailable where expdate<=current_date()", function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Medicine deleted");
      else
        resp.send("No expired medicine yet");
    }
    else
      resp.send(err);
  })
})

app.get("/fetch-donors", function (req, resp) {
  // console.log(req.query);
  var med = req.query.medKuch;
  var city = req.query.cityKuch;

  var query = "select * from donors  inner join medsavailable on donors.emailid= medsavailable.email where medsavailable.med=? and donors.city=?";


  dbCon.query(query, [med, city], function (err, resultTable) {
    // console.log(resultTable+"      "+err);
    if (err == null)
      resp.send(resultTable);
    else
      resp.send(err);
  })
})

