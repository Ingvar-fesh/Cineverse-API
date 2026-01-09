-- =============================================
-- 1. CLEANUP (Drop Existing Tables)
-- =============================================
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "review" CASCADE; -- Drop singular just in case
DROP TABLE IF EXISTS "movie_genres" CASCADE;
DROP TABLE IF EXISTS "movie_actors" CASCADE;
DROP TABLE IF EXISTS "movies" CASCADE;
DROP TABLE IF EXISTS "movie" CASCADE;
DROP TABLE IF EXISTS "actors" CASCADE;
DROP TABLE IF EXISTS "actor" CASCADE;
DROP TABLE IF EXISTS "genres" CASCADE;
DROP TABLE IF EXISTS "genre" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- =============================================
-- 2. SCHEMA CREATION (Matching Your Entities)
-- =============================================

-- Table: user (Singular, because @Entity() is used)
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

-- Table: genre
CREATE TABLE "genre" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);

-- Table: actor
CREATE TABLE "actor" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    "dateOfBirth" DATE  -- Quoted to match your entity property
);

-- Table: movie
CREATE TABLE "movie" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_date DATE NOT NULL,    -- Matches your entity's snake_case
    poster VARCHAR(255) DEFAULT 'no-poster.jpg',
    trailer_link VARCHAR(255) DEFAULT 'none' -- Matches your entity's snake_case
);

-- Table: review
CREATE TABLE "review" (
    id SERIAL PRIMARY KEY,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Matches entity camelCase
    "userId" INT REFERENCES "user"(id) ON DELETE CASCADE, -- Matches entity camelCase
    "movieId" INT REFERENCES "movie"(id) ON DELETE CASCADE -- Matches entity camelCase
);

-- Join Table: movie_genres
-- Your Movie entity defines this explicitly in @JoinTable
CREATE TABLE "movie_genres" (
    movie_id INT REFERENCES "movie"(id) ON DELETE CASCADE,
    genre_id INT REFERENCES "genre"(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- Join Table: movie_actors
-- Matches the code change I asked you to make above
CREATE TABLE "movie_actors" (
    "movieId" INT REFERENCES "movie"(id) ON DELETE CASCADE,
    "actorId" INT REFERENCES "actor"(id) ON DELETE CASCADE,
    PRIMARY KEY ("movieId", "actorId")
);

-- =============================================
-- 3. SEED DATA
-- =============================================

-- B. Genres
INSERT INTO "genre" (name, description) VALUES 
('Action', 'Fast-paced sequences and violence'),
('Sci-Fi', 'Futuristic concepts and space'),
('Drama', 'Serious narrative fiction'),
('Romance', 'Love and passion'),
('Horror', 'Scary and thrilling'),
('Comedy', 'Humorous stories'),
('Thriller', 'Suspense and excitement'),
('Fantasy', 'Magic and supernatural'),
('Animation', 'CGI or drawn visuals'),
('Adventure', 'Epic journeys');

-- C. Actors (Using "dateOfBirth")
INSERT INTO "actor" (name, "dateOfBirth") VALUES 
('Leonardo DiCaprio', '1974-11-11'),
('Kate Winslet', '1975-10-05'),
('Christian Bale', '1974-01-30'),
('Heath Ledger', '1979-04-04'),
('Robert Downey Jr.', '1965-04-04'),
('Chris Evans', '1981-06-13'),
('Scarlett Johansson', '1984-11-22'),
('Tom Hanks', '1956-07-09'),
('Brad Pitt', '1963-12-18'),
('Edward Norton', '1969-08-18'),
('Keanu Reeves', '1964-09-02'),
('Laurence Fishburne', '1961-07-30'),
('Elijah Wood', '1981-01-28'),
('Ian McKellen', '1939-05-25'),
('Morgan Freeman', '1937-06-01');

-- D. Movies
INSERT INTO "movie" (title, description, release_date, trailer_link) VALUES 
('Inception', 'Dream theft thriller', '2010-07-16', 'https://youtube.com/inception'),
('Titanic', 'Ship romance disaster', '1997-12-19', 'https://youtube.com/titanic'),
('The Dark Knight', 'Batman vs Joker', '2008-07-18', 'https://youtube.com/darkknight'),
('Avengers', 'Superheroes team up', '2012-05-04', 'https://youtube.com/avengers'),
('Forrest Gump', 'Life of a simple man', '1994-07-06', 'https://youtube.com/gump'),
('The Matrix', 'Reality is a simulation', '1999-03-31', 'https://youtube.com/matrix'),
('Fight Club', 'Underground fighting ring', '1999-10-15', 'https://youtube.com/fightclub'),
('Interstellar', 'Space travel to save earth', '2014-11-07', 'https://youtube.com/interstellar'),
('Parasite', 'Class struggle thriller', '2019-05-30', 'https://youtube.com/parasite'),
('The Lion King', 'Lion prince exile', '1994-06-15', 'https://youtube.com/lionking'),
('Gladiator', 'Roman general revenge', '2000-05-05', 'https://youtube.com/gladiator'),
('Pulp Fiction', 'Crime stories intertwined', '1994-10-14', 'https://youtube.com/pulpfiction'),
('The Godfather', 'Mob family saga', '1972-03-24', 'https://youtube.com/godfather'),
('Iron Man', 'Tech billionaire hero', '2008-05-02', 'https://youtube.com/ironman'),
('Joker', 'Origin of a villain', '2019-10-04', 'https://youtube.com/joker'),
('Toy Story', 'Toys come to life', '1995-11-22', 'https://youtube.com/toystory'),
('Frozen', 'Ice queen sister', '2013-11-27', 'https://youtube.com/frozen'),
('Spider-Man', 'Web slinging hero', '2002-05-03', 'https://youtube.com/spiderman'),
('Black Panther', 'Wakanda forever', '2018-02-16', 'https://youtube.com/blackpanther'),
('Coco', 'Day of the dead music', '2017-11-22', 'https://youtube.com/coco');

-- E. Linking Movies to Genres
INSERT INTO "movie_genres" (movie_id, genre_id) VALUES
(1, 2), (1, 1), -- Inception
(2, 4), (2, 3), -- Titanic
(3, 1), (3, 7), -- Dark Knight
(4, 1), (4, 2), -- Avengers
(5, 3), (5, 4), -- Forrest Gump
(6, 2), (6, 1), -- Matrix
(7, 3), (7, 7), -- Fight Club
(8, 2), (8, 10),-- Interstellar
(9, 7), (9, 3), -- Parasite
(10, 9), (10, 10), -- Lion King
(11, 1), (11, 3), -- Gladiator
(12, 7), (12, 3), -- Pulp Fiction
(13, 7), (13, 3), -- Godfather
(14, 1), (14, 2), -- Iron Man
(15, 3), (15, 7), -- Joker
(16, 9), (16, 6), -- Toy Story
(17, 9), (17, 10), -- Frozen
(18, 1), (18, 10), -- SpiderMan
(19, 1), (19, 2), -- Black Panther
(20, 9), (20, 6); -- Coco

-- F. Linking Movies to Actors
INSERT INTO "movie_actors" ("movieId", "actorId") VALUES
(1, 1), -- Inception -> DiCaprio
(2, 1), (2, 2), -- Titanic -> DiCaprio, Winslet
(3, 3), (3, 4), (3, 15), -- Dark Knight -> Bale, Ledger, Freeman
(4, 5), (4, 6), (4, 7), -- Avengers -> RDJ, Evans, Johansson
(5, 8), -- Forrest Gump -> Hanks
(6, 11), (6, 12), -- Matrix -> Reeves, Fishburne
(7, 9), (7, 10), -- Fight Club -> Pitt, Norton
(14, 5), -- Iron Man -> RDJ
(16, 8), -- Toy Story -> Hanks
(12, 12); -- Pulp Fiction -> Fishburne