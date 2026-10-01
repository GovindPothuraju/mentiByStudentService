import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import {
  Compass,
  Map,
  CheckCircle2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Code2,
  Award,
  ArrowRight,
  Flame,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellowSubtle border border-brand-yellowBorder text-brand-dark text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
          <span>The Complete Learning Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-[1.1] mb-6">
          Learn. Practice. Prepare. <br />
          <span className="text-brand-dark underline decoration-brand-yellow decoration-wavy decoration-2">
            Get Interview Ready.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-brand-textSecondary max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Stop getting lost in endless tutorial videos. MentiBY builds an intelligent, adaptive roadmap tailored to your available daily hours and tracks every concept, quiz, coding problem, and interview question.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link to="/app/dashboard">
              <Button variant="primary" size="lg" className="font-bold w-full sm:w-auto shadow-md">
                Launch Student Dashboard →
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={() => openAuthModal('register')}
                className="font-bold w-full sm:w-auto shadow-md"
              >
                Start Learning Free →
              </Button>
              <Link to="/app/courses">
                <Button variant="secondary" size="lg" className="font-semibold w-full sm:w-auto">
                  Explore Courses
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Floating Metrics Banner */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white border border-brand-border rounded-2xl shadow-sm text-left">
          <div className="border-r border-brand-border/60 pr-4">
            <div className="text-2xl font-black text-brand-dark">300+</div>
            <div className="text-xs text-brand-textSecondary font-medium">Interview Topics</div>
          </div>
          <div className="border-r border-brand-border/60 pr-4">
            <div className="text-2xl font-black text-brand-dark">100%</div>
            <div className="text-xs text-brand-textSecondary font-medium">Personalized Roadmaps</div>
          </div>
          <div className="border-r border-brand-border/60 pr-4">
            <div className="text-2xl font-black text-brand-dark">4 Dimensions</div>
            <div className="text-xs text-brand-textSecondary font-medium">Content, Quiz, Interview, Practice</div>
          </div>
          <div>
            <div className="text-2xl font-black text-brand-dark">0 Fluff</div>
            <div className="text-xs text-brand-textSecondary font-medium">Direct Placement Focus</div>
          </div>
        </div>
      </section>

      {/* How MentiBY Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-textSecondary mb-2">The Closed-Loop Method</h2>
          <h3 className="text-3xl font-extrabold text-brand-dark">How MentiBY Works</h3>
          <p className="text-sm text-brand-textSecondary mt-2">
            You will never wonder what to learn next. MentiBY continuously answers your next step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-brand-border rounded-2xl p-7 relative hover:shadow-cardHover transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-yellowSubtle text-brand-dark flex items-center justify-center font-bold text-lg mb-5 border border-brand-yellowBorder">
              1
            </div>
            <h4 className="text-lg font-bold text-brand-dark mb-2">Build Your Roadmap</h4>
            <p className="text-sm text-brand-textSecondary leading-relaxed">
              Choose your target days and available hours. Our bin-packing algorithm weights topics by effort and creates a balanced daily calendar.
            </p>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-7 relative hover:shadow-cardHover transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-yellowSubtle text-brand-dark flex items-center justify-center font-bold text-lg mb-5 border border-brand-yellowBorder">
              2
            </div>
            <h4 className="text-lg font-bold text-brand-dark mb-2">Execute Today's Plan</h4>
            <p className="text-sm text-brand-textSecondary leading-relaxed">
              Open your dashboard and receive your exact checklist: Read concepts, verify with quizzes, practice code, and rehearse interview questions.
            </p>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-7 relative hover:shadow-cardHover transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-yellowSubtle text-brand-dark flex items-center justify-center font-bold text-lg mb-5 border border-brand-yellowBorder">
              3
            </div>
            <h4 className="text-lg font-bold text-brand-dark mb-2">Adaptive Recalculation</h4>
            <p className="text-sm text-brand-textSecondary leading-relaxed">
              Missed a day? MentiBY intelligently shifts incomplete tasks forward without wiping your completed history or breaking your streak.
            </p>
          </div>
        </div>
      </section>

      {/* Personalized Roadmaps Feature Showcase */}
      <section id="roadmaps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest">Intelligent Scheduling</span>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 mb-4 leading-tight">
              A Roadmap That Adapts When Life Happens.
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed">
              Standard curricula assume you're a robot studying at a flat rate. MentiBY calculates effort weights for every topic: basic variables take 30 mins, but multithreading takes 3 hours. When you miss a day, the system recalculates remaining capacity seamlessly.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>Weighted topic effort packing (never uniform division)</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>Custom study days (Mon-Fri or weekends only)</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>One-click adaptive rescheduling for delayed topics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Learning Dimensions */}
      <section id="interview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-textSecondary mb-2">Complete Coverage</h2>
          <h3 className="text-3xl font-extrabold text-brand-dark">The 4-Dimensional Learning Space</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-brand-border p-6 rounded-2xl hover:border-brand-dark transition-colors">
            <div className="w-10 h-10 rounded-xl bg-brand-surfaceHover flex items-center justify-center text-brand-dark mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-dark mb-1">1. Deep Content</h4>
            <p className="text-xs text-brand-textSecondary">
              Rich, illustrated concept guides, syntax explanations, and architectural rules.
            </p>
          </div>

          <div className="bg-white border border-brand-border p-6 rounded-2xl hover:border-brand-dark transition-colors">
            <div className="w-10 h-10 rounded-xl bg-brand-surfaceHover flex items-center justify-center text-brand-dark mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-dark mb-1">2. Topic Quizzes</h4>
            <p className="text-xs text-brand-textSecondary">
              Concept validation with instant feedback, answer explanations, and accuracy tracking.
            </p>
          </div>

          <div className="bg-white border border-brand-border p-6 rounded-2xl hover:border-brand-dark transition-colors">
            <div className="w-10 h-10 rounded-xl bg-brand-surfaceHover flex items-center justify-center text-brand-dark mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-dark mb-1">3. Interview Questions</h4>
            <p className="text-xs text-brand-textSecondary">
              Frequently asked interview traps with 4-level self-assessed confidence ratings.
            </p>
          </div>

          <div className="bg-white border border-brand-border p-6 rounded-2xl hover:border-brand-dark transition-colors">
            <div className="w-10 h-10 rounded-xl bg-brand-surfaceHover flex items-center justify-center text-brand-dark mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-brand-dark mb-1">4. Coding Practice</h4>
            <p className="text-xs text-brand-textSecondary">
              Hands-on algorithmic implementation problems with test cases and solution checks.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white border-2 border-brand-border rounded-3xl p-10 sm:p-14 shadow-card">
          <div className="inline-flex p-3 rounded-2xl bg-brand-yellowSubtle mb-4">
            <Flame className="w-8 h-8 text-brand-yellow fill-brand-yellow" />
          </div>
          <h3 className="text-3xl font-black text-brand-dark mb-3">Ready to become interview ready?</h3>
          <p className="text-sm text-brand-textSecondary max-w-lg mx-auto mb-8">
            Join MentiBY today. Create your customized roadmap and know exactly what to learn every single morning.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => openAuthModal('register')}
            className="font-bold px-8 shadow-md"
          >
            Start Learning for Free →
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
