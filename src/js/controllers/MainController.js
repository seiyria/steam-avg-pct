
module.exports = ($scope, $localStorage, QueryData) => {
    $scope.dataStore = $localStorage;
    $scope.games = [];
    $scope.allGames = [];
    $scope.go = () => {
        $scope.loading = true;
        $scope.errorState = false;
        QueryData.go().then((games) => {
            $scope.allGames.push(...games);
            $scope.avgPct = (_.sum(games, 'percent') / games.length);
        }, () => {
            $scope.errorState = true;
        }).then(() => {
            $scope.loading = false;
        });
    };
};