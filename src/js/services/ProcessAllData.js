
module.exports = ($q, $localStorage, QueryData, VanityResolve) => {
    return {
        go: () => {
            let defer = $q.defer();

            if(!$localStorage.apiKey) {
                return defer.reject({ msg: 'No API key specified.' });
            }

            QueryData.key = $localStorage.apiKey;

            VanityResolve.go().then((steamId) => {
                QueryData.steamid = steamId;
                console.log(steamId);
            });

            return defer.promise;
        }
    };
};