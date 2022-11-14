CREATE TABLE voters(
    username VARCHAR(20) PRIMARY KEY,
    password VARCHAR(24) NOT NULL,
    addressLine1 VARCHAR(40) NOT NULL,
    addressLine2 VARCHAR(40),
    city VARCHAR(30) NOT NULL,
    state VARCHAR(20) NOT NULL,
    zip_code VARCHAR(5) NOT NULL
);