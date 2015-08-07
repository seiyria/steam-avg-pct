
module.exports = () => {
    return (array, predicate) => {
        let ret = [];

        _.each(array, (obj) => {
            if(obj.complete && predicate.complete) ret.push(obj);
            if(obj.above && predicate.above) ret.push(obj);
            if(obj.below && predicate.below) ret.push(obj);
        });

        console.log(ret, predicate);

        return ret;
    };
};