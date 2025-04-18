-- Document created by Túlio Assis 2025
-- Database tables definitions
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  birth DATE,
  death DATE,
  id_country INT,
  FOREIGN KEY (id_country)
      REFERENCES countries(id)
      ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publishers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  id_country INT,
  FOREIGN KEY (id_country)
      REFERENCES countries(id)
      ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
  favorite BOOLEAN DEFAULT false,
	read BOOLEAN DEFAULT false,
	notes TEXT,
  id_publisher INT,
  id_country INT,
  FOREIGN KEY (id_publisher)
    REFERENCES publishers(id)
    ON DELETE SET NULL,
  FOREIGN KEY (id_country)
    REFERENCES countries(id)
    ON DELETE SET NULL,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authors_books (
  id_author INT,
  id_book INT,
  PRIMARY KEY (id_author, id_book),
  FOREIGN KEY (id_author)
    REFERENCES authors(id)
    ON DELETE CASCADE,
  FOREIGN KEY (id_book)
    REFERENCES books(id)
    ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert of initial data in order to test the database

INSERT INTO countries (name)
VALUES ('Brasil')
ON CONFLICT (name) DO NOTHING;

INSERT INTO authors (name, birth, death, id_country)
VALUES ('Graciliano Ramos', '1982-10-27', '1953-03-20', (SELECT id FROM countries WHERE name = 'Brasil'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO publishers (name, id_country)
VALUES ('Editora Record', (SELECT id FROM countries WHERE name = 'Brasil'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO books (name, id_publisher, id_country)
VALUES (
  'Vidas Secas',
  (SELECT id FROM publishers WHERE name = 'Editora Record'),
  (SELECT id FROM countries WHERE name = 'Brasil')
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO authors_books (id_author, id_book)
VALUES (
  (SELECT id FROM authors WHERE name = 'Graciliano Ramos'),
  (SELECT id FROM books WHERE name = 'Vidas Secas')
)
ON CONFLICT (name) DO NOTHING;
