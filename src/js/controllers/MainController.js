
module.exports = ($scope, $localStorage, ProcessAllData) => {
    $scope.dataStore = $localStorage;
    $scope.go = ProcessAllData.go;
};