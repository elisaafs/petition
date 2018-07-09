const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:Elisa:elisa1@localhost:5432/petition");

exports.insertSignature = function(userId, signature) {
    const q = `
          INSERT INTO signatures (user_id, signature)
          VALUES ($1, $2)
          RETURNING *
    `;
    const params = [userId, signature];
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

exports.insertInfoUsers = function(userId, age, areaOfBerlin, homepage) {
    const q = `
          INSERT INTO profiles (user_id, age, area_of_berlin, homepage)
          VALUES ($1, $2, $3, $4)
          RETURNING *
    `;
    const params = [userId, age, areaOfBerlin, homepage];
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
    return db
        .query("SELECT first_name, last_name FROM users;")
        .then(results => {
            return results.rows;
        });
};

exports.getSignersInfo = function() {
    const q = `
        SELECT * FROM signatures
        INNER JOIN profiles
        ON signatures.user_id = profiles.user_id;
        `;
    return db.query(q).then(results => {
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
    const q = `SELECT email, hashed_password, id FROM users WHERE email= $1;`;
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getAreaOfBerlin = function(areaOfBerlin) {
    const params = [areaOfBerlin];
    const q = `
        SELECT * FROM users
        INNER JOIN profiles ON profiles.user_id = users.id
        WHERE LOWER(profiles.area_of_berlin)=LOWER($1);
        `;
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.getList = function() {
    const q = `
        SELECT * FROM users
        INNER JOIN profiles ON profiles.user_id = users.id
        INNER JOIN signatures ON signatures.user_id = users.id;
        `;
    return db.query(q).then(results => {
        console.log("getList", results);
        return results.rows;
    });
};
