var Config = require('../doc/config');
var Global = require('../doc/global');

var mysql = require('mysql');
exports.connectDatabase = function()
{
    var con = mysql.createConnection({
        host: Config.DB_HOST,
        user: Config.DB_USER,
        password: Config.DB_PASSWORD,
        database: Config.DB_NAME
    })
    con.connect(function (err){
        if (err) throw err;
        console.log("Database Connected!");
    });
    Global.db_con = con;
};