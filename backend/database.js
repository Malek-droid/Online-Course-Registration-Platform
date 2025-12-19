import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'students.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

const createTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      course TEXT NOT NULL,
      experiencePrealable TEXT,
      createdAt TEXT NOT NULL
    )
  `;

    db.exec(sql);
    console.log('✅ Database initialized');
};

createTable();

export const getAllStudents = () => {
    const sql = 'SELECT * FROM students ORDER BY createdAt DESC';
    return db.prepare(sql).all();
};

export const addStudent = (student) => {
    const sql = `
    INSERT INTO students (name, email, course, experiencePrealable, createdAt)
    VALUES (@name, @email, @course, @experiencePrealable, @createdAt)
  `;

    const info = db.prepare(sql).run(student);
    return { id: info.lastInsertRowid, ...student };
};

export const emailExists = (email) => {
    const sql = 'SELECT email FROM students WHERE email = ?';
    const result = db.prepare(sql).get(email.toLowerCase());
    return !!result;
};

export const deleteStudentByEmail = (email) => {

    const sql = 'SELECT * FROM students WHERE email = ?';
    const student = db.prepare(sql).get(email.toLowerCase());

    if (!student) {
        return null;
    }


    const deleteSql = 'DELETE FROM students WHERE email = ?';
    db.prepare(deleteSql).run(email.toLowerCase());

    return student;
};

export default {
    getAllStudents,
    addStudent,
    emailExists,
    deleteStudentByEmail,
};
