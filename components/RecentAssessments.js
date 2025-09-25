import { Trash2, Calendar, FileText } from 'lucide-react';

export default function RecentAssessments({ assessments, currentClass, setAssessments }) {
  const classAssessments = assessments
    .filter(a => a.class === currentClass)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const deleteAssessment = (id) => {
    if (window.confirm('Delete this assessment?')) {
      setAssessments(prev => prev.filter(a => a.id !== id));
    }
  };

  const getAverageScore = (assessment) => {
    const scores = Object.values(assessment.scores).filter(s => s !== '');
    if (scores.length === 0) return 'N/A';
    const avg = scores.reduce((sum, score) => sum + Number(score), 0) / scores.length;
    return `${avg.toFixed(1)}%`;
  };

  const getCompletionRate = (assessment) => {
    const filled = Object.values(assessment.scores).filter(s => s !== '').length;
    const total = Object.keys(assessment.scores).length;
    return `${filled}/${total}`;
  };

  if (classAssessments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No assessments recorded for this class yet.</p>
        <p className="text-sm text-gray-400 mt-1">Create your first assessment in the "New Assessment" tab.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Assessment History</h3>
      <div className="space-y-3">
        {classAssessments.map(assessment => (
          <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{assessment.date}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="font-medium">{assessment.assessmentName}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Topic:</span>
                    <p className="font-medium">{assessment.topic}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Content Area:</span>
                    <p className="font-medium">{assessment.contentArea}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Average Score:</span>
                    <p className="font-medium">{getAverageScore(assessment)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Completion:</span>
                    <p className="font-medium">{getCompletionRate(assessment)}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteAssessment(assessment.id)}
                className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete assessment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Export your assessments to CSV to analyze trends in Power BI or Excel.
          The export includes all assessment data across all classes.
        </p>
      </div>
    </div>
  );
}