
module.exports = ($q) => {
    let defer = $q.defer();

    return {
        watcher: defer.promise,
        update: (msg) => {
            defer.notify(msg);
        }
    };
};