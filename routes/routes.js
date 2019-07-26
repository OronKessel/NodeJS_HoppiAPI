module.exports = function(app){
  var api = require("../src/controller/api")
  app.route('/signup').post(api.signup);
  app.route('/checkuser').post(api.checkUser);
  app.route('/all_campaigns').post(api.getAllCampaigns);
  app.route('/get_campaign_info').post(api.getCampaignInfo);
  app.route('/activate_campaign').post(api.activateCampaign);
  app.route('/participants').post(api.getParticipants);
  app.route('/get_user_posts').post(api.getAllPosts);  
  app.route('/submit_post').post(api.submitPost);  
  
  //app.route('/test').get(api.test);
};