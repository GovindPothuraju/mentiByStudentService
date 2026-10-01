import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { ProgressBar, Badge, Skeleton } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { User, Flame, Clock, CheckCircle2, Award, LogOut, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDashboard()
      .then((res) => setDashboardData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const streakDays = user?.streak?.currentStreak || user?.currentStreak || 0;
  const longestStreak = user?.streak?.longestStreak || user?.longestStreak || streakDays;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Profile Card */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-brand-dark text-brand-yellow font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-black text-brand-dark">{user?.name || 'Student'}</h1>
              <Badge variant="yellow" size="xs">Student</Badge>
            </div>
            <p className="text-xs text-brand-textSecondary mb-2">{user?.email}</p>
            <p className="text-[11px] text-brand-muted">
              Member of MentiBY since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="text-xs text-red-600 hover:bg-red-50 font-semibold"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </Button>
      </div>

      {/* Streak & Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-brand-yellowSubtle border border-brand-yellowBorder rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
            <span>Learning Streak</span>
          </div>
          <div className="text-3xl font-black text-brand-dark">{streakDays} Days</div>
          <p className="text-[11px] text-brand-textSecondary mt-1">Longest record: {longestStreak} days</p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-textSecondary uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Topics Completed</span>
          </div>
          <div className="text-3xl font-black text-brand-dark">
            {dashboardData?.statistics?.topicsCompleted || 0}
          </div>
          <p className="text-[11px] text-brand-textSecondary mt-1">Placement concepts mastered</p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-textSecondary uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-brand-yellow" />
            <span>Quiz Accuracy</span>
          </div>
          <div className="text-3xl font-black text-brand-dark">
            {dashboardData?.statistics?.quizAccuracy || 0}%
          </div>
          <p className="text-[11px] text-brand-textSecondary mt-1">Across all concept quizzes</p>
        </div>
      </div>

      {/* Enrolled Tracks */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-yellow" />
          Enrolled Tracks Progress
        </h3>

        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : !dashboardData?.courseProgress || dashboardData.courseProgress.length === 0 ? (
          <p className="text-xs text-brand-muted py-4">No enrolled courses yet.</p>
        ) : (
          <div className="divide-y divide-brand-border/60">
            {dashboardData.courseProgress.map((course) => (
              <div key={course.courseId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-brand-dark">{course.title}</h4>
                  <p className="text-xs text-brand-textSecondary">
                    {course.completedTopics} of {course.totalTopics} topics completed
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:w-64">
                  <ProgressBar progress={course.progressPercentage} size="sm" showLabel />
                  <Link to={`/app/courses/${course.slug}`}>
                    <Button variant="secondary" size="sm" className="text-xs font-semibold shrink-0">
                      View →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
