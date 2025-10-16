
CREATE TABLE IF NOT EXISTS hewan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  jenis TEXT,
  umur INTEGER
);


INSERT INTO hewan (nama, jenis, umur) VALUES
('Bello', 'Anjing', 3),
('Mimi', 'Kucing', 2),
('They', 'Burung', 1);