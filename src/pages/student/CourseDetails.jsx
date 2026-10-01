import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar, Badge, Skeleton } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import RoadmapModal from '../../components/roadmap/RoadmapModal';
import {
  BookOpen,
  Clock,
  Layers,
  CheckCircle2,
  PlayCircle,
  Circle,
  Map,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const CourseDetails = () => {
  const { courseSlug } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await courseService.getCourseBySlug(courseSlug);
      setCourseData(res.data);
    } catch (err) {
      setError(err.message || 'Error loading course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseSlug]);

  const toggleCategory = (catId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="p-12 bg-white border border-red-200 rounded-2xl text-center">
        <p className="text-sm text-red-600 font-semibold mb-4">{error || 'Course not found'}</p>
        <Link to="/app/courses">
          <Button variant="secondary">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const { course, enrollment, activeRoadmap, overallProgress, categories } = courseData;

  // Find first non-completed topic for "Continue Learning"
  let nextTopic = null;
  let nextCategory = null;
  for (const cat of categories) {
    for (const t of cat.topics) {
      if (t.status !== 'COMPLETED') {
        nextTopic = t;
        nextCategory = cat;
        break;
      }
    }
    if (nextTopic) break;
  }
  if (!nextTopic && categories[0]?.topics[0]) {
    nextTopic = categories[0].topics[0];
    nextCategory = categories[0];
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Course Header Banner */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="yellow" size="sm">Course Syllabus</Badge>
            {activeRoadmap && (
              <Badge variant="success" size="sm">Active Roadmap: Day {activeRoadmap.currentDayNumber}</Badge>
            )}
          </div>

          <h1 className="text-3xl font-black text-brand-dark tracking-tight">{course.title}</h1>
          <p className="text-sm text-brand-textSecondary leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-textSecondary pt-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-muted" /> {course.totalCategories} Categories
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-muted" /> {course.totalTopics} Topics
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {overallProgress}% Completed
            </span>
          </div>

          <ProgressBar progress={overallProgress} size="md" className="pt-2 max-w-md" />
        </div>

        {/* Action Column */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          {nextTopic && nextCategory ? (
            <Link
              to={`/app/courses/${course.slug}/${nextCategory.slug}/${nextTopic.slug}`}
              className="w-full"
            >
              <Button variant="primary" className="w-full font-bold py-3 shadow-md">
                {enrollment ? 'Continue Learning →' : 'Start Learning →'}
              </Button>
            </Link>
          ) : null}

          {activeRoadmap ? (
            <Link to={`/app/roadmap/${course.slug}`} className="w-full">
              <Button variant="secondary" className="w-full font-semibold flex items-center justify-center gap-2">
                <Map className="w-4 h-4 text-brand-yellow" /> View My Roadmap
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                if (!isAuthenticated) openAuthModal('register');
                else setRoadmapModalOpen(true);
              }}
              className="w-full font-semibold flex items-center justify-center gap-2"
            >
              <Map className="w-4 h-4 text-brand-yellow" /> Create Personal Roadmap
            </Button>
          )}
        </div>
      </div>

      {/* Categories & Topics Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-brand-dark">Course Curriculum</h2>

        <div className="space-y-3">
          {categories.map((cat, idx) => {
            const isCollapsed = collapsedCategories[cat.id];
            const isFullyComplete = cat.percentage === 100;

            return (
              <div
                key={cat.id}
                className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-brand-surfaceHover transition-colors border-b border-transparent data-[open=true]:border-brand-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-surfaceHover text-brand-textSecondary text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-brand-dark">{cat.title}</h3>
                      <p className="text-[11px] text-brand-textSecondary">
                        {cat.completedTopics} of {cat.totalTopics} topics completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-dark hidden sm:inline">
                      {cat.percentage}%
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-brand-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-brand-muted" />
                    )}
                  </div>
                </button>

                {/* Topics List */}
                {!isCollapsed && (
                  <div className="divide-y divide-brand-border/60 bg-brand-surfaceHover/30">
                    {cat.topics.map((topic) => {
                      const isComplete = topic.status === 'COMPLETED';
                      const isInProgress = topic.status === 'IN_PROGRESS';

                      return (
                        <Link
                          key={topic.id}
                          to={`/app/courses/${course.slug}/${cat.slug}/${topic.slug}`}
                          className="px-6 py-3.5 flex items-center justify-between hover:bg-brand-surfaceHover transition-colors group"
                        >
                          <div className="flex items-center gap-3.5">
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isInProgress ? (
                              <PlayCircle className="w-4 h-4 text-brand-yellow shrink-0 fill-brand-yellowSubtle" />
                            ) : (
                              <Circle className="w-4 h-4 text-brand-muted shrink-0" />
                            )}
                            <div>
                              <div className="text-xs font-bold text-brand-dark group-hover:text-brand-dark">
                                {topic.title}
                              </div>
                              {topic.description && (
                                <div className="text-[11px] text-brand-textSecondary line-clamp-1">
                                  {topic.description}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-brand-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {topic.estimatedMinutes}m
                            </span>
                            <span className="text-xs font-bold text-brand-textSecondary group-hover:translate-x-0.5 transition-transform">
                              →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Modal */}
      <RoadmapModal
        isOpen={roadmapModalOpen}
        onClose={() => setRoadmapModalOpen(false)}
        course={course}
        onGenerated={() => fetchCourse()}
      />
    </div>
  );
};

export default CourseDetails;
