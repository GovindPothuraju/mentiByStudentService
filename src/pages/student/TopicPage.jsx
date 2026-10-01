import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { topicService } from '../../services/topicService';
import { quizService } from '../../services/quizService';
import { interviewService } from '../../services/interviewService';
import { practiceService } from '../../services/practiceService';
import { courseService } from '../../services/courseService';
import { ProgressBar, Badge, Skeleton } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  BookOpen,
  HelpCircle,
  Award,
  Code2,
  CheckCircle2,
  ChevronLeft,
  Menu,
  X,
  PlayCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Flame,
  ArrowRight,
  Info,
  Terminal,
  Lock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import ImageSlider from '../../components/topic/ImageSlider';

const TopicPage = () => {
  const { courseSlug, categorySlug, topicSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'content';
  const rightContentRef = useRef(null);

  // Separate Course Tree & Topic States to keep left sidebar constant
  const [courseNav, setCourseNav] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);

  const [topicData, setTopicData] = useState(null);
  const [topicLoading, setTopicLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Tab 2: Quiz State (strictly scoped to current topic)
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  // Tab 3: Interview State (strictly scoped to current topic)
  const [interviewData, setInterviewData] = useState(null);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Tab 4: Practice State (strictly scoped to current topic)
  const [practiceData, setPracticeData] = useState(null);
  const [activePracticeIndex, setActivePracticeIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState({});
  const [practiceMarked, setPracticeMarked] = useState(false);
  const [practiceLoading, setPracticeLoading] = useState(false);

  const handleCopySolution = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const toggleSolution = (problemId) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [problemId]: prev[problemId] !== undefined ? !prev[problemId] : false,
    }));
  };

  // 1. Fetch Course Tree ONLY when courseSlug changes (stays constant across topic switches)
  useEffect(() => {
    if (!courseSlug) return;
    if (courseNav?.course?.slug === courseSlug) return;

    let isMounted = true;
    setCourseLoading(true);

    courseService.getCourseBySlug(courseSlug)
      .then((res) => {
        if (isMounted) {
          setCourseNav(res.data);
        }
      })
      .catch((err) => console.error('Error fetching course nav:', err))
      .finally(() => {
        if (isMounted) setCourseLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseSlug, courseNav?.course?.slug]);

  // 2. Fetch Topic Details ONLY when topicSlug or currentTab changes
  useEffect(() => {
    if (!courseSlug || !topicSlug) return;

    let isMounted = true;
    setTopicLoading(true);

    // Reset topic tab states
    setTopicData(null);
    setQuizData(null);
    setQuizAnswers({});
    setQuizResults(null);
    setInterviewData(null);
    setRevealedAnswers({});
    setPracticeData(null);
    setActivePracticeIndex(0);
    setPracticeMarked(false);

    topicService.getTopic(courseSlug, topicSlug, currentTab)
      .then((res) => {
        if (isMounted) {
          setTopicData(res.data);
          setPracticeMarked(res.data?.progress?.practiceSolved || false);

          if (res.data?.topic?.id) {
            topicService.startTopic(res.data.topic.id).catch(() => {});
          }

          // Smooth scroll right content panel to top on new topic
          if (rightContentRef.current) {
            rightContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      })
      .catch((err) => console.error('Error fetching topic details:', err))
      .finally(() => {
        if (isMounted) setTopicLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseSlug, topicSlug]);

  // 2. Fetch Tab Data when currentTab or topic ID changes
  useEffect(() => {
    if (!topicData?.topic?.id) return;
    const currentTopicId = topicData.topic.id;

    if (currentTab === 'quiz') {
      if (!quizData || quizData.topicId !== currentTopicId) {
        setQuizLoading(true);
        quizService.getQuiz(currentTopicId)
          .then((res) => {
            const data = res?.data;
            setQuizData(data);
            if (data?.hasAttempted && data?.evaluation) {
              setQuizResults(data.evaluation);
              if (data.evaluation.userAnswers) {
                setQuizAnswers(data.evaluation.userAnswers);
              }
            }
          })
          .catch(() => setQuizData(null))
          .finally(() => setQuizLoading(false));
      }
    } else if (currentTab === 'interview') {
      if (!interviewData || interviewData.topicId !== currentTopicId) {
        setInterviewLoading(true);
        interviewService.getInterviewQuestions(currentTopicId)
          .then((res) => setInterviewData(res.data))
          .catch(() => setInterviewData(null))
          .finally(() => setInterviewLoading(false));
      }
    } else if (currentTab === 'practice') {
      if (!practiceData || practiceData.topicId !== currentTopicId) {
        setPracticeLoading(true);
        practiceService.getTopicPractice(currentTopicId)
          .then((res) => setPracticeData(res.data))
          .catch(() => setPracticeData(null))
          .finally(() => setPracticeLoading(false));
      }
    }
  }, [currentTab, topicData?.topic?.id]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Mark Topic Complete Handler
  const handleCompleteTopic = async () => {
    if (!topicData?.topic?.id) return;
    try {
      setCompleting(true);
      const res = await topicService.completeTopic(topicData.topic.id);
      setTopicData((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          status: 'COMPLETED',
          contentCompleted: true,
          overallProgress: 100,
        },
      }));

      // Also update courseNav in place so the sidebar checkmark turns green immediately
      setCourseNav((prevNav) => {
        if (!prevNav?.categories) return prevNav;
        return {
          ...prevNav,
          categories: prevNav.categories.map((cat) => ({
            ...cat,
            topics: cat.topics.map((t) =>
              t.id === topicData.topic.id || t.slug === topicSlug
                ? { ...t, status: 'COMPLETED' }
                : t
            ),
          })),
        };
      });
    } catch (err) {
      console.error('Error completing topic:', err);
    } finally {
      setCompleting(false);
    }
  };

  // Quiz submission (Single attempt policy)
  const handleQuizSubmit = async () => {
    if (!quizData || !quizData.questions) return;
    if (quizResults || quizData.hasAttempted) return;

    // Check how many questions are answered
    const answeredCount = Object.keys(quizAnswers).length;
    const totalCount = quizData.questions.length;
    if (answeredCount < totalCount) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalCount} questions.\n\n⚠️ IMPORTANT: You only get ONE attempt to take this quiz. Unanswered questions will be marked incorrect.\n\nAre you sure you want to finalize and submit now?`
      );
      if (!confirmSubmit) return;
    }

    setQuizLoading(true);

    const answersArray = quizData.questions.map((q) => ({
      questionId: q.id,
      selectedOption: quizAnswers[q.id] !== undefined && quizAnswers[q.id] !== null ? quizAnswers[q.id] : -1,
    }));

    try {
      const res = await quizService.submitQuizAttempt(topicData.topic.id, {
        answers: answersArray,
        timeTakenSeconds: 60,
      });
      setQuizResults(res.data);
      if (res.data?.userAnswers) {
        setQuizAnswers(res.data.userAnswers);
      }
      setQuizData((prev) => ({
        ...prev,
        hasAttempted: true,
        attemptsLeft: 0,
      }));
      setTopicData((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          quizAttempted: true,
          quizCompleted: true,
          quizScore: res.data?.accuracy || 100,
        },
      }));
    } catch (err) {
      console.error('Quiz submit error:', err);
      const errMsg = err.response?.data?.message || 'Error submitting quiz';
      alert(errMsg);
      // If already attempted, load the existing evaluation from backend
      if (err.response?.data?.data?.alreadyAttempted) {
        quizService.getQuiz(topicData.topic.id).then((freshRes) => {
          if (freshRes?.data) {
            setQuizData(freshRes.data);
            if (freshRes.data.evaluation) {
              setQuizResults(freshRes.data.evaluation);
              if (freshRes.data.evaluation.userAnswers) {
                setQuizAnswers(freshRes.data.evaluation.userAnswers);
              }
            }
          }
        });
      }
    } finally {
      setQuizLoading(false);
    }
  };

  // Interview status update
  const handleInterviewConfidence = async (questionId, status) => {
    try {
      await interviewService.updateInterviewProgress(questionId, {
        topicId: topicData.topic.id,
        status,
      });
      setInterviewData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId ? { ...q, reviewStatus: status } : q
          ),
        };
      });
    } catch (err) {
      console.error('Interview review error:', err);
    }
  };

  // Copy code helper
  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Mark practice question as practiced
  const handleMarkPracticeDone = async (problemId) => {
    setPracticeLoading(true);
    try {
      await practiceService.submitCode(problemId, {
        topicId: topicData.topic.id,
        code: '// Practiced on external platform/IDE',
        language: 'javascript',
      });
      setPracticeMarked(true);
      setTopicData((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          practiceSolved: true,
        },
      }));
    } catch (err) {
      console.error('Practice mark error:', err);
    } finally {
      setPracticeLoading(false);
    }
  };

  // Flat list of all topics in order across categories for next/previous navigation
  const allTopics = useMemo(() => {
    if (!courseNav?.categories) return [];
    const list = [];
    courseNav.categories.forEach((cat) => {
      (cat.topics || []).forEach((t) => {
        list.push({ ...t, categorySlug: cat.slug, categoryTitle: cat.title });
      });
    });
    return list;
  }, [courseNav]);

  const currentTopicIndex = allTopics.findIndex((t) => t.slug === topicSlug);
  const prevTopic = currentTopicIndex > 0 ? allTopics[currentTopicIndex - 1] : null;
  const nextTopic =
    currentTopicIndex >= 0 && currentTopicIndex < allTopics.length - 1
      ? allTopics[currentTopicIndex + 1]
      : null;

  if (courseLoading && !courseNav) {
    return (
      <div className="flex w-full h-full overflow-hidden bg-brand-canvas">
        <Skeleton className="w-80 h-full shrink-0 border-r border-brand-border hidden lg:block" />
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const topic = topicData?.topic;
  const category = topicData?.category;
  const progress = topicData?.progress;
  const features = topicData?.features || {
    quizQuestionsCount: 0,
    interviewQuestionsCount: 0,
    practiceQuestionsCount: 0,
  };
  const isTopicCompleted = progress?.status === 'COMPLETED';

  return (
    <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden bg-brand-canvas">
      {/* Mobile Drawer Trigger Bar */}
      <div className="lg:hidden w-full flex items-center justify-between bg-white border-b border-brand-border px-4 py-2.5 shrink-0 z-20 shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-brand-dark px-3 py-1.5 rounded-lg bg-brand-surfaceHover border border-brand-border hover:bg-brand-border/40 transition-colors"
        >
          <Menu className="w-4 h-4 text-brand-yellow" />
          <span>Curriculum Outline</span>
        </button>
        <span className="text-xs font-bold text-brand-textSecondary truncate max-w-[200px]">
          {category?.title || courseNav?.course?.title}
        </span>
      </div>

      {/* 1. Left Sidebar: Sticky and covers left part with scrollable topics */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-brand-border flex flex-col shrink-0 transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-full lg:max-h-[calc(100vh-4rem)] lg:self-start lg:translate-x-0 shadow-2xl lg:shadow-none h-full ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header of Sidebar: Back to Syllabus */}
        <div className="p-4 border-b border-brand-border bg-white flex items-center justify-between shrink-0">
          <Link
            to={`/app/courses/${courseSlug}`}
            className="flex items-center gap-2 text-xs font-bold text-brand-dark hover:text-[#D97706] transition-colors truncate"
            title="Back to Course Syllabus"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">{courseNav?.course?.title || 'Course Syllabus'}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-brand-muted p-1 hover:text-brand-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Overall Progress Mini-Bar */}
        {courseNav?.overallProgress !== undefined && (
          <div className="px-4 py-2.5 bg-brand-surfaceHover/50 border-b border-brand-border shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold text-brand-textSecondary mb-1.5">
              <span>Course Progress</span>
              <span className="text-brand-dark font-black">{courseNav.overallProgress}%</span>
            </div>
            <ProgressBar progress={courseNav.overallProgress} size="sm" />
          </div>
        )}

        {/* Scrollable Curriculum Tree: min-h-0 allows flexbox internal scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5">
          {courseNav?.categories?.map((cat) => (
            <div key={cat.id} className="space-y-1.5">
              <h4 className="text-[11px] font-black text-brand-muted uppercase tracking-wider px-2">
                {cat.title}
              </h4>
              <div className="space-y-1">
                {cat.topics.map((t) => {
                  const isActive = t.slug === topicSlug;
                  const isDone = t.status === 'COMPLETED';

                  return (
                    <Link
                      key={t.id}
                      to={`/app/courses/${courseSlug}/${cat.slug}/${t.slug}?tab=content`}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-dark text-white shadow-sm'
                          : 'text-brand-textSecondary hover:text-brand-dark hover:bg-brand-surfaceHover'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {isDone ? (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-brand-yellow' : 'text-emerald-500'
                            }`}
                          />
                        ) : (
                          <PlayCircle
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-brand-yellow' : 'text-brand-muted group-hover:text-brand-dark'
                            }`}
                          />
                        )}
                        <span className="truncate">{t.title}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0 ml-1" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Main Right Area: Scrollable and covers entire width */}
      <section
        ref={rightContentRef}
        className="flex-1 h-full overflow-y-auto bg-brand-canvas p-4 sm:p-6 lg:p-8 min-w-0"
      >
        <div className="w-full max-w-[1300px] mx-auto space-y-6">
          {topicLoading ? (
            <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6 animate-pulse">
              <div className="h-4 bg-brand-border/60 rounded w-1/4" />
              <div className="h-9 bg-brand-border/60 rounded-xl w-2/3" />
              <div className="h-12 bg-brand-border/40 rounded-xl w-full" />
              <div className="h-64 bg-brand-border/40 rounded-2xl w-full" />
              <div className="h-80 bg-brand-border/30 rounded-2xl w-full" />
            </div>
          ) : !topicData ? (
            <div className="p-12 bg-white border border-red-200 rounded-2xl text-center">
              <p className="text-sm text-red-600 font-semibold mb-4">Topic not found or still loading</p>
              <Link to={`/app/courses/${courseSlug}`}>
                <Button variant="secondary">Back to Course</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col min-w-0">
        {/* Top Header: Breadcrumbs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
          <div>
            <div className="text-xs text-brand-textSecondary flex items-center gap-1.5 mb-1">
              <Link to={`/app/courses/${courseSlug}`} className="hover:underline">
                {courseNav?.course?.title || 'Course'}
              </Link>
              <span>/</span>
              <span>{category?.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
              {topic.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isTopicCompleted ? 'secondary' : 'primary'}
              loading={completing}
              onClick={handleCompleteTopic}
              className={`font-bold text-xs ${
                isTopicCompleted ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : ''
              }`}
            >
              {isTopicCompleted ? '✓ Completed' : 'Mark as Complete'}
            </Button>
          </div>
        </div>

        {/* 4 Tabs Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-brand-border/60">
          {[
            { id: 'content', label: '1. Concept Guide', icon: BookOpen },
            { id: 'quiz', label: `2. Topic Quiz (${features.quizQuestionsCount})`, icon: HelpCircle },
            { id: 'interview', label: `3. Interview Trap Questions (${features.interviewQuestionsCount})`, icon: Award },
            { id: 'practice', label: `4. Problem Practice (${features.practiceQuestionsCount})`, icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'bg-brand-surfaceHover text-brand-textSecondary hover:text-brand-dark hover:bg-brand-border/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-yellow' : 'text-current'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: CLEARLY STRUCTURED CONCEPT GUIDE                  */}
        {/* ======================================================== */}
        {currentTab === 'content' && (
          <div className="py-6 space-y-8">
            {/* 1. FIRST: ALL RELATED IMAGES WITH SLIDER & EXPLANATIONS */}
            {topic.images && topic.images.length > 0 && (
              <div className="p-6 bg-white border-2 border-brand-border rounded-3xl shadow-sm">
                <ImageSlider
                  images={topic.images}
                  topicTitle={topic.title}
                />
              </div>
            )}

            {/* 2. Core Objective / Overview Callout Banner */}
            {topic.description && (
              <div className="p-5 bg-gradient-to-r from-brand-yellowSubtle via-[#FFF7ED] to-white border-2 border-brand-yellowBorder rounded-2xl text-xs text-brand-dark leading-relaxed font-medium flex items-start gap-3 shadow-sm">
                <div className="p-2 rounded-xl bg-brand-yellow text-brand-dark shrink-0 shadow-sm">
                  <Info className="w-4 h-4 text-brand-dark" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider mb-0.5">
                    Core Concept Overview & Key Takeaway
                  </h4>
                  <p className="text-xs text-[#2C2926] leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            )}

            {/* 3. Deep Lesson Notes formatted with .mentiby-html-content (Code snippets in black boxes) */}
            <div className="mentiby-html-content bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm">
              {topic.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: topic.content }}
                />
              ) : (
                <div className="p-8 text-center bg-brand-surfaceHover rounded-xl">
                  <p className="text-xs text-brand-textSecondary">
                    Detailed content notes for <strong>{topic.title}</strong> are ready. Review the visual breakdown above, then test your knowledge with the topic quiz.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Bottom Action Transition */}
            <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold text-brand-textSecondary">
                Estimated study effort: ~{topic.estimatedMinutes} mins
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleTabChange('quiz')}
                className="font-bold text-xs shadow-md w-full sm:w-auto"
              >
                Validate Concept with Topic Quiz ({features.quizQuestionsCount} Questions) →
              </Button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TOPIC SPECIFIC QUIZ                               */}
        {/* ======================================================== */}
        {currentTab === 'quiz' && (
          <div className="py-6 space-y-6">
            {quizLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !quizData || quizData.questions?.length === 0 ? (
              <div className="text-center py-12 bg-brand-surfaceHover rounded-2xl">
                <HelpCircle className="w-10 h-10 text-brand-muted mx-auto mb-2" />
                <h4 className="text-sm font-bold text-brand-dark mb-1">
                  No Quiz Available Yet for {topic.title}
                </h4>
                <p className="text-xs text-brand-textSecondary mb-4">
                  Check out the interview questions and coding practice for this topic.
                </p>
                <Button variant="secondary" size="sm" onClick={() => handleTabChange('interview')}>
                  View Interview Questions →
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Result Summary Banner (When completed) */}
                {quizResults && (
                  <div className="p-5 bg-gradient-to-r from-brand-yellowSubtle to-amber-50/50 border border-brand-yellowBorder rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <h4 className="text-base font-black text-brand-dark">Quiz Evaluation Completed</h4>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-dark text-white uppercase tracking-wider">
                          Attempt Finalized (1/1)
                        </span>
                      </div>
                      <p className="text-xs text-brand-textSecondary">
                        Score: <strong>{quizResults.score}</strong> / {quizResults.totalQuestions} ({quizResults.accuracy}%) • Only 1 attempt allowed. Your evaluation is permanently stored.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-2xl font-black text-brand-dark leading-tight">
                          {quizResults.accuracy}%
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-textSecondary">
                          {quizResults.accuracy >= 70 ? 'Passed 🌟' : 'Needs Review'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pre-submission Single Attempt Warning Notice */}
                {!quizResults && (
                  <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 shadow-xs">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <span className="font-bold text-amber-950">Single Attempt Policy: </span>
                      You have <strong>only 1 chance</strong> to attempt this quiz. Once you click submit, your answers will be recorded in the backend and cannot be retaken.
                    </div>
                  </div>
                )}

                {/* Question Cards */}
                <div className="space-y-5">
                  {quizData.questions.map((q, idx) => {
                    const selected = quizAnswers[q.id];
                    const detailedResult = quizResults?.results?.find((r) => r.questionId === q.id);

                    return (
                      <div
                        key={q.id}
                        className="p-5 bg-brand-surfaceHover/50 border border-brand-border rounded-2xl space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-brand-dark text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-bold text-brand-dark leading-snug">
                            {q.question}
                          </p>
                        </div>

                        {/* 4 Options */}
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {q.options.map((opt, optIdx) => {
                            let optionStyle =
                              'bg-white border-brand-border text-brand-textPrimary hover:bg-brand-surfaceHover';

                            if (selected === optIdx) {
                              optionStyle =
                                'bg-brand-yellowSubtle border-brand-yellowBorder ring-1 ring-brand-yellow font-bold text-brand-dark';
                            }

                            if (detailedResult) {
                              if (optIdx === detailedResult.correctAnswer) {
                                optionStyle =
                                  'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold ring-1 ring-emerald-400';
                              } else if (selected === optIdx && !detailedResult.isCorrect) {
                                optionStyle =
                                  'bg-red-50 border-red-300 text-red-800 line-through';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={!!quizResults}
                                onClick={() =>
                                  setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })
                                }
                                className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${optionStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {detailedResult && detailedResult.explanation && (
                          <div className="p-3 bg-white border border-brand-border rounded-xl text-xs text-brand-textSecondary mt-2">
                            <strong className="text-brand-dark">Explanation:</strong> {detailedResult.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizResults && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-medium text-brand-textSecondary px-1">
                      <span>
                        Answered: <strong className="text-brand-dark">{Object.keys(quizAnswers).length}</strong> / {quizData.questions.length} Questions
                      </span>
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 1 Final Attempt
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      loading={quizLoading}
                      onClick={handleQuizSubmit}
                      className="w-full py-3.5 font-bold text-sm shadow-md"
                    >
                      Submit Quiz Evaluation (1 Attempt Only) →
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INTERVIEW QUESTIONS                                */}
        {/* ======================================================== */}
        {currentTab === 'interview' && (
          <div className="py-6 space-y-5">
            {interviewLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !interviewData || interviewData.questions?.length === 0 ? (
              <div className="text-center py-12 bg-brand-surfaceHover rounded-2xl">
                <Award className="w-10 h-10 text-brand-muted mx-auto mb-2" />
                <h4 className="text-sm font-bold text-brand-dark mb-1">
                  No Interview Questions Yet for {topic.title}
                </h4>
                <p className="text-xs text-brand-textSecondary mb-4">
                  Check out the coding problem practice tab.
                </p>
                <Button variant="secondary" size="sm" onClick={() => handleTabChange('practice')}>
                  Go to Problem Practice →
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-brand-textSecondary">
                  Study these interview questions for <strong>{topic.title}</strong> and self-assess your readiness.
                </p>

                {interviewData.questions.map((q, idx) => {
                  const isRevealed = revealedAnswers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-5 bg-white border border-brand-border rounded-2xl shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-brand-surfaceHover text-brand-dark text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-brand-dark">{q.question}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  q.difficulty === 'hard'
                                    ? 'dark'
                                    : q.difficulty === 'medium'
                                    ? 'yellow'
                                    : 'neutral'
                                }
                                size="xs"
                              >
                                {q.difficulty}
                              </Badge>
                              <span className="text-[11px] text-brand-muted font-medium">
                                Status: {q.reviewStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setRevealedAnswers({
                              ...revealedAnswers,
                              [q.id]: !isRevealed,
                            })
                          }
                          className="flex items-center gap-1.5 text-xs font-semibold text-brand-dark hover:underline shrink-0"
                        >
                          {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span>{isRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                        </button>
                      </div>

                      {/* Revealed Answer Box */}
                      {isRevealed && (
                        <div className="p-4 bg-brand-surfaceHover border border-brand-border rounded-xl text-xs text-brand-textPrimary leading-relaxed space-y-3">
                          <p className="font-bold text-brand-dark flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-brand-yellow" />
                            Model Answer:
                          </p>
                          <div
                            className="whitespace-pre-line leading-relaxed font-normal text-brand-dark"
                            dangerouslySetInnerHTML={{ __html: q.answer }}
                          />

                          {/* Optional code snippet if present */}
                          {q.starterCode && (
                            <div className="mt-3 space-y-1.5">
                              <span className="font-bold text-brand-dark">Code Template / Snippet:</span>
                              <pre className="p-3 bg-brand-darkBg text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-brand-border">
                                {q.starterCode}
                              </pre>
                            </div>
                          )}

                          {/* Optional reference solution if present */}
                          {q.solution && (
                            <div className="mt-3 space-y-1.5">
                              <span className="font-bold text-brand-dark">Reference Solution:</span>
                              <pre className="p-3 bg-[#0D1117] text-[#4ADE80] font-mono text-xs rounded-xl overflow-x-auto border border-[#30363D]">
                                {q.solution}
                              </pre>
                            </div>
                          )}

                          {q.explanation && q.explanation !== q.answer && (
                            <div className="mt-2 p-3 bg-white/80 border border-brand-border rounded-lg text-[11px] text-brand-textSecondary leading-relaxed">
                              <strong>Note:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Confidence Rating Buttons */}
                      <div className="pt-2 border-t border-brand-border/60 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-brand-textSecondary mr-2">
                          Your Understanding:
                        </span>
                        {[
                          { id: 'NOT_REVIEWED', label: 'Unsure' },
                          { id: 'NEEDS_REVISION', label: 'Needs Revision' },
                          { id: 'REVIEWED', label: 'Understand' },
                          { id: 'CONFIDENT', label: 'Interview Ready 🌟' },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => handleInterviewConfidence(q.id, btn.id)}
                            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                              q.reviewStatus === btn.id
                                ? 'bg-brand-dark text-white border-brand-dark font-bold'
                                : 'bg-white border-brand-border text-brand-textSecondary hover:bg-brand-surfaceHover'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PRACTICE (UNDERSTAND QUESTION, METHODS, EXAMPLES) */}
        {/* ======================================================== */}
        {currentTab === 'practice' && (
          <div className="py-6 space-y-6">
            {practiceLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !practiceData || practiceData.questions?.length === 0 ? (
              <div className="text-center py-12 bg-brand-surfaceHover rounded-2xl">
                <Code2 className="w-10 h-10 text-brand-muted mx-auto mb-2" />
                <h4 className="text-sm font-bold text-brand-dark mb-1">
                  No Practice Problems for {topic.title}
                </h4>
                <p className="text-xs text-brand-textSecondary mb-4">
                  Explore other problems in the Global Practice Arena.
                </p>
                <Link to="/app/practice">
                  <Button variant="secondary" size="sm">
                    Open Practice Arena →
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                {/* Problem Selector if multiple */}
                {practiceData.questions.length > 1 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {practiceData.questions.map((q, qIdx) => (
                      <button
                        key={q._id}
                        type="button"
                        onClick={() => {
                          setActivePracticeIndex(qIdx);
                          setCopiedCode(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          activePracticeIndex === qIdx
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'bg-white text-brand-textSecondary border-brand-border hover:bg-brand-surfaceHover'
                        }`}
                      >
                        Problem {qIdx + 1}: {q.title}
                      </button>
                    ))}
                  </div>
                )}

                {(() => {
                  const currentProblem =
                    practiceData.questions[activePracticeIndex] || practiceData.questions[0];

                  return (
                    <div className="space-y-6">
                      {/* Problem Header Card */}
                      <div className="p-6 bg-brand-surfaceHover/70 border border-brand-border rounded-2xl space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-brand-dark px-2.5 py-1 rounded-lg bg-white border border-brand-border shadow-xs">
                              Problem #{activePracticeIndex + 1}
                            </span>
                            <h3 className="text-lg font-black text-brand-dark">
                              {currentProblem.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {currentProblem.type && (
                              <Badge variant="neutral" size="sm" className="uppercase font-bold tracking-wider text-[10px]">
                                {currentProblem.type}
                              </Badge>
                            )}
                            <Badge
                              variant={
                                currentProblem.difficulty === 'hard'
                                  ? 'dark'
                                  : currentProblem.difficulty === 'medium'
                                  ? 'yellow'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {currentProblem.difficulty}
                            </Badge>
                          </div>
                        </div>

                        {/* Statement */}
                        <div className="text-xs text-brand-textPrimary leading-relaxed whitespace-pre-wrap">
                          {currentProblem.statement}
                        </div>
                      </div>

                      {/* Attributes & Variables Specification */}
                      {currentProblem.attributes && currentProblem.attributes.length > 0 && (
                        <div className="p-5 bg-white border border-brand-border rounded-2xl space-y-3 shadow-sm">
                          <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-brand-yellow" />
                            Attributes & Variable Specification
                          </h4>

                          <div className="space-y-2">
                            {currentProblem.attributes.map((attr, aIdx) => (
                              <div
                                key={aIdx}
                                className="p-3 bg-brand-surfaceHover rounded-xl text-xs font-mono"
                              >
                                <div className="font-bold text-brand-dark">
                                  {attr.dataType ? `${attr.dataType} ` : ''}{attr.name}
                                </div>
                                {attr.description && (
                                  <div className="text-brand-textSecondary font-sans text-[11px] mt-1">
                                    {attr.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Methods & Signatures Specification */}
                      {currentProblem.methods && currentProblem.methods.length > 0 && (
                        <div className="p-5 bg-white border border-brand-border rounded-2xl space-y-3 shadow-sm">
                          <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-brand-yellow" />
                            Method Specification
                          </h4>

                          <div className="space-y-2">
                            {currentProblem.methods.map((m, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-3 bg-brand-surfaceHover rounded-xl text-xs font-mono"
                              >
                                <div className="font-bold text-brand-dark">
                                  {m.returnType || 'void'} {m.name}({m.parameters || ''})
                                </div>
                                {m.description && (
                                  <div className="text-brand-textSecondary font-sans text-[11px] mt-1">
                                    {m.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Input / Output Test Case Examples */}
                      {currentProblem.examples && currentProblem.examples.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                            Examples & Test Cases
                          </h4>

                          <div className="space-y-3">
                            {currentProblem.examples.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="p-4 bg-white border border-brand-border rounded-xl space-y-2 shadow-sm"
                              >
                                <div className="text-xs font-bold text-brand-dark">
                                  Example {exIdx + 1}
                                </div>
                                {ex.input && (
                                  <div className="text-xs">
                                    <span className="font-semibold text-brand-textSecondary">Input: </span>
                                    <code className="bg-brand-surfaceHover px-2 py-0.5 rounded text-brand-dark font-mono text-[11px]">
                                      {ex.input}
                                    </code>
                                  </div>
                                )}
                                {ex.output && (
                                  <div className="text-xs">
                                    <span className="font-semibold text-brand-textSecondary">Output: </span>
                                    <code className="bg-brand-surfaceHover px-2 py-0.5 rounded text-brand-dark font-mono text-[11px]">
                                      {ex.output}
                                    </code>
                                  </div>
                                )}
                                {ex.explanation && (
                                  <p className="text-[11px] text-brand-textSecondary mt-1 leading-relaxed">
                                    <strong>Explanation:</strong> {ex.explanation}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Constraints & Hints */}
                      {(currentProblem.constraints?.length > 0 || currentProblem.hints?.length > 0) && (
                        <div className="p-4 bg-brand-surfaceHover/50 border border-brand-border rounded-xl space-y-2 text-xs">
                          {currentProblem.constraints?.length > 0 && (
                            <div>
                              <span className="font-bold text-brand-dark">Constraints:</span>
                              <ul className="list-disc list-inside text-brand-textSecondary mt-1 space-y-0.5">
                                {currentProblem.constraints.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {currentProblem.hints?.length > 0 && (
                            <div className="pt-2">
                              <span className="font-bold text-brand-dark">💡 Hints:</span>
                              <ul className="list-disc list-inside text-brand-textSecondary mt-1 space-y-0.5">
                                {currentProblem.hints.map((h, i) => (
                                  <li key={i}>{h}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Starter Code with 1-Click Copy */}
                      {currentProblem.starterCode && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-dark">
                              Starter Code Template
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(currentProblem.starterCode)}
                              className="flex items-center gap-1.5 text-xs font-bold text-brand-dark px-3 py-1.5 bg-brand-yellowSubtle border border-brand-yellowBorder rounded-lg hover:bg-brand-yellow/20 transition-colors"
                            >
                              {copiedCode ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied to Clipboard!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Template</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-4 bg-brand-darkBg text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-brand-border">
                            {currentProblem.starterCode}
                          </pre>
                        </div>
                      )}

                      {/* Official Solution Section Under Template: Actual Backend Solution */}
                      {(() => {
                        const solutionCode = currentProblem.solution || currentProblem.solutionCode || null;
                        const problemKey = String(currentProblem._id || currentProblem.id || activePracticeIndex);
                        const isSolutionRevealed = revealedSolutions[problemKey] ?? true;

                        return (
                          <div className="space-y-3 pt-3 border-t border-brand-border/70">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                                  <Code2 className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-xs font-black text-brand-dark uppercase tracking-wider">
                                  Official Solution
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                                  Reference Implementation
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleSolution(problemKey)}
                                  className="text-xs font-bold text-brand-textSecondary hover:text-brand-dark flex items-center gap-1.5 px-3 py-1 rounded-lg border border-brand-border bg-white hover:bg-brand-surfaceHover transition-all shadow-sm"
                                >
                                  {isSolutionRevealed ? (
                                    <>
                                      <EyeOff className="w-3.5 h-3.5" />
                                      <span>Hide Solution</span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3.5 h-3.5 text-[#D97706]" />
                                      <span>Reveal Solution</span>
                                    </>
                                  )}
                                </button>

                                {isSolutionRevealed && solutionCode && (
                                  <button
                                    type="button"
                                    onClick={() => handleCopySolution(solutionCode)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-brand-dark px-3 py-1 bg-brand-yellowSubtle border border-brand-yellowBorder rounded-lg hover:bg-brand-yellow/20 transition-colors shadow-sm"
                                  >
                                    {copiedSolution ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-emerald-700 font-bold">Copied Solution!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Solution</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>

                            {isSolutionRevealed && (
                              <div className="space-y-3">
                                {solutionCode ? (
                                  <pre className="p-4 bg-[#0D1117] text-[#4ADE80] font-mono text-xs rounded-2xl overflow-x-auto border border-[#30363D] shadow-md leading-relaxed whitespace-pre font-medium">
                                    {solutionCode}
                                  </pre>
                                ) : (
                                  <div className="p-4 bg-brand-surfaceHover/80 border border-brand-border rounded-xl text-xs text-brand-textSecondary text-center">
                                    Official reference solution is being prepared for this problem. Try practicing using the starter template above!
                                  </div>
                                )}

                                {/* Solution Logic & Approach */}
                                {currentProblem.explanation && (
                                  <div className="p-4 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/60 to-white border border-[#F59E0B]/30 rounded-xl text-xs text-[#78350F] leading-relaxed font-medium space-y-1">
                                    <strong className="block text-[#92400E] font-bold text-[11px] uppercase tracking-wider">
                                      💡 Solution Logic & Approach:
                                    </strong>
                                    <p className="whitespace-pre-line">{currentProblem.explanation}</p>
                                  </div>
                                )}

                                {/* Additional Explanation / Concepts Tested */}
                                {currentProblem.additionalExplanation && (
                                  <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-xl text-xs text-sky-900 leading-relaxed font-medium space-y-1">
                                    <strong className="block text-sky-800 font-bold text-[11px] uppercase tracking-wider">
                                      📘 Additional Deep Dive & Concepts Tested:
                                    </strong>
                                    <p className="whitespace-pre-line">{currentProblem.additionalExplanation}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* External Practice Recommendation Card */}
                      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs text-sky-900 leading-relaxed">
                          <strong>💡 Self-Paced Practice:</strong> You can copy the starter code above to practice in your preferred IDE (VS Code, IntelliJ) or on platforms like LeetCode / HackerRank.
                        </div>
                        <Button
                          variant={practiceMarked ? 'secondary' : 'primary'}
                          size="sm"
                          loading={practiceLoading}
                          onClick={() => handleMarkPracticeDone(currentProblem._id)}
                          className={`font-bold text-xs shrink-0 ${
                            practiceMarked ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : ''
                          }`}
                        >
                          {practiceMarked ? '✓ Practiced & Understood' : 'Mark as Practiced ✓'}
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Bottom Topic Navigation: Previous & Next Topic */}
          <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {prevTopic ? (
              <Link
                to={`/app/courses/${courseSlug}/${prevTopic.categorySlug}/${prevTopic.slug}?tab=content`}
                className="w-full sm:w-auto flex items-center gap-3 px-5 py-3 rounded-2xl border border-brand-border bg-brand-surfaceHover/60 hover:bg-white hover:border-brand-yellow text-xs font-bold text-brand-dark transition-all shadow-sm group"
              >
                <ChevronLeft className="w-4 h-4 text-brand-textSecondary group-hover:text-brand-dark group-hover:-translate-x-0.5 transition-transform" />
                <div className="text-left">
                  <span className="block text-[10px] text-brand-textSecondary uppercase tracking-wider font-extrabold">Previous Topic</span>
                  <span className="text-xs font-bold text-brand-dark truncate max-w-[200px] block">{prevTopic.title}</span>
                </div>
              </Link>
            ) : <div />}

            {nextTopic && (
              <Link
                to={`/app/courses/${courseSlug}/${nextTopic.categorySlug}/${nextTopic.slug}?tab=content`}
                className="w-full sm:w-auto flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-brand-dark hover:bg-black text-xs font-bold text-white transition-all shadow-md ml-auto group"
              >
                <div className="text-right">
                  <span className="block text-[10px] text-brand-yellow uppercase tracking-wider font-extrabold">Next Topic</span>
                  <span className="text-xs font-bold text-white truncate max-w-[200px] block">{nextTopic.title}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-yellow group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  </section>
</div>
  );
};

export default TopicPage;
