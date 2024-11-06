import { Button } from "@/components/ui/button";

export default function ExamAnalysis({ analytics, onClose }) {
    if (!analytics) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Exam Analysis</h2>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                    >
                        ✕
                    </Button>
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
    );
} 