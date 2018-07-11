const spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(`postgres:Elisa:elisa1@localhost:5432/petition`);
}

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
        .query(
            `SELECT first_name, last_name FROM users
            INNER JOIN signatures ON signatures.user_id=users.id;`
        )
        .then(results => {
            console.log(results);
            return results.rows;
        });
};

exports.getSignatureByUserId = function(userId) {
    const q = `SELECT * FROM signatures WHERE user_id=$1;`;
    const params = [userId];
    return db.query(q, params).then(results => {
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

exports.getInfoToEditProfile = function(userId) {
    const q = `SELECT users.first_name, users.last_name, users.email, users.hashed_password, profiles.age, profiles.area_of_berlin, profiles.homepage
         FROM users
         LEFT JOIN profiles ON profiles.user_id = users.id
         WHERE users.id = $1;`;
    const params = [userId];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.deleteSignature = function(userId) {
    const q = `DELETE FROM signatures WHERE user_id = $1;`;
    const params = [userId];
    return db.query(q, params).then(deletedSignature => {
        return deletedSignature;
    });
};

exports.editProfile = function(userId, age, areaOfBerlin, homepage) {
    const q = `INSERT INTO profiles (age, area_of_berlin, homepage, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, area_of_berlin = $2, homepage = $3 WHERE profiles.user_id =$4
    RETURNING *;`;
    const params = [age || null, areaOfBerlin, homepage, userId];

    return db.query(q, params).then(results => {
        console.log(results.rows[0]);
        return results.rows[0];
    });
};

exports.editUser = function(
    firstName,
    lastName,
    email,
    hashedPassword,
    userId
) {
    const q = `UPDATE users SET first_name = $1, last_name = $2, email = $3, hashed_password = $4 WHERE id = $5
    RETURNING id, first_name, last_name, email;`;

    const params = [firstName, lastName, email, hashedPassword, userId];
    console.log(params);
    return db.query(q, params).then(results => {
        console.log(results.rows[0]);
        return results.rows[0];
    });
};
