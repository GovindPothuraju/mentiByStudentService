import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { topicService } from '../../services/topicService';
import { ProgressBar, Badge, Skeleton } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  Flame,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Code2,
  Award,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleTaskCheck = async (task) => {
    if (!task.topicId) return;
    try {
      await topicService.completeTopic(task.topicId._id || task.topicId);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white border border-red-200 rounded-2xl text-center">
        <p className="text-sm text-red-600 font-semibold mb-4">{error}</p>
        <Button variant="secondary" onClick={fetchDashboard}>Try Again</Button>
      </div>
    );
  }

  const { student, streak, continueLearning, todayPlan, courseProgress, statistics } = data || {};
  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || currentStreak;

  // Determine greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome & Streak Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border rounded-2xl p-6 shadow-card">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            {greeting}, {student?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-sm text-brand-textSecondary mt-1">
            {todayPlan?.tasks?.length
              ? `You have ${todayPlan.tasks.filter((t) => t.status !== 'COMPLETED').length} tasks pending for today.`
              : 'Explore courses or generate a personalized roadmap to begin.'}
          </p>
        </div>

        {/* Streak Pill Card */}
        <div className="flex items-center gap-4 bg-brand-yellowSubtle border border-brand-yellowBorder p-3.5 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center text-brand-dark shadow-sm">
            <Flame className="w-7 h-7 fill-brand-dark" />
          </div>
          <div>
            <div className="text-xl font-black text-brand-dark leading-none">
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak
            </div>
            <div className="text-xs text-brand-textSecondary mt-1">
              Personal best: <strong>{longestStreak} days</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Split: Continue Learning Card & Today's Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Continue Learning Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-brand-dark text-white rounded-2xl p-6 flex-1 flex flex-col justify-between relative overflow-hidden shadow-card">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-3">
                <span className="uppercase tracking-wider">Continue Learning</span>
                <span className="flex items-center gap-1 text-brand-yellow">
                  <Sparkles className="w-3.5 h-3.5" /> Resume
                </span>
              </div>

              {continueLearning ? (
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {continueLearning.topicTitle}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    {continueLearning.courseTitle} • {continueLearning.categoryTitle}
                  </p>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                      <span>Topic Progress</span>
                      <span className="text-brand-yellow">{continueLearning.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-yellow h-full rounded-full transition-all duration-500"
                        style={{ width: `${continueLearning.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <h3 className="text-lg font-bold text-white mb-2">Ready to Start?</h3>
                  <p className="text-xs text-gray-300">
                    You haven't enrolled in any courses yet. Choose your goal and let MentiBY prepare you for interviews.
                  </p>
                </div>
              )}
            </div>

            <div>
              {continueLearning ? (
                <Link
                  to={`/app/courses/${continueLearning.courseSlug}/${continueLearning.categorySlug}/${continueLearning.topicSlug}?tab=${continueLearning.tab || 'content'}`}
                  className="w-full inline-block"
                >
                  <Button variant="primary" className="w-full font-bold py-3 shadow-md">
                    Continue: {continueLearning.topicTitle} →
                  </Button>
                </Link>
              ) : (
                <Link to="/app/courses" className="w-full inline-block">
                  <Button variant="primary" className="w-full font-bold py-3">
                    Explore All Courses →
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Today's Learning Plan */}
        <div className="lg:col-span-7 bg-white border border-brand-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div>
                <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-brand-yellow" />
                  Today's Learning Plan
                </h3>
                <p className="text-xs text-brand-textSecondary mt-0.5">
                  {todayPlan?.day ? `Day ${todayPlan.day.dayNumber} • ${new Date(todayPlan.day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Today's personalized tasks"}
                </p>
              </div>

              {todayPlan?.roadmap?.courseId && (
                <Link
                  to={`/app/roadmap/${todayPlan.roadmap.courseId.slug || ''}`}
                  className="text-xs font-semibold text-brand-dark hover:underline flex items-center gap-1"
                >
                  Full Roadmap →
                </Link>
              )}
            </div>

            {/* Checklist */}
            <div className="py-4 space-y-2.5">
              {!todayPlan || !todayPlan.tasks || todayPlan.tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-brand-muted mb-3">No active daily plan for today.</p>
                  <Link to="/app/courses">
                    <Button variant="secondary" size="sm">Select Course to Generate Plan</Button>
                  </Link>
                </div>
              ) : (
                todayPlan.tasks.map((task) => {
                  const isDone = task.status === 'COMPLETED';
                  const topic = task.topicId;

                  return (
                    <div
                      key={task._id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                          : 'bg-brand-surfaceHover border-brand-border hover:border-brand-dark'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleTaskCheck(task)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-brand-border bg-white hover:border-brand-dark'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <div className={`text-xs font-bold ${isDone ? 'line-through text-brand-textSecondary' : 'text-brand-dark'}`}>
                            {task.title}
                          </div>
                          <div className="text-[11px] text-brand-textSecondary flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-brand-muted" /> {task.estimatedMinutes} min
                            </span>
                            <span>•</span>
                            <span className="uppercase text-[10px] tracking-wider font-semibold text-brand-muted">
                              {task.taskType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {topic && (
                        <Link
                          to={`/app/courses/${todayPlan.roadmap?.courseId?.slug || 'course'}/${topic.categoryId?.slug || 'general'}/${topic.slug || ''}?tab=${task.taskType.toLowerCase()}`}
                        >
                          <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-dark">
                            Start →
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {todayPlan?.tasks?.length > 0 && (
            <div className="pt-2 border-t border-brand-border">
              {(() => {
                const firstPending = todayPlan.tasks.find((t) => t.status !== 'COMPLETED') || todayPlan.tasks[0];
                const topic = firstPending?.topicId;
                if (!topic) return null;

                return (
                  <Link
                    to={`/app/courses/${todayPlan.roadmap?.courseId?.slug || 'course'}/${topic.categoryId?.slug || 'general'}/${topic.slug || ''}?tab=${firstPending.taskType.toLowerCase()}`}
                  >
                    <Button variant="primary" className="w-full font-bold py-2.5">
                      Start Today's Goal: {firstPending.title} →
                    </Button>
                  </Link>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* 3. Course Progress List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-yellow" />
            Your Enrolled Courses
          </h3>
          <Link to="/app/courses" className="text-xs font-semibold text-brand-dark hover:underline">
            View All Courses →
          </Link>
        </div>

        {courseProgress?.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-2xl p-8 text-center">
            <p className="text-xs text-brand-muted mb-3">You are not enrolled in any courses yet.</p>
            <Link to="/app/courses">
              <Button variant="primary" size="sm" className="font-bold">Browse Courses →</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {courseProgress.map((course) => (
              <div
                key={course.courseId}
                className="bg-white border border-brand-border rounded-2xl p-5 hover:shadow-cardHover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Course</span>
                    <span className="text-xs font-bold text-brand-dark">{course.progressPercentage}%</span>
                  </div>

                  <h4 className="text-base font-bold text-brand-dark mb-1">{course.title}</h4>
                  <p className="text-xs text-brand-textSecondary mb-4">
                    {course.completedTopics} of {course.totalTopics} topics completed
                  </p>

                  <ProgressBar progress={course.progressPercentage} size="sm" className="mb-5" />
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/app/courses/${course.slug}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full font-medium text-xs">
                      Course Tree
                    </Button>
                  </Link>
                  <Link to={`/app/roadmap/${course.slug}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full font-bold text-xs">
                      Roadmap →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Aggregate Learning Statistics */}
      <div>
        <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-yellow" />
          Overall Performance Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-brand-muted text-xs mb-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Topics Completed
            </div>
            <div className="text-2xl font-black text-brand-dark">{statistics?.topicsCompleted || 0}</div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-brand-muted text-xs mb-1.5 font-medium">
              <HelpCircle className="w-4 h-4 text-brand-yellow" /> Quizzes Taken
            </div>
            <div className="text-2xl font-black text-brand-dark">{statistics?.quizzesCompleted || 0}</div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-brand-muted text-xs mb-1.5 font-medium">
              <Award className="w-4 h-4 text-amber-500" /> Quiz Accuracy
            </div>
            <div className="text-2xl font-black text-brand-dark">{statistics?.quizAccuracy || 0}%</div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-brand-muted text-xs mb-1.5 font-medium">
              <Code2 className="w-4 h-4 text-sky-600" /> Problems Solved
            </div>
            <div className="text-2xl font-black text-brand-dark">{statistics?.problemsSolved || 0}</div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-brand-muted text-xs mb-1.5 font-medium">
              <Award className="w-4 h-4 text-indigo-600" /> Interview Rehearsals
            </div>
            <div className="text-2xl font-black text-brand-dark">{statistics?.interviewQuestionsReviewed || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

export default Dashboard;
