const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:Elisa:elisa1@localhost:5432/petition");

exports.getSigners = function() {
    return db.query("SELECT * FROM signatures;").then(results => {
        var numberOfRows = results.rows.length;
        return numberOfRows;
    });
};
exports.insertUser = function(firstname, lastname, signature) {
    const q = `
        INSERT INTO signatures (first_name, last_name, signature)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const params = [firstname, lastname, signature];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getName = function() {
    return db.query("SELECT first_name FROM signatures;").then(results => {
        console.log(results.rows);
        return results.rows;
    });
};
