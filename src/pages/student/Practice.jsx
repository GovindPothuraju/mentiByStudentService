import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { practiceService } from '../../services/practiceService';
import { Badge, Skeleton } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Code2, Search, CheckCircle2, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';

const Practice = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  const fetchPractice = async () => {
    try {
      setLoading(true);
      const res = await practiceService.getPracticeCatalog({ difficulty, search });
      setProblems(res.data?.problems || []);
    } catch (err) {
      console.error('Error fetching practice problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPractice();
    }, 250);
    return () => clearTimeout(timer);
  }, [difficulty, search]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">Coding Practice Arena</h1>
        <p className="text-sm text-brand-textSecondary mt-1">
          Solve real-world algorithm and data-structure implementation problems across all courses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-brand-border rounded-xl w-full sm:w-auto overflow-x-auto">
          {['all', 'easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                difficulty === d
                  ? 'bg-brand-dark text-white shadow-sm'
                  : 'text-brand-textSecondary hover:text-brand-dark hover:bg-brand-surfaceHover'
              }`}
            >
              {d === 'all' ? 'All Difficulties' : d}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems, topics..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-12 text-center">
          <Code2 className="w-12 h-12 text-brand-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-brand-dark mb-1">No problems found</h3>
          <p className="text-xs text-brand-textSecondary">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl shadow-card divide-y divide-brand-border/60 overflow-hidden">
          {problems.map((problem) => {
            const isSolved = problem.isSolved;
            const diffColor =
              problem.difficulty === 'hard'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : problem.difficulty === 'medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={problem.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-brand-surfaceHover/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border text-xs shrink-0 ${
                      isSolved
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-brand-surfaceHover border-brand-border text-brand-dark'
                    }`}
                  >
                    {isSolved ? <CheckCircle2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-brand-dark truncate">{problem.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${diffColor}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-brand-textSecondary mt-0.5">
                      <span>{problem.courseTitle}</span>
                      <span>•</span>
                      <span className="text-brand-dark font-medium">{problem.topicTitle}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/app/courses/${problem.courseSlug}/general/${problem.topicSlug}?tab=practice`}
                  className="shrink-0"
                >
                  <Button variant="secondary" size="sm" className="font-semibold text-xs flex items-center gap-1">
                    <span>Solve</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Practice;
