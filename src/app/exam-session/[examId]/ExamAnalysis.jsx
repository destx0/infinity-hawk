import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ExamAnalysis({ analytics, onClose, submissionData }) {
    if (!analytics) return null;

    // Add submission timestamp display
    const submissionDate = submissionData?.submittedAt?.toDate();
    const formattedDate = submissionDate ? new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(submissionDate) : 'N/A';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Quiz Analysis</h2>
                            <p className="text-sm text-gray-600">Submitted on: {formattedDate}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Overall Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded">
                                <div className="text-sm text-gray-600">Total Score</div>
                                <div className="text-xl font-bold">{analytics.score}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded">
                                <div className="text-sm text-gray-600">Correct</div>
                                <div className="text-xl font-bold text-green-600">{analytics.correct}</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded">
                                <div className="text-sm text-gray-600">Incorrect</div>
                                <div className="text-xl font-bold text-red-600">{analytics.incorrect}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                                <div className="text-sm text-gray-600">Attempted</div>
                                <div className="text-xl font-bold">{analytics.attempted}/{analytics.totalQuestions}</div>
                            </div>
                        </div>

                        {/* Section-wise Analysis */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Section-wise Analysis</h3>
                            <div className="space-y-4">
                                {Object.entries(analytics.sectionWise).map(([section, stats]) => (
                                    <div key={section} className="border p-4 rounded">
                                        <h4 className="font-medium mb-2">{section}</h4>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Attempted: </span>
                                                {stats.attempted}/{stats.total}
                                            </div>
                                            <div>
                                                <span className="text-green-600">Correct: </span>
                                                {stats.correct}
                                            </div>
                                            <div>
                                                <span className="text-red-600">Incorrect: </span>
                                                {stats.incorrect}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 