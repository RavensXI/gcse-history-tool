import { useState } from 'react';
import { Plus, Edit2, Check, X, Trash2 } from 'lucide-react';

export default function StudentRoster({ currentClass, currentStudents, classes, setClasses }) {
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editedName, setEditedName] = useState('');

  const addStudent = () => {
    if (newStudentName.trim()) {
      const newId = `${currentClass.replace(/\s+/g, '')}-${Date.now()}`;
      setClasses(prev => ({
        ...prev,
        [currentClass]: [
          ...prev[currentClass],
          { id: newId, name: newStudentName.trim() }
        ]
      }));
      setNewStudentName('');
    }
  };

  const updateStudent = (studentId) => {
    if (editedName.trim()) {
      setClasses(prev => ({
        ...prev,
        [currentClass]: prev[currentClass].map(s =>
          s.id === studentId ? { ...s, name: editedName.trim() } : s
        )
      }));
      setEditingStudent(null);
      setEditedName('');
    }
  };

  const deleteStudent = (studentId) => {
    if (window.confirm('Delete this student? Their assessment data will be preserved.')) {
      setClasses(prev => ({
        ...prev,
        [currentClass]: prev[currentClass].filter(s => s.id !== studentId)
      }));
    }
  };

  const startEdit = (student) => {
    setEditingStudent(student.id);
    setEditedName(student.name);
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setEditedName('');
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Student</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Enter student name"
            className="flex-1 input-field"
            onKeyPress={(e) => e.key === 'Enter' && addStudent()}
          />
          <button onClick={addStudent} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">
          Current Students ({currentStudents.length})
        </h3>
        
        {currentStudents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No students in this class yet. Add students using the form above.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentStudents.map(student => (
              <div key={student.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {editingStudent === student.id ? (
                  <>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded"
                      onKeyPress={(e) => e.key === 'Enter' && updateStudent(student.id)}
                      autoFocus
                    />
                    <button
                      onClick={() => updateStudent(student.id)}
                      className="p-1 text-green-600 hover:text-green-800"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{student.name}</span>
                    <button
                      onClick={() => startEdit(student)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteStudent(student.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}