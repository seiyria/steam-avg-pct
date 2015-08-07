//this script is designed for use on webtask.io

var q = require('q');
var request = require('superagent');
var _ = require('lodash');

// this needs to be set via ENV
var API_KEY = '';

var STEAM_URL = {
    VANITY: 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/',
    ACHIEVEMENTS: 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
    ALL_GAMES: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/'
};

var quit = function() {
    process.exit(0);
};

var reqObj = function() {
    return {
        key: API_KEY,
        format: 'json'
    };
};

var vanityResolve = function(argv) {
    console.log('resolving username from ' + argv.username);
    var defer = q.defer();

    var username = argv.username;

    if(!username) {
        quit();
    }

    if(!_.isNaN(+username)) {
        return q(username);
    }

    var requestObj = reqObj();
    requestObj.vanityurl = username;

    request
        .get(STEAM_URL.VANITY)
        .query(requestObj)
        .end(function(e, res) {
            if(e) {
                console.error(e);
                quit();
            }
            defer.resolve(res.body.response.steamid);
        });

    return defer.promise;
};

var getGames = function(steamid) {
    console.log('getting games for ' + steamid);
    var defer = q.defer();

    var requestObj = reqObj();
    requestObj.steamid = steamid;
    requestObj.include_played_free_games = 1;
    requestObj.include_appinfo = 1;

    request
        .get(STEAM_URL.ALL_GAMES)
        .query(requestObj)
        .end(function(e, res) {
            if(e) {
                console.error(e);
                quit();
            }

            var body = res.body.response;

            if(!body.games) {
                quit();
            }

            defer.resolve(res.body.response.games);
        });

    return defer.promise;
};

var aggregateAchievements = function(steamid, games) {
    console.log('aggregating achievements; ' + games.length + ' games');
    var promises = [];

    _.forEach(games, function(game) {
        var defer = q.defer();
        promises.push(defer.promise);

        var requestObj = reqObj();
        requestObj.steamid = steamid;
        requestObj.appid = game.appid;

        request
            .get(STEAM_URL.ACHIEVEMENTS)
            .query(requestObj)
            .end(function(e, res) {
                if(e) {
                    //swallow errors here, they don't matter
                    return defer.resolve({max: 0, earned: 0});
                }
                var body = res.body.playerstats;

                if(body.error || !body.achievements) {
                    return defer.resolve({max: 0, earned: 0});
                }

                defer.resolve({
                    name: body.gameName,
                    icon: game.img_icon_url,
                    logo: game.img_logo_url,
                    appid: game.appid,
                    max: body.achievements.length,
                    earned: body.achievements.reduce(function(prev, cur) { return prev + cur.achieved; }, 0)
                });
            });
    });

    return q.all(promises);
};

var countAchievements = function(achievements) {
    console.log('counting achievements');

    var countedAchievements = _.filter(achievements, function(game) { return game.earned > 0; });

    _.each(countedAchievements, function(achievement) {
        achievement.percent = achievement.earned/achievement.max * 100;
    });

    return countedAchievements;
};

var doWork = function(context, callback) {
    API_KEY = context.data.API_KEY;
    vanityResolve(context.data)
        .then(function(id) {
            return getGames(id)
                .then(function(games) {
                    return aggregateAchievements(id, games);
                })
                .then(countAchievements)
                .then(function(countedGames) {
                    callback(null, {games: countedGames});
                });
        })
        .catch(function(e) { console.log(e); });
};

module.exports = doWork;