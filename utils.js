exports.isStringANumber = function(string) {
    // important to only use == instead of === here
    return parseInt(string) == string;
};

exports.sanitizeHomepageUrl = function(url) {
    if (url.indexOf("://") >= 0) {
        return url;
    }

    return "https://" + url;
};
