import { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import StudentsTable from './components/StudentsTable';

const API_URL = '/api';

function App() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDeleted, setLastDeleted] = useState(null);


    const fetchStudents = async () => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/students`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);


    const addStudent = async (studentData) => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details?.[0] || 'Failed to add student');
            }

            setStudents([data, ...students]);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };


    const deleteStudent = async (email) => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}/students/${encodeURIComponent(email)}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details?.[0] || 'Failed to delete student');
            }

            setStudents(students.filter(s => s.email !== email));
            setLastDeleted(data.student);


            setTimeout(() => setLastDeleted(null), 10000);

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };


    const undoDelete = async () => {
        if (!lastDeleted) return;

        const result = await addStudent(lastDeleted);
        if (result.success) {
            setLastDeleted(null);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">

            <header className="navbar bg-base-100 px-6 border-b border-base-300 shadow-sm">
                <div className="flex-1 flex justify-center">
                    <h1 className="text-3xl font-bold text-base-content">Online Course Registration Platform</h1>
                </div>
            </header>

            <main className="container mx-auto p-6 space-y-6 max-w-5xl">


                {error && (
                    <div className="alert alert-error shadow-lg">
                        <span>{error}</span>
                        <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>✕</button>
                    </div>
                )}


                {lastDeleted && (
                    <div className="alert alert-info shadow-lg">
                        <span>Student "{lastDeleted.name}" deleted</span>
                        <button className="btn btn-sm btn-primary" onClick={undoDelete}>
                            Undo
                        </button>
                    </div>
                )}


                <StudentForm onAddStudent={addStudent} />


                <StudentsTable
                    students={students}
                    onDeleteStudent={deleteStudent}
                    loading={loading}
                />

            </main>

            <footer className="footer footer-center p-4 bg-base-200 text-base-content">
                <p>© 2025 Online Course Registration Platform - Made with ❤️ by Malek Ben Salah</p>
            </footer>
        </div>
    );
}

export default App;
