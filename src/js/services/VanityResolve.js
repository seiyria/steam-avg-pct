
module.exports = ($q, $http, $localStorage, URLS, QueryData) => {
    return {
        go: () => {
            let defer = $q.defer();

            let testKey = $localStorage.steamId;

            if(!_.isNaN(parseInt(testKey))) {
                return $q(testKey);
            }

            let params = _.clone(QueryData);
            params.vanityurl = testKey;

            $http.jsonp(URLS.STEAM_URL.VANITY, { params: params })
                .then((res) => {
                    defer.resolve(res.data.steamid);
                });

            return defer.promise;
        }
    };
};