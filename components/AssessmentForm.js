import { useState, useEffect, useMemo } from 'react';
import { Save, FileText, Calendar } from 'lucide-react';

export default function AssessmentForm({ 
  currentClass, 
  currentStudents, 
  assessments, 
  setAssessments,
  topicsData 
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    assessmentName: '',
    topic: Object.keys(topicsData)[0],
    contentArea: topicsData[Object.keys(topicsData)[0]][0],
    scores: {}
  });

  const contentAreas = useMemo(() => {
    return topicsData[formData.topic] || [];
  }, [formData.topic, topicsData]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      contentArea: contentAreas[0] || ''
    }));
  }, [contentAreas]);

  const updateScore = (studentId, score) => {
    const numScore = score === '' ? '' : Math.max(0, Math.min(100, Number(score)));
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [studentId]: numScore
      }
    }));
  };

  const saveAssessment = () => {
    if (!formData.date || !formData.topic || !formData.contentArea) {
      alert('Please fill in all required fields');
      return;
    }

    const filledScores = Object.values(formData.scores).filter(s => s !== '').length;
    if (filledScores === 0) {
      alert('Please enter at least one student score');
      return;
    }

    const newAssessment = {
      id: Date.now(),
      date: formData.date,
      assessmentName: formData.assessmentName || `${formData.topic} - ${formData.contentArea}`,
      topic: formData.topic,
      contentArea: formData.contentArea,
      class: currentClass,
      scores: { ...formData.scores }
    };

    setAssessments(prev => [...prev, newAssessment]);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      assessmentName: '',
      topic: formData.topic,
      contentArea: formData.contentArea,
      scores: {}
    });

    alert('Assessment saved successfully!');
  };

  const setAllScores = (value) => {
    const numValue = value === '' ? '' : Math.max(0, Math.min(100, Number(value)));
    const newScores = {};
    currentStudents.forEach(student => {
      newScores[student.id] = numValue;
    });
    setFormData(prev => ({
      ...prev,
      scores: newScores
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Content Knowledge Assessment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assessment Name (Optional)
          </label>
          <input
            type="text"
            value={formData.assessmentName}
            onChange={(e) => setFormData(prev => ({ ...prev, assessmentName: e.target.value }))}
            placeholder="e.g., Mock Exam 1"
            className="w-full input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic *
          </label>
          <select
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            className="w-full input-field"
          >
            {Object.keys(topicsData).map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Area *
          </label>
          <select
            value={formData.contentArea}
            onChange={(e) => setFormData(prev => ({ ...prev, contentArea: e.target.value }))}
            className="w-full input-field"
          >
            {contentAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Student Scores (%)</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Quick fill:</span>
            <button onClick={() => setAllScores(100)} className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded">
              100%
            </button>
            <button onClick={() => setAllScores(80)} className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded">
              80%
            </button>
            <button onClick={() => setAllScores(60)} className="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 rounded">
              60%
            </button>
            <button onClick={() => setAllScores('')} className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">
              Clear
            </button>
          </div>
        </div>

        {currentStudents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No students in this class. Add students in the "Manage Students" tab.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {currentStudents.map(student => (
              <div key={student.id} className="flex items-center gap-2">
                <label className="flex-1 text-sm text-gray-700">
                  {student.name}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.scores[student.id] || ''}
                  onChange={(e) => updateScore(student.id, e.target.value)}
                  placeholder="%"
                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveAssessment}
          disabled={currentStudents.length === 0}
          className="flex items-center gap-2 btn-primary"
        >
          <Save className="w-4 h-4" />
          Save Assessment
        </button>
      </div>
    </div>
  );
}