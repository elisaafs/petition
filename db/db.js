const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:Elisa:elisa1@localhost:5432/petition");

exports.insertUser = function(firstName, lastName, signatures) {
    const q = `
          INSERT INTO signatures (first_name, last_name, signatures)
          VALUES ($1, $2, $3)
          RETURNING *
    `;
    const params = [firstName, lastName, signatures];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.registerUser = function(firstName, lastName, email, hashedPassword) {
    const q = `
          INSERT INTO users (first_name, last_name, email, hashed_password)
          VALUES ($1, $2, $3, $4)
          RETURNING *
    `;
    const params = [firstName, lastName, email, hashedPassword];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.returnAllUsers = function() {
    const q = `SELECT * FROM users;`;
    return db.query(q).then(results => {
        return results.rows;
    });
};

exports.getSigners = function() {
    return db.query("SELECT * FROM signatures;").then(results => {
        return results.rows;
    });
};

exports.getId = function(id) {
    const params = [id];
    return db
        .query("SELECT * FROM signatures WHERE id = $1;", params)
        .then(results => {
            return results.rows[0];
        });
};

exports.getInfo = function(email) {
    const q = `SELECT email, hashed_password FROM users WHERE email= $1;`;
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
