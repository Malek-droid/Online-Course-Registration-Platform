const { getAllStudents } = require('./database');

try {
    const students = getAllStudents();
    console.log('\n--- QCMedic Students Database ---\n');
    console.table(students);
    console.log(`\nTotal students: ${students.length}\n`);
} catch (error) {
    console.error('Error reading database:', error.message);
}
