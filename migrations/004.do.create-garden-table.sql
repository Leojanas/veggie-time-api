DROP TABLE IF EXISTS garden;

CREATE TABLE garden (
    user_id INTEGER REFERENCES users(id) NOT NULL,
    veggie_id INTEGER REFERENCES veggies(id) NOT NULL,
    plant_date DATE
);