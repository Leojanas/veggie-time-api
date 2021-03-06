DROP TABLE IF EXISTS garden;

CREATE TABLE garden (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    veggie_id INTEGER REFERENCES veggies(id) NOT NULL,
    plant_date DATE
);