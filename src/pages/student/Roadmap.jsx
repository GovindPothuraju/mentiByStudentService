import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roadmapService } from '../../services/roadmapService';
import { courseService } from '../../services/courseService';
import { ProgressBar, Badge, Skeleton } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import RoadmapModal from '../../components/roadmap/RoadmapModal';
import {
  Map,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Circle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const Roadmap = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const [roadmapsList, setRoadmapsList] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleMsg, setRescheduleMsg] = useState('');
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const listRes = await roadmapService.getRoadmaps();
      const allRoadmaps = listRes.data || [];
      setRoadmapsList(allRoadmaps);

      if (courseSlug) {
        // Fetch specific roadmap
        const res = await roadmapService.getRoadmapByCourse(courseSlug);
        setActiveRoadmap(res.data);
        if (res.data?.currentDayNumber) {
          setSelectedDayNumber(res.data.currentDayNumber);
        }
      } else if (allRoadmaps.length > 0) {
        // Pick first active roadmap
        const firstActive = allRoadmaps.find((r) => r.status === 'ACTIVE') || allRoadmaps[0];
        const res = await roadmapService.getRoadmapByCourse(firstActive.courseId?.slug || firstActive._id);
        setActiveRoadmap(res.data);
        if (res.data?.currentDayNumber) {
          setSelectedDayNumber(res.data.currentDayNumber);
        }
      } else {
        // Fetch courses to offer roadmap creation
        const cRes = await courseService.getCourses();
        setAvailableCourses(cRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [courseSlug]);

  const handleReschedule = async () => {
    if (!activeRoadmap?._id) return;
    setRescheduling(true);
    setRescheduleMsg('');
    try {
      const res = await roadmapService.rescheduleRoadmap(activeRoadmap._id);
      setRescheduleMsg(res.message || 'Roadmap successfully adapted!');
      fetchRoadmaps();
    } catch (err) {
      setRescheduleMsg(err.message || 'Error rescheduling');
    } finally {
      setRescheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-5 h-[65vh]" />
          <Skeleton className="lg:col-span-7 h-[65vh]" />
        </div>
      </div>
    );
  }

  // If no roadmaps exist
  if (!activeRoadmap) {
    return (
      <div className="bg-white border border-brand-border rounded-2xl p-12 text-center max-w-xl mx-auto my-10 shadow-card">
        <div className="w-14 h-14 bg-brand-yellowSubtle text-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-yellowBorder">
          <Map className="w-7 h-7 text-brand-dark" />
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">No Active Roadmap Found</h2>
        <p className="text-sm text-brand-textSecondary mb-6">
          Personalized roadmaps organize topics into daily manageable capacity so you always know what to study next.
        </p>
        <Link to="/app/courses">
          <Button variant="primary" className="font-bold py-3 shadow-md">
            Choose a Course to Create Roadmap →
          </Button>
        </Link>
      </div>
    );
  }

  const { title, courseId, targetDays, hoursPerDay, progressPercentage, days = [] } = activeRoadmap;

  // Selected Day data
  const selectedDay = days.find((d) => d.dayNumber === selectedDayNumber) || days[0];

  // Detect if any days are missed
  const hasMissedDays = days.some((d) => d.status === 'MISSED');

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">Roadmap</span>
            <Badge variant="yellow" size="xs">{targetDays} Days • {hoursPerDay}h/day</Badge>
          </div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">{title}</h1>
          <p className="text-xs text-brand-textSecondary mt-1">
            {courseId?.title} • {days.length} Total study milestones
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-brand-muted font-medium">Roadmap Progress</div>
            <div className="text-lg font-black text-brand-dark">{progressPercentage}%</div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRoadmapModalOpen(true)}
            className="text-xs font-semibold"
          >
            Adjust Target / Hours
          </Button>
        </div>
      </div>

      {/* Adaptive Reschedule Alert Banner */}
      {hasMissedDays && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">Missed Day Detected</p>
              <p className="text-[11px] text-amber-700">
                You have unfinished tasks from previous study days. Recalculate your schedule to absorb them forward seamlessly.
              </p>
            </div>
          </div>
          <Button
            variant="dark"
            size="sm"
            loading={rescheduling}
            onClick={handleReschedule}
            className="text-xs font-bold shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-yellow" /> Adapt My Schedule
          </Button>
        </div>
      )}

      {rescheduleMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
          {rescheduleMsg}
        </div>
      )}

      {/* 2. Split Screen: Left (Timeline) | Right (Day Plan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Days List */}
        <div className="lg:col-span-5 bg-white border border-brand-border rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 className="text-sm font-bold text-brand-dark flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-yellow" />
              Timeline Days
            </h3>
            <span className="text-xs text-brand-textSecondary">{days.length} Days</span>
          </div>

          <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
            {days.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              const isDone = day.status === 'COMPLETED';
              const isToday = day.status === 'TODAY';
              const isMissed = day.status === 'MISSED';

              return (
                <button
                  key={day._id}
                  type="button"
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                      : isMissed
                      ? 'bg-red-50/50 border-red-200 text-brand-textPrimary hover:bg-red-50'
                      : 'bg-brand-surfaceHover border-brand-border text-brand-textPrimary hover:border-brand-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-brand-yellow' : 'text-emerald-600'}`} />
                    ) : isToday ? (
                      <Flame className={`w-4 h-4 shrink-0 fill-current ${isSelected ? 'text-brand-yellow' : 'text-amber-500'}`} />
                    ) : isMissed ? (
                      <AlertCircle className={`w-4 h-4 shrink-0 ${isSelected ? 'text-brand-yellow' : 'text-red-500'}`} />
                    ) : (
                      <Circle className={`w-4 h-4 shrink-0 ${isSelected ? 'text-gray-400' : 'text-brand-muted'}`} />
                    )}

                    <div>
                      <div className="text-xs font-bold leading-tight">
                        Day {day.dayNumber}
                        {isToday && <span className="ml-1.5 text-[10px] bg-brand-yellow text-brand-dark px-1.5 py-0.5 rounded font-black">TODAY</span>}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-brand-textSecondary'}`}>
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-semibold ${isSelected ? 'text-gray-300' : 'text-brand-textSecondary'}`}>
                      {day.estimatedMinutes}m
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Day's Task Plan */}
        <div className="lg:col-span-7 bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col justify-between min-h-[500px]">
          {selectedDay ? (
            <div className="space-y-6">
              {/* Day Header */}
              <div className="pb-4 border-b border-brand-border flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-brand-yellow bg-brand-dark px-2 py-0.5 rounded">
                    DAY {selectedDay.dayNumber}
                  </span>
                  <h2 className="text-2xl font-black text-brand-dark tracking-tight mt-2">
                    {new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <p className="text-xs text-brand-textSecondary mt-0.5">
                    Estimated Time: {selectedDay.estimatedMinutes} minutes • Status: {selectedDay.status}
                  </p>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                  Target Tasks Checklist
                </h4>

                {selectedDay.tasks?.length === 0 ? (
                  <p className="text-xs text-brand-muted py-6">No tasks assigned for this milestone.</p>
                ) : (
                  selectedDay.tasks.map((task) => {
                    const isDone = task.status === 'COMPLETED';
                    const topic = task.topicId;

                    return (
                      <div
                        key={task._id}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-brand-surfaceHover/80 border-brand-border hover:border-brand-dark'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center border text-xs ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-white border-brand-border text-brand-muted'
                            }`}
                          >
                            {isDone ? '✓' : task.order}
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${isDone ? 'line-through text-brand-textSecondary' : 'text-brand-dark'}`}>
                              {task.title}
                            </div>
                            <div className="text-[11px] text-brand-textSecondary flex items-center gap-2 mt-0.5">
                              <span>{task.estimatedMinutes} mins</span>
                              <span>•</span>
                              <span className="uppercase text-[10px] tracking-wider font-semibold text-brand-muted">
                                {task.taskType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {topic && (
                          <Link
                            to={`/app/courses/${courseId?.slug || 'course'}/general/${topic.slug || ''}?tab=${task.taskType.toLowerCase()}`}
                          >
                            <Button variant="ghost" size="sm" className="font-bold text-xs">
                              Learn →
                            </Button>
                          </Link>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-brand-muted">Select a day from the left timeline to view tasks.</p>
          )}

          {/* Action Footer */}
          {selectedDay?.tasks?.[0]?.topicId && (
            <div className="pt-6 border-t border-brand-border mt-6">
              <Link
                to={`/app/courses/${courseId?.slug || 'course'}/general/${selectedDay.tasks[0].topicId.slug || ''}?tab=${selectedDay.tasks[0].taskType.toLowerCase()}`}
              >
                <Button variant="primary" className="w-full font-bold py-3 shadow-md">
                  Start Day {selectedDay.dayNumber}: {selectedDay.tasks[0].title} →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Roadmap Modal */}
      {activeRoadmap?.courseId && (
        <RoadmapModal
          isOpen={roadmapModalOpen}
          onClose={() => setRoadmapModalOpen(false)}
          course={activeRoadmap.courseId}
          onGenerated={() => fetchRoadmaps()}
        />
      )}
    </div>
  );
};

export default Roadmap;
