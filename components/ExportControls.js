import { Download, Trash2 } from 'lucide-react';

export default function ExportControls({ assessments, classes, setAssessments }) {
  const exportToCSV = () => {
    if (assessments.length === 0) {
      alert('No assessments to export');
      return;
    }

    const csvRows = ['Date,Assessment_Name,Topic,Content_Area,Student_ID,Student_Name,Class,Score_Percent'];
    
    assessments.forEach(assessment => {
      const classStudents = classes[assessment.class] || [];
      classStudents.forEach(student => {
        const score = assessment.scores[student.id] ?? '';
        const row = [
          assessment.date,
          `"${assessment.assessmentName.replace(/"/g, '""')}"`,
          `"${assessment.topic.replace(/"/g, '""')}"`,
          `"${assessment.contentArea.replace(/"/g, '""')}"`,
          student.id,
          `"${student.name.replace(/"/g, '""')}"`,
          `"${assessment.class.replace(/"/g, '""')}"`,
          score
        ].join(',');
        csvRows.push(row);
      });
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gcse_history_assessments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearAssessments = () => {
    if (assessments.length === 0) {
      alert('No assessments to clear');
      return;
    }
    
    if (window.confirm(`Clear all ${assessments.length} assessment(s)? This cannot be undone.`)) {
      setAssessments([]);
      localStorage.removeItem('gcse-assessments');
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={exportToCSV}
        disabled={assessments.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        Export CSV ({assessments.length})
      </button>
      <button
        onClick={clearAssessments}
        disabled={assessments.length === 0}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Clear Data
      </button>
    </div>
  );
}