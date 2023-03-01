// Création d'une table dans la base de donnée pour stocker les tokens qui ne sont plus valide grâce au package npm
// const dotenv = require("dotenv").config();
// const Keyv = require("@keyv/mysql");
// const keyv = new Keyv("mysql://" + process.env.KEYV_PARAM);
//
// exports.set = (key, value, ttl) => keyv.set(key, value, ttl);
// exports.get = (key) => keyv.get(key);
// exports.del = (key) => keyv.delete(key);

const dotenv = require("dotenv").config();
const Keyv = require("@keyv/postgres");
const keyv = new Keyv(process.env.DATABASE_URL);

exports.set = (key, value, ttl) => keyv.set(key, value, ttl);
exports.get = (key) => keyv.get(key);
exports.del = (key) => keyv.delete(key);


const cache = require("./cache.js");

// Set a value in the cache with a TTL of 60 seconds
cache.set("mykey", "myvalue", 60)
    .then(() => console.log("Value set in cache"))
    .catch((err) => console.error("Error setting value in cache", err));

// Get a value from the cache
cache.get("mykey")
    .then((value) => console.log("Value retrieved from cache", value))
    .catch((err) => console.error("Error getting value from cache", err));

// Delete a value from the cache
cache.del("mykey")
    .then(() => console.log("Value deleted from cache"))
    .catch((err) => console.error("Error deleting value from cache", err));
