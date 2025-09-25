'use client';

import { useState, useEffect } from 'react';
import ClassManagement from '../components/ClassManagement';
import AssessmentForm from '../components/AssessmentForm';
import StudentRoster from '../components/StudentRoster';
import RecentAssessments from '../components/RecentAssessments';
import ExportControls from '../components/ExportControls';
import { initialStudents, topicsData } from '../lib/constants';

export default function Home() {
  // ... rest of the code stays the same
  const [classes, setClasses] = useState(null);
  const [currentClass, setCurrentClass] = useState('Year 10 2025-26');
  const [assessments, setAssessments] = useState(null);
  const [activeTab, setActiveTab] = useState('assessment');

  // Initialize data from localStorage on client side
  useEffect(() => {
    const savedClasses = localStorage.getItem('gcse-classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      const initialClasses = {
        'Year 10 2025-26': initialStudents.map((name, i) => ({
          id: `Y10-${i+1}`,
          name
        })),
        'Year 11 2026-27': []
      };
      setClasses(initialClasses);
      localStorage.setItem('gcse-classes', JSON.stringify(initialClasses));
    }

    const savedAssessments = localStorage.getItem('gcse-assessments');
    setAssessments(savedAssessments ? JSON.parse(savedAssessments) : []);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (classes !== null) {
      localStorage.setItem('gcse-classes', JSON.stringify(classes));
    }
  }, [classes]);

  useEffect(() => {
    if (assessments !== null) {
      localStorage.setItem('gcse-assessments', JSON.stringify(assessments));
    }
  }, [assessments]);

  // Don't render until client-side data is loaded
  if (classes === null || assessments === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentStudents = classes[currentClass] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">GCSE History Assessment Tool</h1>
              <p className="text-blue-200 text-sm mt-1">Track student progress across content areas</p>
            </div>
            <ExportControls 
              assessments={assessments} 
              classes={classes}
              setAssessments={setAssessments}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Class Selection */}
        <ClassManagement
          classes={classes}
          setClasses={setClasses}
          currentClass={currentClass}
          setCurrentClass={setCurrentClass}
          assessments={assessments}
          setAssessments={setAssessments}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg shadow-md pt-4 px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'assessment' 
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              New Assessment
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'students' 
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Manage Students ({currentStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Recent Assessments
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-md p-6">
          {activeTab === 'assessment' && (
            <AssessmentForm
              currentClass={currentClass}
              currentStudents={currentStudents}
              assessments={assessments}
              setAssessments={setAssessments}
              topicsData={topicsData}
            />
          )}
          {activeTab === 'students' && (
            <StudentRoster
              currentClass={currentClass}
              currentStudents={currentStudents}
              classes={classes}
              setClasses={setClasses}
            />
          )}
          {activeTab === 'history' && (
            <RecentAssessments
              assessments={assessments}
              currentClass={currentClass}
              setAssessments={setAssessments}
            />
          )}
        </div>
      </div>
    </div>
  );
}