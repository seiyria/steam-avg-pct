
module.exports = () => ({
    restrict: 'E',
    scope: {
        predicate: '@',
        checked: '='
    },
    require: '^stTable',
    template: '<input type="checkbox" ng-model="sel" ng-change="change()" />',
    link: (scope, element, attr, ctrl) => {
        scope.sel = scope.checked;
        scope.change = () => {
            ctrl.search(scope.sel, scope.predicate);
        };
        scope.change();
    }
});