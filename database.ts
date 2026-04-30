import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("pfimobile.db");

async function addColumnIfMissing(table: string, column: string, definition: string) {
  try {
    await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  } catch {
    // La colonne existe déjà, on ignore.
  }
}

export async function initDatabase() {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      solde REAL DEFAULT 500
    );
  `);

  await addColumnIfMissing("users", "username", "TEXT");
  await addColumnIfMissing("users", "solde", "REAL DEFAULT 500");
  await addColumnIfMissing("products", "visible", "INTEGER DEFAULT 1");

  await db.execAsync(`
    DROP TABLE IF EXISTS products;

    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_fr TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      description_en TEXT,
      description_fr TEXT,
      visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS cart (
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory (
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  const admin = await db.getFirstAsync(
    "SELECT * FROM users WHERE role = 'admin'"
  );

  if (!admin) {
    await db.runAsync(
      "INSERT INTO users (username, email, password, role, solde) VALUES (?, ?, ?, ?, ?)",
      ["admin", "admin@pfi.com", "admin123", "admin", 9999]
    );
  }

  const products = [
    ["Finn's Sword", "Épée de Finn", 100, "finn_sword", "A heroic sword.", "Une épée héroïque."],
    ["Ice Crown", "Couronne de glace", 350, "icecrown", "A magical ice crown.", "Une couronne de glace magique."],
    ["Marceline Guitar", "Guitare de Marceline", 80, "marceline_guitar", "A vampire queen guitar.", "La guitare d'une reine vampire."],
    ["Billy Sword", "Épée de Billy", 50, "billy_sword", "A legendary warrior sword.", "Une épée de guerrier légendaire."],
    ["Jake's Legendary Sandwich", "Sandwich Légendaire de Jake", 30, "jakes_sandwich", "A perfect magical sandwich.", "Un sandwich magique parfait."],
    ["Thumb Armor", "Armure pour le pouce", 40, "thumb_armor", "Tiny but powerful armor.", "Petite mais puissante armure."],
    ["Enchiridion", "Enchiridion", 200, "enchiridion", "A book of heroic knowledge.", "Un livre de savoir héroïque."],
    ["Demon Blood Sword", "Épée sanguinaire de démon", 500, "demon_blood_sword", "A powerful demonic sword.", "Une puissante épée démoniaque."]
  ];

  for (const product of products) {
    await db.runAsync(
      "INSERT INTO products (name_en, name_fr, price, image, description_en, description_fr) VALUES (?, ?, ?, ?, ?, ?)",
      product
    );
  }
}

export default db;