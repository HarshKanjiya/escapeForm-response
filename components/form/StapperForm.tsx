"use client";

import { FormWithQuestionsAndEdges } from "@/types/common";
import { Question } from "@prisma/client";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import RenderFormField from "./RenderFormField";
import SignInRequired from "./SignInRequired";

interface StapperFormProps {
  form: FormWithQuestionsAndEdges
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 250 : -250,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 250 : -250,
    opacity: 0
  })
};


const StapperForm = ({ form }: StapperFormProps) => {
  const { data: session, status } = useSession();
  const [dataSource, setDataSource] = useState<Record<string, string | number | boolean | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [welcomeScreen, setWelcomeScreen] = useState<Question | null>(null);
  const [endScreen, setEndScreen] = useState<Question | null>(null);
  const [formStarted, setFormStarted] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Check if authentication is required
  const requiresAuth = !form.multipleSubmissions || !form.allowAnonymous;

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps - 1;

  const metaData = {
    primaryColor: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.primaryColor as string | undefined) ?? '#6336F7' : '#6336F7',
    secondaryColor: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.secondaryColor as string | undefined) ?? '#2563eb' : '#2563eb',
    actionBtnSize: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.actionBtnSize as 'sm' | 'default' | 'lg' | 'xl' | undefined) ?? 'default' : 'default',
    backBtnLabel: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.backBtnLabel as string | undefined) ?? 'Back' : 'Back',
    nextBtnLabel: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.nextBtnLabel as string | undefined) ?? 'Next' : 'Next',
    submitBtnLabel: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.submitBtnLabel as string | undefined) ?? 'Submit' : 'Submit'
  }

  useEffect(() => {
    if (!form) return;
    const allQuestions = form.questions as Question[];

    // Separate welcome and end screens from regular questions
    const welcome = allQuestions.find(q => q.type === 'SCREEN_WELCOME');
    const end = allQuestions.find(q => q.type === 'SCREEN_END');
    const regularQuestions = allQuestions.filter(
      q => q.type !== 'SCREEN_WELCOME' && q.type !== 'SCREEN_END'
    );

    setWelcomeScreen(welcome || null);
    setEndScreen(end || null);
    setQuestions(regularQuestions);

    // If no welcome screen, start the form automatically
    if (!welcome) {
      setFormStarted(true);
    }
  }, [])


  useEffect(() => {
    if (metaData.primaryColor) {
      document.documentElement.style.setProperty('--primary', metaData.primaryColor);
      let metaTag = document.querySelector('meta[name="theme-color"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'theme-color');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', metaData.primaryColor);
    }

    return () => {
      document.documentElement.style.removeProperty('--primary');
      const metaTag = document.querySelector('meta[name="theme-color"]');
      if (metaTag) {
        metaTag.remove();
      }
    };
  }, [metaData.primaryColor]);

  // Animate progress value with staggered effect
  useEffect(() => {
    const targetProgress = progress;
    const startProgress = animatedProgress;
    const difference = targetProgress - startProgress;
    const duration = 800;
    const steps = 30;
    const stepDuration = duration / steps;

    let currentAnimationStep = 0;
    const animationInterval = setInterval(() => {
      currentAnimationStep++;

      if (currentAnimationStep >= steps) {
        setAnimatedProgress(targetProgress);
        clearInterval(animationInterval);
      } else {
        // Easing function for smooth animation (ease-out)
        const easingFactor = 1 - Math.pow(1 - currentAnimationStep / steps, 3);
        const newProgress = startProgress + (difference * easingFactor);
        setAnimatedProgress(newProgress);
      }
    }, stepDuration);

    return () => clearInterval(animationInterval);
  }, [progress]);

  const handleFieldChange = (questionId: string, value: string | number | boolean | string[]) => {
    setDataSource(prev => ({
      ...prev,
      [questionId]: value
    }));

    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: []
      }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const question = currentQuestion;
    const value = dataSource[question.id];

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (!isLastStep) {
        setDirection(1); // Moving forward
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setDirection(-1); // Moving backward
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      completeSubmission();
    }
  };

  const completeSubmission = () => {
    console.log('Form submitted:', dataSource);

    // Log user info if signed in
    if (session?.user) {
      console.log('User submitting form:', {
        googleUserId: (session.user as any).googleId,
        email: session.user.email,
        name: session.user.name,
        formId: form.id,
        // responseId will be generated when saving to database
      });
    }

    setFormCompleted(true);
    setPendingSubmit(false);
    // Handle form submission here
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { redirect: false });
  };

  const handleStartForm = () => {
    // Check if authentication is required before starting the form
    if (requiresAuth && !session) {
      setPendingSubmit(true);
      return;
    }
    setFormStarted(true);
  };

  // Effect to start form after successful sign-in
  useEffect(() => {
    if (pendingSubmit && session && !formStarted) {
      setFormStarted(true);
      setPendingSubmit(false);
    }
  }, [session, pendingSubmit, formStarted]);

  const handleResetForm = () => {
    // Reset all form state
    setDataSource({});
    setErrors({});
    setCurrentStep(0);
    setDirection(0);
    setAnimatedProgress(0);
    setCompletedSteps(new Set());
    setFormCompleted(false);

    // If welcome screen exists, go back to it, otherwise stay in form
    if (welcomeScreen) {
      setFormStarted(false);
    }
  };

  const handleEndScreenNext = () => {
    // You can add logic here for what happens after end screen
    console.log('End screen completed');
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (isLastStep) {
          handleSubmit();
        } else {
          handleNext();
        }
      } else if (event.key === 'ArrowLeft' && event.ctrlKey) {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'ArrowRight' && event.ctrlKey) {
        event.preventDefault();
        handleNext();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);



  // Show sign-in screen if authentication is required and user is not signed in
  if (pendingSubmit && requiresAuth && !session) {
    return (
      <SignInRequired
        status={status}
        onBack={() => setPendingSubmit(false)}
        showBackButton={!!welcomeScreen}
      />
    );
  }

  // Show welcome screen if not started and welcome screen exists
  if (!formStarted && welcomeScreen) {
    return (
      <div className="p-6 h-full w-full flex items-center justify-center">
        <RenderFormField
          question={welcomeScreen}
          onChange={handleStartForm}
          value={undefined}
          error={undefined}
          form={form}
        />
      </div>
    );
  }

  // Show end screen if form completed and end screen exists
  if (formCompleted && endScreen) {
    return (
      <div className="p-6 h-full w-full flex items-center justify-center">
        <RenderFormField
          question={endScreen}
          onChange={handleEndScreenNext}
          value={undefined}
          error={undefined}
          onReset={form.multipleSubmissions ? handleResetForm : undefined}
        />
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <div className="p-8 h-full w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-muted-foreground">No Form Fields</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Add some questions to see the form preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full w-full flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-8 mt-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={animatedProgress} className="h-2" />
        </div>

        {/* Form Content */}
        <div className="relative min-h-[370px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: {
                  type: "tween",
                  duration: 0.35,
                  ease: [0.25, 0.19, 0.25, 0.94]
                },
                opacity: {
                  duration: 0.35,
                  ease: [0.25, 0.19, 0.25, 0.94]
                }
              }}
              className="min-h-[160px] flex items-center justify-center flex-col w-full"
            >
              {currentQuestion &&
                <RenderFormField
                  key={currentQuestion.id}
                  question={currentQuestion}
                  onChange={(v) => handleFieldChange(currentQuestion.id, v)}
                  value={dataSource[currentQuestion.id]}
                  error={errors[currentQuestion.id]}
                />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-12 border-t">
          <AnimatePresence>
            {
              !isFirstStep ?
                <motion.div
                  key="back-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size={metaData.actionBtnSize || 'lg'}
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    {metaData.backBtnLabel || 'Back'}
                  </Button>
                </motion.div> : <span></span>
            }
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isLastStep ? (
              <motion.div
                key="submit-button"
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 30 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size={metaData.actionBtnSize || 'lg'}
                  onClick={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  {metaData.submitBtnLabel || 'Submit'}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="next-button"
                initial={{ opacity: 0, scale: 0.9, x: -30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size={metaData.actionBtnSize || 'lg'}
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {metaData.nextBtnLabel || 'Next'}
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default StapperForm