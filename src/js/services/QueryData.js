
module.exports = ($localStorage, $http) => {
    const url = 'https://webtask.it.auth0.com/api/run/wt-kyle-seiyria_com-0/steamcalc?webtask_no_cache=1';
    return {
        go: () => {
            return $http.get(url, {
                params: { username: $localStorage.username }
            }).then((res) => {
                let games = res.data.games;
                let avgPct = (_.sum(games, 'percent') / games.length);

                _.each(games, function(achievement) {
                    achievement.percent = achievement.earned/achievement.max * 100;
                    if(achievement.percent === 100) achievement.complete = true;
                    if(achievement.percent < avgPct) achievement.below = true;
                    if(achievement.percent >= avgPct && achievement.percent !== 100) achievement.above = true;
                });
                return _.sortBy(games, 'percent');
            });
        }
    };
};