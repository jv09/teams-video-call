const router = require('express').Router();
const{ v4: uuidV4 } = require('uuid');
const passport = require('passport');
const homeController = require('../controllers/home-controllers');
const passportSetup = require('../config/passport-setup');
//const Post = require('../models/post');
const User = require('../models/user');
const Room = require('../models/room');
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token');
const Chat = require('../models/chat');

router.get('/',passport.authenticate('google',{
    scope: ['profile', 'email']
}));

router.get('/redirect', passport.authenticate('google'), (req, res)=> {
  res.redirect('/home');
});

router.get('/home',  homeController.home);

router.post('/home', homeController.isAuthenticated, homeController.create);

router.post('/join', homeController.isAuthenticated, homeController.join);

router.get('/:room/home', async (req, res) => {
    if(req.user != undefined){
        try{ 
        let check=0;
          for(roomcheck of req.user.rooms)
          {
            if(req.params.room==roomcheck) {check=1;}
          }
          
          if(check==1){
            let chats = [];
            let roomid = req.params.room;
            let roomcheck = await Room.findById(req.params.room);
          // for(chat of roomid.chats)
          //   {
          //     let chatcheck = await Chat.findById(chat);
          //       chats.push( chatcheck );
          //   }
          for await (const doc of Chat.find({roomId: req.params.room})) {
            chats.push(doc); // Push documents one at a time
          }
            let users = [];
            for(user of roomcheck.users)
              {
                  let usercheck = await User.findById(user);
                    users.push( usercheck );
              }
            // console.log(users, chats);
            res.render('roomhome', { roomId: req.params.room, users:users, usercheck:req.user._id, roomcheck:roomcheck, username: req.user.username, chats: chats})
          }else{
            res.send("Team does not exists");}
          }
        catch(err){
          return;
        }
    }
    else res.send("sign in to access teams");
 })

router.get('/:room', async(req, res) => {
    if(req.user != undefined){
        try{ 
        let check=0;
        for(roomop of req.user.rooms)
        {
          if(req.params.room==roomop) {check=1;}
        }
          if(check==1){
            var appID = '086d8146938947cf99d60bbb9e580069';
            var appCertificate = 'd8ad81ef661241af941b70a61c9f2f8b';
            var channelName = 'mychannel';
            var uid = req.user.id;
            var googleId = req.user.googleId;
            //const account = "0";
            const role = RtcRole.PUBLISHER;
        
            const expirationTimeInSeconds = 3600;
        
            const currentTimestamp = Math.floor(Date.now() / 1000);
        
            const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        
        // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.
        
            const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
            console.log("Token With Integer Number Uid: " + tokenA);
        
        // Build token with user account
            const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, googleId, role, privilegeExpiredTs);
            //console.log("Token With UserAccount: " + tokenB);
            res.render('room', {roomId: req.params.room,
                                token: tokenA,
                                channelName: channelName,
                                AgoraAppId: appID,
                                uid: uid,   
                                username: req.user.username,
                                screenToken: tokenB,
                                screenuid: req.user.googleId                   
                                });
          }
          else res.send("Team does not exist");}
          catch(err){
            return;
        }
    }else{
        res.redirect('/');
    }  
})


module.exports = router;