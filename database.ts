import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("pfimobile.db");

export async function initDatabase() {
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    solde REAL DEFAULT 500
  );

  DROP TABLE IF EXISTS products;

  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description_en TEXT,
    description_fr TEXT
  );

  CREATE TABLE IF NOT EXISTS cart (
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (user_id, product_id),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS inventory (
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (user_id, product_id),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);
  const admin = await db.getFirstAsync("SELECT * FROM users WHERE role = 'admin'");

  if (!admin) {
    await db.runAsync(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      ["admin", "admin@pfi.com", "admin123", "admin"]
    );
  }

  const productCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM products"
  );

  if (productCount && productCount.count === 0) {
    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Finn's Sword", "Épée de Finn", 100, "finn_sword", "A heroic sword.", "Une épée héroïque."]
    );

    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Ice Crown", "Couronne de glace", 350, "icecrown", "A magical ice crown.", "Une couronne de glace magique."]
    );

    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Marceline Guitar", "Guitare de Marceline", 80, "marceline_guitar", "A vampire queen guitar.", "La guitare d'une reine vampire."]
    );

    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Billy Sword", "Épée de Billy", 50, "billy_sword", "A legendary warrior sword.", "Une épée de guerrier légendaire."]
    );

    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Jake's Legendary Sandwich", "Sandwich Légendaire de Jake", 30, "jakes_sandwich", "A perfect magical sandwich.", "Un sandwich magique parfait."]
    );

    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Thumb Armor", "Armure pour le pouce", 40, "thumb_armor", "Tiny but powerful armor.", "Petite mais puissante armure."]
    );

    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Enchiridion", "Enchiridion", 200, "enchiridion", "A book of heroic knowledge.", "Un livre de savoir héroïque."]
    );

    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      ["Demon Blood Sword", "Épée sanguinaire de démon", 500, "demon_blood_sword", "A powerful demonic sword.", "Une puissante épée démoniaque."]
    );
  }
}

export default db;