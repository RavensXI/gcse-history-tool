import { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';

export default function ClassManagement({ 
  classes, 
  setClasses, 
  currentClass, 
  setCurrentClass,
  assessments,
  setAssessments 
}) {
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const addClass = () => {
    if (newClassName.trim()) {
      setClasses(prev => ({
        ...prev,
        [newClassName.trim()]: []
      }));
      setCurrentClass(newClassName.trim());
      setNewClassName('');
      setShowAddClass(false);
    }
  };

  const removeClass = (className) => {
    if (window.confirm(`Delete class "${className}"? This will also delete all assessments for this class.`)) {
      setClasses(prev => {
        const updated = { ...prev };
        delete updated[className];
        return updated;
      });
      setAssessments(prev => prev.filter(a => a.class !== className));
      if (currentClass === className) {
        setCurrentClass(Object.keys(classes)[0] || '');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Class Management
        </h2>
        <button
          onClick={() => setShowAddClass(!showAddClass)}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {showAddClass && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="New class name (e.g., Year 11 2025-26)"
            className="flex-1 input-field"
            onKeyPress={(e) => e.key === 'Enter' && addClass()}
          />
          <button onClick={addClass} className="btn-primary">
            Add
          </button>
          <button 
            onClick={() => {
              setShowAddClass(false);
              setNewClassName('');
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {Object.keys(classes).map(className => (
          <div key={className} className="relative group">
            <button
              onClick={() => setCurrentClass(className)}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentClass === className
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {className} ({classes[className].length})
            </button>
            {Object.keys(classes).length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeClass(className);
                }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}