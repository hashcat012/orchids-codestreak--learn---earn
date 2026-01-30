"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { LANGUAGE_LESSONS } from "@/lib/lessons";
import { 
  Flame, 
  ChevronLeft, 
  BookOpen, 
  HelpCircle, 
  Code2, 
  CheckCircle2, 
  AlertCircle,
  Play,
  ArrowRight,
  Trophy,
  Check,
  X,
  Star,
  FastForward
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LessonPage() {
  const { id } = useParams();
  const { profile, loading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(0); 
  const [quizIdx, setQuizIdx] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [theoryOpen, setTheoryOpen] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'error' | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [codeFeedback, setCodeFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const language = profile?.selectedLanguage || "JavaScript";
  const curriculum = LANGUAGE_LESSONS[language] || LANGUAGE_LESSONS["JavaScript"];
  const lesson = curriculum[id as string];

  useEffect(() => {
    if (lesson && step === 2) {
      setCode(lesson.challenges[challengeIdx]?.initialCode || "");
    }
  }, [lesson, step, challengeIdx]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg"></div>
    </div>
  );

  if (!profile) {
    router.push("/login");
    return null;
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Lesson Not Found</h2>
        <Link href="/roadmap" className="text-orange-500 font-bold hover:underline">Return to Roadmap</Link>
      </div>
    );
  }

  const handleQuizSubmit = () => {
    const currentQuiz = lesson.quizzes[quizIdx];
    if (selectedOption === currentQuiz.correctIndex) {
      setQuizFeedback('correct');
      setHint(null);
      setWrongCount(0);
      setTimeout(() => {
        if (quizIdx < lesson.quizzes.length - 1) {
          setQuizIdx(quizIdx + 1);
          setSelectedOption(null);
          setQuizFeedback(null);
        } else {
          setStep(2);
          setQuizFeedback(null);
        }
      }, 1000);
    } else {
      setQuizFeedback('error');
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      setTotalWrong(prev => prev + 1);
      
      if (newWrongCount === 1) {
        setHint(currentQuiz.hint1);
      } else if (newWrongCount >= 2) {
        setHint(currentQuiz.hint2);
      }
    }
  };

  const skipQuestion = () => {
    setHint(null);
    setWrongCount(0);
    setTotalWrong(prev => prev + 2); // Penalty
    if (quizIdx < lesson.quizzes.length - 1) {
      setQuizIdx(quizIdx + 1);
      setSelectedOption(null);
      setQuizFeedback(null);
    } else {
      setStep(2);
      setQuizFeedback(null);
    }
  };

  const runCode = async () => {
    const currentChallenge = lesson.challenges[challengeIdx];
    const normalizedUserCode = code.replace(/\s/g, '');
    const normalizedSolution = currentChallenge.solution.replace(/\s/g, '');

    if (normalizedUserCode.includes(normalizedSolution) || normalizedUserCode === normalizedSolution) {
      if (challengeIdx < lesson.challenges.length - 1) {
        setCodeFeedback({ type: 'success', message: "Correct! Next challenge." });
        setTimeout(() => {
          setChallengeIdx(challengeIdx + 1);
          setCodeFeedback(null);
        }, 1000);
      } else {
        setCodeFeedback({ type: 'success', message: "Correct! Lesson Complete." });
        finishLesson();
      }
    } else {
      setCodeFeedback({ type: 'error', message: "Not quite right. Try again!" });
      setTotalWrong(prev => prev + 1);
    }
  };

  const finishLesson = async () => {
    setIsFinishing(true);
    try {
      const userDocRef = doc(db, "users", profile.uid);
      const updates: any = {};
      
      // Unlock next level in languageProgress
      updates[`languageProgress.${language}`] = arrayUnion(id);
      
      // Deduct coin if not admin
      if (!profile.isAdmin) {
        updates.coins = increment(-1);
      }
      
      await updateDoc(userDocRef, updates);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFinishing(false);
    }
  };

  const calculateStars = () => {
    if (totalWrong === 0) return 3;
    if (totalWrong <= 3) return 2;
    return 1;
  };

  const currentQuiz = lesson.quizzes[quizIdx];
  const currentChallenge = lesson.challenges[challengeIdx];

  const TheoryContent = () => (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-orange-500">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-xl font-black">{lesson.theory.title}</h2>
        </div>
        <button onClick={() => setTheoryOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <X className="h-5 w-5 text-zinc-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <p className="text-lg leading-relaxed text-zinc-600 mb-8 whitespace-pre-wrap">
          {lesson.theory.content}
        </p>
        {lesson.theory.example && (
          <div className="bg-zinc-900 rounded-2xl p-6 font-mono text-orange-400 overflow-x-auto border-2 border-zinc-800 text-sm">
            <pre>{lesson.theory.example}</pre>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-orange-500 selection:text-white flex flex-col">
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/roadmap" className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                {language} - {lesson.title}
              </h1>
              <div className="flex items-center gap-3">
                <p className="font-black text-zinc-900">
                  {step === 0 ? "Theory" : step === 1 ? `Quiz ${quizIdx + 1}/5` : step === 2 ? `Challenge ${challengeIdx + 1}/2` : "Done!"}
                </p>
                {step > 0 && step < 3 && !theoryOpen && (
                  <button 
                    onClick={() => setTheoryOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold hover:bg-orange-200 transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Show Lesson
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={`h-2 w-12 rounded-full transition-all duration-500 ${step > i ? 'bg-orange-500' : step === i ? 'bg-orange-500/40' : 'bg-zinc-200'}`}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`
          absolute left-0 top-0 h-full bg-zinc-50 transition-all duration-500 ease-in-out z-40 border-r border-zinc-200
          ${theoryOpen && step > 0 && step < 3 ? 'w-[450px] translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0'}
        `}>
          <div className="w-[450px] h-full p-6">
            <TheoryContent />
          </div>
        </aside>

        <main className={`flex-1 overflow-y-auto px-6 py-12 transition-all duration-500 ${theoryOpen && step > 0 && step < 3 ? 'ml-[450px]' : 'ml-0'}`}>
          <div className="mx-auto max-w-4xl h-full flex flex-col justify-center">
            {step === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6 text-orange-500">
                  <BookOpen className="h-8 w-8" />
                  <h2 className="text-3xl font-black">{lesson.theory.title}</h2>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-zinc-200/50 border border-zinc-100">
                  <p className="text-xl leading-relaxed text-zinc-600 mb-8 whitespace-pre-wrap">
                    {lesson.theory.content}
                  </p>
                  {lesson.theory.example && (
                    <div className="bg-zinc-900 rounded-2xl p-6 font-mono text-orange-400 overflow-x-auto border-4 border-zinc-800">
                      <pre>{lesson.theory.example}</pre>
                    </div>
                  )}
                  <button 
                    onClick={() => setStep(1)}
                    className="mt-12 w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                  >
                    Got it, let's test! <ArrowRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && currentQuiz && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-6 text-orange-500">
                  <HelpCircle className="h-8 w-8" />
                  <h2 className="text-3xl font-black">Question {quizIdx + 1}</h2>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-zinc-200/50 border border-zinc-100">
                  <p className="text-2xl font-bold text-zinc-900 mb-8">{currentQuiz.question}</p>
                  <div className="space-y-4">
                    {currentQuiz.options.map((option, index) => (
                      <button
                        key={index}
                        disabled={quizFeedback === 'correct'}
                        onClick={() => {
                          setSelectedOption(index);
                          setQuizFeedback(null);
                        }}
                        className={`w-full text-left p-6 rounded-2xl font-bold transition-all border-2 ${
                          selectedOption === index 
                            ? quizFeedback === 'correct'
                              ? 'bg-green-50 border-green-500 text-green-600'
                              : quizFeedback === 'error'
                                ? 'bg-red-50 border-red-500 text-red-600'
                                : 'bg-orange-50 border-orange-500 text-orange-600 scale-[1.02]' 
                            : 'bg-zinc-50 border-zinc-100 text-zinc-600 hover:bg-zinc-100 hover:border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {option}
                          {selectedOption === index && quizFeedback === 'correct' && <Check className="h-6 w-6" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {hint && (
                    <div className="mt-6 flex items-start gap-2 text-orange-600 bg-orange-50 p-4 rounded-xl font-bold animate-in slide-in-from-top-2 border border-orange-100">
                      <HelpCircle className="h-5 w-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Hint</p>
                        <p>{hint}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex gap-4">
                    {wrongCount >= 2 && (
                       <button 
                         onClick={skipQuestion}
                         className="flex-1 py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                       >
                         <FastForward className="h-5 w-5" /> Skip
                       </button>
                    )}
                    <button 
                      onClick={handleQuizSubmit}
                      disabled={selectedOption === null || quizFeedback === 'correct'}
                      className="flex-[2] py-4 bg-zinc-900 text-white rounded-2xl font-black text-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      {quizFeedback === 'correct' ? "Correct!" : "Submit Answer"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && currentChallenge && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                <div className="flex items-center gap-3 mb-6 text-orange-500">
                  <Code2 className="h-8 w-8" />
                  <h2 className="text-3xl font-black">Challenge {challengeIdx + 1}</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 shadow-xl shadow-zinc-200/50 border border-zinc-100">
                    <h3 className="text-xl font-black mb-4">Instructions</h3>
                    <p className="text-zinc-600 mb-6 font-medium leading-relaxed">
                      {currentChallenge.instruction}
                    </p>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-sm font-bold text-orange-600 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Hint
                      </p>
                      <p className="text-sm text-orange-700 mt-1">{currentChallenge.hint}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-zinc-900 rounded-3xl overflow-hidden border-4 border-zinc-800 shadow-2xl">
                      <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 border-b border-zinc-700">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="ml-2 text-xs font-bold text-zinc-400 font-mono tracking-wider uppercase">solution.{currentChallenge.language}</span>
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-64 bg-transparent p-6 font-mono text-orange-400 outline-none resize-none leading-relaxed"
                        spellCheck={false}
                      />
                      <div className="p-4 bg-zinc-800/50 border-t border-zinc-700 flex justify-between items-center">
                        <div className="text-xs font-bold text-zinc-500 uppercase">{currentChallenge.language}</div>
                        <button 
                          onClick={runCode}
                          disabled={isFinishing}
                          className="px-6 py-2 bg-orange-500 text-white rounded-xl font-black flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                        >
                          {isFinishing ? (
                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          ) : (
                            <Play className="h-4 w-4 fill-current" />
                          )}
                          Run Code
                        </button>
                      </div>
                    </div>

                    {codeFeedback && (
                      <div className={`p-6 rounded-2xl font-bold animate-in slide-in-from-top-2 flex items-center gap-3 ${
                        codeFeedback.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {codeFeedback.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                        {codeFeedback.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in zoom-in duration-700 flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-12">
                  <div className="h-40 w-40 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-500/50 animate-bounce">
                    <Trophy className="h-20 w-20" />
                  </div>
                  <div className="absolute -top-4 -right-4 h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-500">
                    <Star className="h-8 w-8 text-orange-500 fill-current" />
                  </div>
                </div>
                
                <h2 className="text-6xl font-black text-zinc-900 mb-4 tracking-tighter">LEVEL COMPLETE!</h2>
                
                <div className="flex gap-4 mb-8">
                  {[1, 2, 3].map((s) => (
                    <Star 
                      key={s} 
                      className={`h-12 w-12 ${s <= calculateStars() ? 'text-orange-500 fill-current' : 'text-zinc-200'}`} 
                    />
                  ))}
                </div>

                <p className="text-2xl font-bold text-zinc-500 mb-12">
                  {calculateStars() === 3 ? "Perfect Score! You're a natural." : calculateStars() === 2 ? "Great job! Almost perfect." : "Good effort! Keep practicing."}
                </p>

                <Link 
                  href="/roadmap"
                  className="px-16 py-6 bg-zinc-900 text-white rounded-[2rem] font-black text-2xl hover:bg-zinc-800 transition-all hover:scale-105 shadow-2xl active:scale-95"
                >
                  Return to Roadmap
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
