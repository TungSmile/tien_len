 var Linker = require("Linker");

// import { Global, LoginType } from "./../../../script/base/Global";
var SdkBoxUtil = require('SdkBoxUtil');
module.exports = {
    initSDK: function () {
        console.log("initSDK");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }
        this.sdkboxPlayInit();
        this.facebookInit();
        // this.btnShareFB();

    },
    sdkboxPlayInit: function () {
        console.log("sdkboxPlayInit");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            var plugin = sdkbox.PluginSdkboxPlay
            plugin.setListener({
                onConnectionStatusChanged: function (connection_status) {
                    console.log("connection status change: " + connection_status + " connection_status");
                    if (connection_status == 1000) {
                        console.log('Player id: ' + plugin.getPlayerId());
                        console.log('Player name: ' + plugin.getPlayerAccountField("name"));
                        // me.info.setString("connection status: " + connection_status + " " + plugin.getPlayerId() + " " + plugin.getPlayerAccountField("name") + "(" + plugin.getPlayerAccountField("display_name") + ")");
                    } else {
                        console.log('Not connected. Status: ' + connection_status);
                        // me.info.setString("Not connected. Status: " + connection_status);
                    }
                },
                onScoreSubmitted: function (leaderboard_name, score, maxScoreAllTime, maxScoreWeek, maxScoreToday) {
                    console.log('onScoreSubmitted trigger leaderboard_name:' + leaderboard_name + ' score:' + score + ' maxScoreAllTime:' + maxScoreAllTime + ' maxScoreWeek:' + maxScoreWeek + ' maxScoreToday:' + maxScoreToday);
                },
                onMyScore: function (leaderboard_name, time_span, collection_type, score) {
                    console.log('onMyScore trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' score:' + score);
                },
                onMyScoreError: function (leaderboard_name, time_span, collection_type, error_code, error_description) {
                    console.log('onMyScoreError trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onPlayerCenteredScores: function (leaderboard_name, time_span, collection_type, json_with_score_entries) {
                    console.log('onPlayerCenteredScores trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' json_with_score_entries:' + json_with_score_entries);
                },
                onPlayerCenteredScoresError: function (leaderboard_name, time_span, collection_type, error_code, error_description) {
                    console.log('onPlayerCenteredScoresError trigger leaderboard_name:' + leaderboard_name + ' time_span:' + time_span + ' collection_type:' + collection_type + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onIncrementalAchievementUnlocked: function (achievement_name) {
                    console.log("incremental achievement " + achievement_name + " unlocked.");
                },
                onIncrementalAchievementStep: function (achievement_name, step) {
                    console.log("incremental achievent " + achievement_name + " step: " + step);
                },
                onIncrementalAchievementStepError: function (name, steps, error_code, error_description) {
                    console.log('onIncrementalAchievementStepError trigger leaderboard_name:' + name + ' steps:' + steps + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onAchievementUnlocked: function (achievement_name, newlyUnlocked) {
                    console.log('onAchievementUnlocked trigger achievement_name:' + achievement_name + ' newlyUnlocked:' + newlyUnlocked);
                },
                onAchievementUnlockError: function (achievement_name, error_code, error_description) {
                    console.log('onAchievementUnlockError trigger achievement_name:' + achievement_name + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onAchievementsLoaded: function (reload_forced, json_achievements_info) {
                    console.log('onAchievementsLoaded trigger reload_forced:' + reload_forced + ' json_achievements_info:' + json_achievements_info);
                },
                onSetSteps: function (name, steps) {
                    console.log('onSetSteps trigger name:' + name + ' steps:' + steps);
                },
                onSetStepsError: function (name, steps, error_code, error_description) {
                    console.log('onSetStepsError trigger name:' + name + ' steps:' + steps + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onReveal: function (name) {
                    console.log('onReveal trigger name:' + name);
                },
                onRevealError: function (name, error_code, error_description) {
                    console.log('onRevealError trigger name:' + name + ' error_code:' + error_code + ' error_description:' + error_description);
                },
                onGameData: function (action, name, data, error) {
                    if (error) {
                        // failed
                        console.log('onGameData failed:' + error);
                    } else {
                        //success
                        if ('load' == action) {
                            console.log('onGameData load:' + name + ':' + data);
                        } else if ('save' == action) {
                            console.log('onGameData save:' + name + ':' + data);
                        } else {
                            console.log('onGameData unknown action:' + action);
                        }
                    }
                }
            });
            plugin.init();

            // ref to http://discuss.cocos2d-x.org/t/sdkbox-play-savegamedata-error/39367
            //plugin.saveGameData("name", 'test'); // crash here ?

        } else {
            // printf("no plugin init")
        }


    },


    googleLogin: function () {
        console.log("googleLogin");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }
        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            var plugin = sdkbox.PluginSdkboxPlay;
            console.log("sdkbox isConnected", plugin.isConnected());
            if (plugin.isSignedIn()) {
                console.log("sdkbox isSignedIn");
                plugin.signout();
            } else {
                console.log("sdkbox signin");
                plugin.signin();
            }
            console.log("sdkbox getPlayerId", plugin.getPlayerId());
        }
    },
    loginFb() {
        console.log("loginFb");
        //test loginfb
        // var datasss = '{"id":"2702504596730602","name":"Nguyễn Thúy Hằng","email":"thienychan@gmail.com","first_name":"Nguyễn Thúy","installed":true,"last_name":"Hằng","picture":{"data":{"url":"https:\/\/platform-lookaside.fbsbx.com\/platform\/profilepic\/?asid=2702504596730602&height=50&width=50&ext=1611977659&hash=AeTfvXBCdQ9MLD1puZo"}}}';
        // this.onAPI("ok",datasss);
        //end test loginfb
        if (typeof sdkbox !== "undefined") {
            //sdkbox.PluginFacebook.requestReadPermissions(["public_profile"]);
            if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
                console.log("vao dayloginFb:" + sdkbox.PluginFacebook.isLoggedIn());

                sdkbox.PluginFacebook.requestReadPermissions(["public_profile", "email"]);


                if (sdkbox.PluginFacebook.isLoggedIn()) {


                    var token = sdkbox.PluginFacebook.getAccessToken();
                    var userId = sdkbox.PluginFacebook.getUserID();
                    var params = new Object();
                    params["fields"] = "id,name,email,first_name,installed,last_name,picture{url}";
                    sdkbox.PluginFacebook.api("/me", "GET", params, "/me");

                    // Linker.system.Event.DispatchEvent("token", {
                    //     token: token,
                    //     userId: userId
                    // });
                } else {
                    sdkbox.PluginFacebook.login();
                }
            }
        } else {
            console.log("sdkbox is not exist")
        }
    },
    logoutFb() {
        if (typeof sdkbox !== "undefined") {
            sdkbox.PluginFacebook.logout();
        }
        Linker.isFb = false;


    },
    onAPI: function (tag, data) {//test login fb
        console.log("onAPI");
        console.log("tag:", tag);
        console.log("data:", data);
        console.log("data:", JSON.stringify(data));
        var token = "2134223423523534";
        var userId = 13432543463456;
        Linker.system.Event.DispatchEvent("token", {
            token: token,
            userId: userId,
            data: data
        });
    },
    submitCore: function (money) {
        console.log("submitCore:" + money);
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist");
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            console.log("ok send submitCore");
            sdkbox.PluginSdkboxPlay.submitScore("ldb1", money);
        }
    },
    showLeaderboard: function () {
        console.log("showLeaderboard");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist");
            return
        }

        if ("undefined" != typeof (sdkbox.PluginSdkboxPlay)) {
            console.log("vao showLeaderboard");
            var plugin = sdkbox.PluginSdkboxPlay;
            if (!plugin.isSignedIn()) {
                this.googleLogin();
            }
            plugin.showLeaderboard("ldb1");
        }
    },
    
    facebookInit: function () {
        console.log("facebookInit");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof (sdkbox.PluginFacebook)) {
            sdkbox.PluginFacebook.init();
            sdkbox.PluginFacebook.setListener({
                onLogin: function (isLogin, msg) {
                    if (isLogin) {
                        console.log("login successful");

                    }
                    else {
                        console.log("login failed");
                    }
                },
                onAPI: function (tag, data) {
                    console.log("onAPI:",data)
                },
                onSharedSuccess: function (data) {
                    console.log("share successful");
                },
                onSharedFailed: function (data) {
                    console.log("share failed");
                },
                onSharedCancel: function () {
                    console.log("share canceled");
                },
                onPermission: function (isLogin, msg) {
                    if (isLogin) {
                        console.log("request permission successful");
                    }
                    else {
                        console.log("request permission failed");
                    }
                },
                onFetchFriends: function (ok, msg) {
                   

                },
                onRequestInvitableFriends: function (friendsData) {
                    // console.log(JSON.stringify(friendsData));

                    // var friends = friendsData["data"];
                    // if (friends.length > 0) {
                    //     self.invitableFBUserID = friends["uid"];
                    // }
                },
                onInviteFriendsWithInviteIdsResult: function (result, description) {
                    // console.log("onInviteFriendsWithInviteIdsResult result=" + (result ? "ok" : "error") + " " + description);
                },
                onInviteFriendsResult: function (result, description) {
                    // console.log("onInviteFriendsResult result=" + (result ? "ok" : "error") + " " + description);
                }
                
            });
        }
    },
    btnShareFB: function () {
        console.log("btnShareFB");
        Linker.showMessage("Share game....");
        if ("undefined" == typeof (sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }


        // var str = "Onet Animal Wow: https://play.google.com/store/apps/details?id=#";
        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareData", "(Ljava/lang/String;)V",str);
        if (typeof sdkbox !== "undefined" && "undefined" != typeof (sdkbox.PluginFacebook)) {
            if (!sdkbox.PluginFacebook.isLoggedIn()) {
                this.loginFb();
            }

        }

        var info = new Object();
        info.type = "link";
        info.link = (Linker.Config && Linker.Config.shareLink) ? Linker.Config.shareLink :"https://play.google.com/store/apps/details?id=thieny.tienlen.miennam";
        info.title = "Tiến Lên Thiên Ý";
        info.text = "Tiến Lên Thiên Ý";
        info.image = "http://tienlen.chanthieny.com/logo.png";
        sdkbox.PluginFacebook.dialog(info);


    },
}