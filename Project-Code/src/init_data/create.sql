/* User Table */
CREATE TABLE user(
    username PRIMARY KEY,
    password CHAR(24) NOT NULL,
    addressLine1 VARCHAR(40) NOT NULL,
    addressLine2 VARCHAR(40),
    city VARCHAR(30),
    state VARCHAR(20),
    zip_code SMALLINT
);