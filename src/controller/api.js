'use strict';
var globals = require("../doc/global");
const util = require('util');
exports.login = function (req, res) {
    var sql = "select * from tbl_app_user";
    globals.db_con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result[0]);
        res.json(result);
    });
    console.log('Test');
};

exports.getCampaignInfo = function(req,res)
{
    console.log("-----------Get Campaign Info API-----------");
    var campNo = req.body['campaignNo'];
    var userNo = req.body['userNo'];
    let campSql = "select * from campaign where no='" + campNo + "'";
    globals.db_con.query(campSql, function (err, resCamp) {
        if (resCamp.length > 0)
        {
            let info = resCamp[0];
            let pUserSql = "select A.status as user_campaign_status,B.* from app_user_campaign as A left join app_user as B on A.app_user=B.no where A.campaign='" + campNo + "'";
            let pStatusSql = "select * from app_user_campaign where app_user='" + userNo + "' and campaign='" + campNo + "'";
            globals.db_con.query(pUserSql, function (errUser, resUser) {
                info.participants = resUser;
                globals.db_con.query(pStatusSql, function (errStatus, resStatus) {
                    if (resStatus.length > 0)
                    {
                        info.user_camp_status = resStatus[0].status;
                        info.referral_code = resStatus[0].referral_code;
                        info.android = resStatus[0].android;
                        info.ios = resStatus[0].ios;
                    }
                    else
                    {
                        info.user_camp_status = 0;
                    }
                    let outResult = {};
                    outResult['code'] = 200;
                    outResult['info'] = info;
                    console.log(JSON.stringify(outResult));
                    res.json(outResult);
                    return;
                });
            });
        }
        else
        {
            let outResult = {};
            outResult['code'] = 400;
            outResult['message'] = "Campaign not exist";
            console.log(JSON.stringify(outResult));
            res.json(outResult);
            return;
        }
    });
}
exports.checkUser = function (req, res) {
    console.log("-----------Check User API-----------");
    var instagramId = req.body['instagram_id'];
    var sql = "select * from app_user where instagram_id = '" + instagramId + "'";
    globals.db_con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            var outResult = {};
            outResult['code'] = 200;
            outResult['info'] = result[0];
            console.log(JSON.stringify(outResult));
            res.json(outResult);
            return;
        }
        else {
            var outResult = {};
            outResult['code'] = 201;
            outResult['message'] = 'No User';
            console.log(JSON.stringify(outResult));
            res.json(outResult);
            return;
        }
    });
}
exports.getAllCampaigns = function (req, res) {
    console.log("-----------Get All Campaigns User API-----------");
    //var instagramId = req.body['instagram_id'];
    var sql = "select * from campaign";
    globals.db_con.query(sql, function (err, result) {
        if (err) throw err;
        let exCamps = [];
        result.forEach(function(info,index)
        {
            var pUserSql = "select * from app_user_campaign as A left join app_user as B on A.app_user=B.no where A.campaign='" + info.no + "'";
            globals.db_con.query(pUserSql, function (errUser, resUser) {
                info.participants = resUser;
                exCamps.push(info);
                if (index == result.length-1)
                {
                    let outResult = {};
                    outResult['code'] = 200;
                    outResult['infos'] = exCamps;
                    console.log(JSON.stringify(outResult));
                    res.json(outResult);
                    return;
                }
            });
        });
    });
}


exports.signup = function (req, res) {
    console.log("-----------Calling SignUp API-----------");
    var username = req.body['username'];
    var fullName = req.body['fullname'];
    var picture = req.body['picture'];
    var email = req.body['email'];
    var instagramId = req.body['instagram_id'];
    var instagramUser = req.body['instagram_user'];
    var follower_count = req.body['follower_count'] === undefined ? 0 : req.body['follower_count'];
    var following_count = req.body['following_count'] === undefined ? 0 : req.body['following_count'];
    var bio = req.body['bio'] === undefined ? '' : req.body['bio'];

    //Extra Fields
    var birth = req.body['birth'] === undefined ? '' : req.body['birth'];
    var gender = req.body['gender'] === undefined ? '' : req.body['gender'];
    var phone = req.body['phone'] === undefined ? '' : req.body['phone'];
    var country = req.body['country'] === undefined ? '' : req.body['country'];
    var city = req.body['city'] === undefined ? '' : req.body['city'];

    if (email === undefined || instagramId === undefined) {
        var outResult = {};
        outResult['code'] = 400;
        outResult['message'] = 'Missing Paramters';
        res.json(outResult);
        return;
    }

    var sql = "select * from app_user where instagram_id = '" + instagramId + "' or email='" + email + "'";
    globals.db_con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            var updateSQL = "UPDATE app_user SET name='" + username + "',last_name='" + fullName + "',email='" + email + "',birth_date='" + birth + "',follower_count='" + follower_count + "',followed_count='" + following_count + "',photo_url='" + picture + "',gender='" + gender + "',city='" + city + "',country='" + country + "',phone='" + phone + "'";
            globals.db_con.query(updateSQL, function (err, rr) {
                if (err) throw err;
                var outResult = {};
                outResult['code'] = 200;
                outResult['message'] = "Existing User";
                outResult['userId'] = result[0].no;
                console.log(JSON.stringify(outResult));
                res.json(outResult);
                return;
            });
        }
        else {
            var insertSql = "INSERT INTO app_user (name, last_name, email,instagram_id, instagram_username,birth_date,follower_count,followed_count,cover_url,photo_url,bio,gender,city,country,phone) VALUES "
                + "('" + username + "','" + fullName + "','" + email + "','" + instagramId + "','" + instagramUser + "','" + birth + "','" + follower_count + "','" + following_count + "','','" + picture + "','" + bio + "','" + gender + "','" + city + "','" + country + "','" + phone + "')";
            globals.db_con.query(insertSql, function (err, result) {
                if (err) throw err;
                var outResult = {};
                outResult['code'] = 200;
                outResult['userId'] = result.insertId;
                outResult['message'] = 'Success';
                res.json(outResult);
                return;
            });
        }
    });
};

exports.activateCampaign = function (req, res) {
    console.log("-----------Activate Campaign API-----------");
    var campNo = req.body['campaignNo'];
    var userNo = req.body['userNo'];
    let checkSql = "select * from app_user_campaign where app_user='" + userNo + "' and campaign='" + campNo + "'";
    globals.db_con.query(checkSql, function (err, result) {
        if (result.length > 0)
        {
            let outResult = {};
            outResult['code'] = 400;
            outResult['message'] = 'Already activated';
            console.log(JSON.stringify(outResult));
            res.json(outResult);
            return;
        }
        var insertSql = "INSERT INTO app_user_campaign (app_user, campaign) VALUES "
                + "('" + userNo + "','" + campNo + "')";
        globals.db_con.query(insertSql, function (err, result) {
            if (err) throw err;
            let outResult = {};
            outResult['code'] = 200;
            outResult['message'] = 'Success';
            console.log(JSON.stringify(outResult));
            res.json(outResult);
            return;
        });
    });
};

exports.getParticipants = function (req, res) {
    console.log("-----------Get Participants API-----------");
    var campNo = req.body['campaignNo'];
    let checkSql = "select B.no as no,B.username as username from app_user_campaign as A left join app_user as B on A.app_user=B.no where A.campaign='" + campNo + "'";
    globals.db_con.query(checkSql, function (err, result) {
        let outResult = {};
        outResult['code'] = 200;
        outResult['message'] = 'Success';
        outResult['infos'] = result;
        console.log(JSON.stringify(outResult));
        res.json(outResult);
        return;
    });
};
exports.getAllPosts = function (req, res) {
    console.log("-----------Get All Posts API-----------");
    let userNo = req.body['userNo'];
    let sql = "select B.no,B.name,A.no as user_camp_no from app_user_campaign as A left join campaign as B on A.campaign=B.no where A.app_user='" + userNo + "'";
    let outResult = {};
    outResult['code'] = 200;
    globals.db_con.query(sql, function (err, result) {
        if (err) throw err;
        let exCamps = [];
        result.forEach(function(info,index)
        {            
            var pApproveSql = "select * from post where app_user_campaign='" + info.user_camp_no + "' and status=1";
            var pUnapproveSql = "select * from post where app_user_campaign='" + info.user_camp_no + "' and status=0";
            globals.db_con.query(pApproveSql, function (errPost, resPost) {
                info.approves = resPost;
                globals.db_con.query(pUnapproveSql, function (errPost, resUnapproves) {
                    info.unapproves = resUnapproves;
                    exCamps.push(info);
                    if (index == result.length-1)
                    {
                        outResult['infos'] = exCamps;
                        console.log(JSON.stringify(outResult));
                        res.json(outResult);
                        return;
                    }
                });
            });
        });
    });
};

exports.submitPost = function (req, res) {
    console.log("-----------Submit Posts API-----------");
    let userNo = req.body['userNo'];
    let sql = "select B.no,B.name,A.no as user_camp_no from app_user_campaign as A left join campaign as B on A.campaign=B.no where A.app_user='" + userNo + "'";    
    let outResult = {};
    outResult['code'] = 200;
    globals.db_con.query(sql, function (err, result) {
        if (err) throw err;
        let exCamps = [];
        result.forEach(function(info,index)
        {            
            var pApproveSql = "select * from post where app_user_campaign='" + info.user_camp_no + "' and status=1";
            var pUnapproveSql = "select * from post where app_user_campaign='" + info.user_camp_no + "' and status=0";
            globals.db_con.query(pApproveSql, function (errPost, resPost) {
                info.approves = resPost;
                globals.db_con.query(pUnapproveSql, function (errPost, resUnapproves) {
                    info.unapproves = resUnapproves;
                    exCamps.push(info);
                    if (index == result.length-1)
                    {
                        outResult['infos'] = exCamps;
                        console.log(JSON.stringify(outResult));
                        res.json(outResult);
                        return;
                    }
                });
            });
        });
    });
};





