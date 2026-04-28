import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("pfimobile.db");


//REAL est comme MONEY dans SSMS, c'est un nombre a virgule flottant
//AUTOINCREMENT est comme IDENTITY(1,1) dans SSMS, c'est un entier qui s'incrémente automatiquement à chaque nouvel enregistrement
export async function initDatabase() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      description TEXT
    );
  `);

  // Creer un utilisateur admin par défaut s'il n'existe pas déjà
  const admin = await db.getFirstAsync("SELECT * FROM users WHERE role = 'admin'");
  if (!admin) {
    await db.runAsync(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      ["admin@pfi.com", "admin123", "admin"]
    );
  }
}

export default db;