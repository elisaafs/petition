exports.isStringANumber = function(string) {
    // important to only use == instead of === here
    return parseInt(string) == string;
};
