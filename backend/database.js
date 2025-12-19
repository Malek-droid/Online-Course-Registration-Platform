const Database = require('better-sqlite3');
const path = require('path');

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

const getAllStudents = () => {
    const sql = 'SELECT * FROM students ORDER BY createdAt DESC';
    return db.prepare(sql).all();
};

const addStudent = (student) => {
    const sql = `
    INSERT INTO students (name, email, course, experiencePrealable, createdAt)
    VALUES (@name, @email, @course, @experiencePrealable, @createdAt)
  `;

    const info = db.prepare(sql).run(student);
    return { id: info.lastInsertRowid, ...student };
};

const emailExists = (email) => {
    const sql = 'SELECT email FROM students WHERE email = ?';
    const result = db.prepare(sql).get(email.toLowerCase());
    return !!result;
};

const deleteStudentByEmail = (email) => {

    const sql = 'SELECT * FROM students WHERE email = ?';
    const student = db.prepare(sql).get(email.toLowerCase());

    if (!student) {
        return null;
    }


    const deleteSql = 'DELETE FROM students WHERE email = ?';
    db.prepare(deleteSql).run(email.toLowerCase());

    return student;
};

module.exports = {
    getAllStudents,
    addStudent,
    emailExists,
    deleteStudentByEmail,
};
