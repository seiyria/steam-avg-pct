
angular.module('SteamAvgPct', ['smart-table', 'ui.bootstrap', 'ngStorage'])
    .filter('TableFilter', require('./filters/TableFilter'))
    .directive('checkFilter', require('./directives/CheckFilter'))
    .service('QueryData', require('./services/QueryData'))
    .controller('MainCtrl', require('./controllers/MainController'))
;