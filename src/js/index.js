
angular.module('SteamAvgPct', ['tableSort', 'ui.bootstrap', 'ngStorage'])
    .constant('URLS', require('./constants/URLS'))
    .service('ProcessAllData', require('./services/ProcessAllData'))
    .service('VanityResolve', require('./services/VanityResolve'))
    .service('QueryData', require('./services/QueryData'))
    .controller('MainCtrl', require('./controllers/MainController'))
;