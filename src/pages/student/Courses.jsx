import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar, Badge, Skeleton } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import RoadmapModal from '../../components/roadmap/RoadmapModal';
import { Search, Compass, BookOpen, Clock, Layers, Sparkles } from 'lucide-react';

const Courses = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCourseForRoadmap, setSelectedCourseForRoadmap] = useState(null);
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [enrollingId, setEnrollingId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseService.getCourses({ search });
      setCourses(res.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStartLearning = async (course) => {
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }

    if (course.isEnrolled) {
      navigate(`/app/courses/${course.slug}`);
      return;
    }

    try {
      setEnrollingId(course.id);
      await courseService.enrollCourse(course.id);
      // Prompt user to generate their personalized roadmap
      setSelectedCourseForRoadmap(course);
      setRoadmapModalOpen(true);
    } catch (err) {
      console.error('Enroll error:', err);
      navigate(`/app/courses/${course.slug}`);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Explore Courses</h1>
          <p className="text-sm text-brand-textSecondary mt-1">
            Carefully curated, interview-focused tracks designed to turn you into a top-tier engineer.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Java, DSA, JavaScript..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow shadow-sm"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-12 text-center">
          <Compass className="w-12 h-12 text-brand-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-brand-dark mb-1">No courses found</h3>
          <p className="text-xs text-brand-textSecondary">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isEnrolled = course.isEnrolled;
            const progress = course.enrollment?.progressPercentage || 0;

            return (
              <div
                key={course.id}
                className="bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-cardHover transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail / Header Banner */}
                  <div className="relative h-44 bg-brand-surfaceHover overflow-hidden border-b border-brand-border">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-yellowSubtle text-brand-dark font-black text-2xl">
                        {course.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    {isEnrolled && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="yellow" size="xs">
                          Enrolled
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-brand-dark mb-1.5 group-hover:text-brand-dark transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-brand-textSecondary line-clamp-2 mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-brand-textSecondary pb-4 border-b border-brand-border/60">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-brand-muted" />
                        {course.categoriesCount} Categories
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-muted" />
                        {course.topicsCount} Topics
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-muted" />
                        ~{course.estimatedHours}h
                      </span>
                    </div>

                    {/* Progress Bar (if enrolled) */}
                    {isEnrolled && (
                      <div className="pt-4">
                        <ProgressBar progress={progress} size="sm" showLabel />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <Link to={`/app/courses/${course.slug}`} className="flex-1">
                    <Button variant="secondary" size="md" className="w-full font-medium text-xs">
                      View Syllabus
                    </Button>
                  </Link>

                  <Button
                    variant="primary"
                    size="md"
                    loading={enrollingId === course.id}
                    onClick={() => handleStartLearning(course)}
                    className="flex-1 font-bold text-xs shadow-sm"
                  >
                    {isEnrolled ? 'Continue →' : 'Start Learning'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Roadmap Setup Modal Trigger */}
      {selectedCourseForRoadmap && (
        <RoadmapModal
          isOpen={roadmapModalOpen}
          onClose={() => setRoadmapModalOpen(false)}
          course={selectedCourseForRoadmap}
          onGenerated={() => fetchCourses()}
        />
      )}
    </div>
  );
};

export default Courses;
