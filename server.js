const Pool = require('mysql/lib/Pool');

//initial stuff
const moment = require('moment'), sha1 = require('sha1'), express = require('express'), app = express(), fs = require('fs'), mysql = require('mysql'), configs = require('./configs'), path = require('path');
let connection = mysql.createPool(configs.dbconfig);
app.use(express.urlencoded({extended:true}));
//path
app.post('/api/register',(req,res)=>{
    let user = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        password2:req.body.password2
    },
    message = {

    }
    if (user.name==null||user.email==null||user.password==null||user.password2==null){
        message = "Nem adtál meg minden adatot!"
        res.status(206).send(message);
    }
    else {
        if (user.password!==user.password2){
            message = "A jelszavak nem egyeznek";
            res.status(206).send(message)
        }
        else{
            connection.query(`select * from users where email=?`, [user.email], (err,dt)=>{
                if (err) res.status(500).send(err.sqlMessage);
                else if (dt.length>0){
                    message = 'Ezen az e-mail címen már van regisztráció';
                    res.status(206).send(message);
                }
                else {
                    message = "sikeres regisztráció"
                    connection.query('insert into users values (null, ?, ?, ?, 0, null, null)', [user.name, user.email, sha1(user.password).toString()], (err,data)=>{
                        res.status(200).send(message);
                    });
                }
            });
        }
    }
});
app.post('/api/login', (req,res)=>{
    let userdate = {
        mail: req.body.mail,
        pass: req.body.pass
    }
    let message = '';
    if (userdate.mail==null || userdate.pass == null){
        message = "Nem adtál meg minden adatot!"
        res.status(206).send(message);
    }
    else {
        connection.query('select email, passwd from users where email=? and passwd=?', [userdate.mail, sha1(userdate.pass)], (err, dt)=>{
            if (err) res.status(500).send(err.sqlMessage)
            if (dt.length>0){
                if (dt[0].status==0){
                    res.status(403).send('tiltva van uram!');
                }
                else{
                    connection.query('update users set last=? where id=?', [moment().format(), dt[0].id], (err,d)=>{
                        if (err) res.status(500).send(err.sqlMessage);

                        else{
                            res.status(200).send('sikeres bejelentkezés')
                        }
                    })
                }
            }
            else res.status(206).send('hiba')
        })
    }
})
app.post('/api/logout', (req,res)=>{

})
//server
app.listen(configs.port, console.log('started on http://localhost:8080'));