import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Badge';
import Button from '../common/Button';
import { roadmapService } from '../../services/roadmapService';
import { Calendar, Clock, Sparkles } from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 'MON', label: 'Mon' },
  { id: 'TUE', label: 'Tue' },
  { id: 'WED', label: 'Wed' },
  { id: 'THU', label: 'Thu' },
  { id: 'FRI', label: 'Fri' },
  { id: 'SAT', label: 'Sat' },
  { id: 'SUN', label: 'Sun' },
];

const RoadmapModal = ({ isOpen, onClose, course, onGenerated }) => {
  const navigate = useNavigate();
  const [targetDays, setTargetDays] = useState(30);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [selectedDays, setSelectedDays] = useState(['MON', 'TUE', 'WED', 'THU', 'FRI']);
  const [learningStyle, setLearningStyle] = useState('balanced');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!course) return null;

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayId));
      }
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await roadmapService.generateRoadmap({
        courseId: course.id || course._id,
        startDate: new Date(startDate),
        targetDays: parseInt(targetDays),
        hoursPerDay: parseFloat(hoursPerDay),
        learningDays: selectedDays,
        learningStyle,
      });

      if (onGenerated) onGenerated(res.data);
      onClose();
      navigate(`/app/roadmap/${course.slug}`);
    } catch (err) {
      setError(err.message || 'Error generating roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Personalized Roadmap 🚀"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleGenerate} className="space-y-5">
        <div className="bg-brand-surfaceHover p-3.5 rounded-xl border border-brand-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-yellowSubtle flex items-center justify-center font-bold text-brand-dark">
            📚
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-dark">{course.title}</h4>
            <p className="text-xs text-brand-textSecondary">
              Tailoring {course.totalTopics || course.topicsCount || 30}+ topics to your schedule & capacity
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Target Days */}
        <div>
          <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2">
            Target Completion Days
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[15, 30, 45, 60].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setTargetDays(d)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  targetDays === d
                    ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                    : 'bg-white text-brand-textPrimary border-brand-border hover:bg-brand-surfaceHover'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
          <input
            type="number"
            min={5}
            max={180}
            value={targetDays}
            onChange={(e) => setTargetDays(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            placeholder="Custom target days..."
          />
        </div>

        {/* Daily Hours */}
        <div>
          <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Daily Available Hours: <strong className="text-brand-dark">{hoursPerDay} hrs/day</strong></span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 1.5, 2, 3, 4].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHoursPerDay(h)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  hoursPerDay === h
                    ? 'bg-brand-yellow text-brand-dark border-brand-yellow shadow-sm font-black'
                    : 'bg-white text-brand-textPrimary border-brand-border hover:bg-brand-surfaceHover'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Study Days of Week */}
        <div>
          <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Preferred Study Days</span>
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS_OF_WEEK.map((d) => {
              const isSelected = selectedDays.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDay(d.id)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-white text-brand-muted border-brand-border hover:bg-brand-surfaceHover'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning Style */}
        <div>
          <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Learning Preference</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'balanced', title: 'Balanced', desc: 'Theory + Quizzes' },
              { id: 'practice', title: 'Practice Heavy', desc: 'More code problems' },
              { id: 'theory', title: 'Theory Focused', desc: 'In-depth concepts' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setLearningStyle(st.id)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  learningStyle === st.id
                    ? 'bg-brand-yellowSubtle border-brand-yellowBorder ring-1 ring-brand-yellow'
                    : 'bg-white border-brand-border hover:bg-brand-surfaceHover'
                }`}
              >
                <div className="text-xs font-bold text-brand-dark">{st.title}</div>
                <div className="text-[11px] text-brand-textSecondary mt-0.5">{st.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-semibold text-brand-textSecondary mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full py-3 font-bold text-sm shadow-md"
        >
          Generate My Personalized Roadmap →
        </Button>
      </form>
    </Modal>
  );
};

export default RoadmapModal;
