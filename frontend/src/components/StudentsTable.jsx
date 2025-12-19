import { useState, useMemo } from 'react';

const COURSE_COLORS = {
    'Math': 'badge-primary',
    'Biology': 'badge-secondary',
    'History': 'badge-accent',
    'Advanced Maths': 'badge-info',
    'Computer Science': 'badge-success',
    'Physics': 'badge-warning',
    'Chemistry': 'badge-error',
};

function StudentsTable({ students, onDeleteStudent, loading }) {
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [deletingEmail, setDeletingEmail] = useState(null);


    const sortedStudents = useMemo(() => {
        const sorted = [...students].sort((a, b) => {
            const aValue = a[sortBy].toLowerCase();
            const bValue = b[sortBy].toLowerCase();

            if (sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

        return sorted;
    }, [students, sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {

            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {

            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleDelete = async (email) => {
        if (!confirm(`Are you sure you want to delete student with email "${email}"?`)) {
            return;
        }

        setDeletingEmail(email);
        await onDeleteStudent(email);
        setDeletingEmail(null);
    };

    if (loading) {
        return (
            <div className="card bg-base-100 shadow-xl border border-base-300 animate-fade-in text-center p-10">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4">Loading students...</p>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="card bg-base-100 shadow-xl border border-base-300 animate-fade-in text-center p-10">
                <h3 className="text-2xl font-bold opacity-50">No students yet</h3>
                <p>Add your first student using the form above!</p>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300 animate-fade-in">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h2 className="card-title">Students</h2>
                    <span className="badge badge-primary">
                        {students.length} student{students.length !== 1 && "s"}
                    </span>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>
                                    <button className="btn btn-ghost btn-xs" onClick={() => handleSort("name")}>
                                        Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </button>
                                </th>
                                <th>
                                    <button className="btn btn-ghost btn-xs" onClick={() => handleSort("email")}>
                                        Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </button>
                                </th>
                                <th>Course</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStudents.map(student => (
                                <tr key={student.email}>
                                    <td>{student.name}</td>
                                    <td className="font-mono text-sm">{student.email}</td>
                                    <td>
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`badge ${COURSE_COLORS[student.course] || 'badge-ghost'} text-white`}>
                                                {student.course}
                                            </span>
                                            {student.experiencePrealable && (
                                                <span className="text-xs opacity-70 italic">
                                                    📝 {student.experiencePrealable}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() => handleDelete(student.email)}
                                            disabled={deletingEmail === student.email}
                                        >
                                            {deletingEmail === student.email ? "..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}

export default StudentsTable;
