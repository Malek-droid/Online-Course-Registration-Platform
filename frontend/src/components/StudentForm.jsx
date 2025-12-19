import { useState } from 'react';

const COURSES = ['Math', 'Biology', 'History', 'Advanced Maths', 'Computer Science', 'Physics', 'Chemistry'];

function StudentForm({ onAddStudent }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: '',
        experiencePrealable: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showMathExperience = formData.course === 'Advanced Maths';

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.course) {
            newErrors.course = 'Please select a course';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const studentData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            course: formData.course,
        };


        if (showMathExperience && formData.experiencePrealable.trim()) {
            studentData.experiencePrealable = formData.experiencePrealable.trim();
        }

        const result = await onAddStudent(studentData);

        setIsSubmitting(false);

        if (result.success) {

            setFormData({
                name: '',
                email: '',
                course: '',
                experiencePrealable: ''
            });
            setErrors({});
        } else {
            setErrors({ submit: result.error });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300 animate-fade-in">
            <div className="card-body">
                <h2 className="card-title">Add new student</h2>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>


                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name <span className="text-error">*</span></span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`input input-bordered ${errors.name && "input-error"}`}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <span className="text-error text-sm">{errors.name}</span>
                        )}
                    </div>


                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email <span className="text-error">*</span></span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input input-bordered ${errors.email && "input-error"}`}
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <span className="text-error text-sm">{errors.email}</span>
                        )}
                    </div>


                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Course <span className="text-error">*</span></span>
                        </label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            className={`select select-bordered ${errors.course && "select-error"}`}
                            disabled={isSubmitting}
                        >
                            <option value="">Select a course</option>
                            {COURSES.map(course => (
                                <option key={course}>{course}</option>
                            ))}
                        </select>
                        {errors.course && (
                            <span className="text-error text-sm">{errors.course}</span>
                        )}
                    </div>


                    {showMathExperience && (
                        <div className="form-control animate-slide-in">
                            <label className="label">
                                <span className="label-text">Previous Experience</span>
                            </label>
                            <textarea
                                name="experiencePrealable"
                                value={formData.experiencePrealable}
                                onChange={handleChange}
                                className="textarea textarea-bordered"
                            />
                        </div>
                    )}


                    {errors.submit && (
                        <div className="alert alert-error">
                            <span>{errors.submit}</span>
                        </div>
                    )}


                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add student"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default StudentForm;
