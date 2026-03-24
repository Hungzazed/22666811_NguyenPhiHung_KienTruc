CREATE DATABASE mydb;

\c mydb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100)
);

INSERT INTO users (name, email)
VALUES ('Nguyen Van A', 'a@gmail.com'),
       ('Tran Thi B', 'b@gmail.com');