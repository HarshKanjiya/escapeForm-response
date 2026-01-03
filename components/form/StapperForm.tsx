"use client";

import { apiConstants } from "@/constants/api.constants";
import api from "@/lib/axios";
import { showError } from "@/lib/utils";
import { ActionResponse, FormWithQuestionsAndEdges, IFormResponse, Question } from "@/types/common";
import { AnimatePresence, motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import RenderFormField from "./RenderFormField";
import FormCompleted from "./formCompleted";

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

  // MAIN STATE
  const { data: session, status } = useSession();
  const [dataSource, setDataSource] = useState<Record<string, string | number | boolean | string[]>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formStarted, setFormStarted] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [responseDb, setResponseDb] = useState<IFormResponse | null>(null);
  const [initialSaveDone, setInitialSaveDone] = useState(false);

  // const [welcomeScreen, setWelcomeScreen] = useState<Question | null>(null);
  // const [endScreen, setEndScreen] = useState<Question | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());



  // Check if authentication is required
  // const requiresAuth = !form.multipleSubmissions || !form.allowAnonymous;

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const isFirstStep = currentStep === 0;
  const progress = (completedSteps.size / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps - 1;

  const metaData = {
    primaryColor: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.primaryColor as string | undefined) ?? '#6336F7' : '#6336F7',
    secondaryColor: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.secondaryColor as string | undefined) ?? '#2563eb' : '#2563eb',
    actionBtnSize: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.actionBtnSize as 'sm' | 'default' | 'lg' | 'xl' | undefined) ?? 'default' : 'default',
    backBtnLabel: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.backBtnLabel as string | undefined) ?? 'Back' : 'Back',
    nextBtnLabel: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.nextBtnLabel as string | undefined) ?? 'Next' : 'Next',
    submitBtnLabel: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.submitBtnLabel as string | undefined) ?? 'Submit' : 'Submit'
  }

  // useEffect(() => {
  //   if (!form) return;
  //   const allQuestions = form.questions as Question[];

  //   // Separate welcome and end screens from regular questions
  //   const welcome = allQuestions.find(q => q.type === 'SCREEN_WELCOME');
  //   const end = allQuestions.find(q => q.type === 'SCREEN_END');
  //   const regularQuestions = allQuestions.filter(
  //     q => q.type !== 'SCREEN_WELCOME' && q.type !== 'SCREEN_END'
  //   );

  //   // setWelcomeScreen(welcome || null);
  //   // setEndScreen(end || null);
  //   setQuestions(regularQuestions);

  //   // If no welcome screen, start the form automatically
  //   if (!welcome) {
  //     setFormStarted(true);
  //   }
  // }, [])


  useEffect(() => {
    if (!form) return;
    const regularQuestions = form.questions as Question[];
    setQuestions(regularQuestions);

  }, []);

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

  const initialFormSave = async () => {

    const payload: Partial<IFormResponse> = {
      formId: form.id,
      userId: session?.user ? (session.user as any).googleId : null,
      status: 'PARTIAL',
      data: dataSource,
      partialSave: true,
    }
    // return

    try {
      const res = await api.post<ActionResponse>(apiConstants.response.add(), payload);
      if (!res?.data?.success) {
        console.log('Error submitting form:', res?.data?.message);
        return;
      }
      setResponseDb(res.data.data as IFormResponse);

    } catch (err) {
      setIsSubmiting(false);
      console.error('Error submitting form:', err);
      return;
    }

  };

  const handleFieldChange = (questionId: string, value: string | number | boolean | string[]) => {
    setDataSource(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Mark current step as completed when a value is entered
    const hasValue = value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);

    if (hasValue) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  };

  const handleNext = () => {
    if (!initialSaveDone && Object.keys(dataSource).length > 0) {
      setInitialSaveDone(true);
      initialFormSave();
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (!isLastStep) {
      setDirection(1); // Moving forward
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setDirection(-1); // Moving backward
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    completeSubmission();
  };

  const completeSubmission = async () => {
    console.log('Form submitted:', dataSource);

    // Log user info if signed in
    // if (session?.user) {
    //   console.log('User submitting form:', {
    //     googleUserId: (session.user as any).googleId,
    //     email: session.user.email,
    //     name: session.user.name,
    //     formId: form.id,
    //     // responseId will be generated when saving to database
    //   });
    // }

    const payload: Partial<IFormResponse> = {
      id: responseDb ? responseDb.id : undefined,
      formId: form.id,
      userId: session?.user ? (session.user as any).googleId : null,
      status: 'COMPLETED',
      data: dataSource,
    }
    try {
      setIsSubmiting(true);
      const res = await api.put<ActionResponse>(apiConstants.response.add(), payload);
      setIsSubmiting(false);
      if (!res?.data?.success) {
        showError(res?.data?.message || 'There was an error submitting the form. Please try again.');
        return;
      }

      setFormCompleted(true);
      setPendingSubmit(false);

    } catch (err) {
      setIsSubmiting(false);
      console.error('Error submitting form:', err);
      // showError(err?.message || 'There was an error submitting the form. Please try again.');
      return;
    }

  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { redirect: false });
  };

  const handleStartForm = () => {
    // Check if authentication is required before starting the form
    // if (requiresAuth && !session) {
    //   setPendingSubmit(true);
    //   return;
    // }

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
    setCurrentStep(0);
    setDirection(0);
    setAnimatedProgress(0);
    setCompletedSteps(new Set());
    setFormCompleted(false);

    // If welcome screen exists, go back to it, otherwise stay in form
    // if (welcomeScreen) {
    //   setFormStarted(false);
    // }
  };

  const handleEndScreenNext = () => {
    // You can add logic here for what happens after end screen
    console.log('End screen completed');
  };


  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key == 'Enter' && !event.ctrlKey && !event.shiftKey && !isLastStep) {
  //       event.preventDefault();
  //       event.stopImmediatePropagation();
  //       handleNext();
  //     }
  //   };
  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => document.removeEventListener('keydown', handleKeyDown);
  // }, [currentStep, isLastStep]);



  // Show sign-in screen if authentication is required and user is not signed in
  // if (pendingSubmit && requiresAuth && !session) {
  //   return (
  //     <SignInRequired
  //       status={status}
  //       onBack={() => setPendingSubmit(false)}
  //       showBackButton={!!welcomeScreen}
  //     />
  //   );
  // }

  // Show welcome screen if not started and welcome screen exists
  // if (!formStarted && welcomeScreen) {
  //   return (
  //     <div className="p-6 h-full w-full flex items-center justify-center">
  //       <RenderFormField
  //         question={welcomeScreen}
  //         onChange={handleStartForm}
  //         value={undefined}
  //         error={undefined}
  //         form={form}
  //       />
  //     </div>
  //   );
  // }

  // Show end screen if form completed and end screen exists
  // if (formCompleted && endScreen) {
  //   return (
  //     <div className="p-6 h-full w-full flex items-center justify-center">
  //       <RenderFormField
  //         question={endScreen}
  //         onChange={handleEndScreenNext}
  //         value={undefined}
  //         error={undefined}
  //         onReset={form.multipleSubmissions ? handleResetForm : undefined}
  //       />
  //     </div>
  //   );
  // }

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
    <div className="h-full w-full flex flex-col">
      <div className="min-h-full flex flex-col items-center justify-start pt-8 sm:pt-20 md:pt-24">
        <div className="max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {
              formCompleted ?
                <motion.div
                  key={'form-completed'}
                  initial={{ opacity: 0, scale: 1.05, x: 0 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                  className="w-full"
                >
                  <div className="sm:py-3">
                    <FormCompleted formConfig={form} onRestart={handleResetForm} />
                  </div>
                </motion.div>
                :
                <motion.div
                  key={'form-view'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-full"
                >
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <small className="text-sm font-medium text-muted-foreground">
                        Que {currentStep + 1} of {totalSteps}
                      </small>
                      <small className="text-sm font-medium text-primary">
                        {Math.round(animatedProgress)}%
                      </small>
                    </div>
                    {/* <div className="bg-primary/20 w-full h-2.5 rounded-sm mb-4 relative overflow-hidden ">
              <div className="absolute inset-0 bg-primary transition-all duration-250 ease-out border-r-6 border-r-accent-bg" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div> */}
                    <Progress value={animatedProgress} className="h-2.5" />
                  </div>

                  {/* Form Content */}
                  <div className="relative h-auto mb-8">
                    <AnimatePresence mode="popLayout" custom={direction} initial={false}>
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
                            duration: 0.3,
                            ease: [0.25, 0.19, 0.25, 0.94]
                          },
                          opacity: {
                            duration: 0.3,
                            ease: [0.25, 0.19, 0.25, 0.94]
                          }
                        }}
                        className=" inset-0 w-full"
                      >
                        <div className="sm:py-3">
                          {currentQuestion &&
                            <RenderFormField
                              key={currentQuestion.id}
                              question={currentQuestion}
                              value={dataSource[currentQuestion.id]}
                              isFirstQuestion={isFirstStep}
                              isLastQuestion={isLastStep}
                              onChange={(v) => handleFieldChange(currentQuestion.id, v)}
                              onNextQuestionTrigger={(dir: 1 | -1) => dir === 1 ? handleNext() : handlePrevious()}
                              onFormSubmit={handleSubmit}
                            />}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Buttons */}
                  {/* <div className="flex items-center justify-between pt-6 border-t border-t-accent-foreground/10 fixed w-full left-0 px-6 pb-12 bottom-0 bg-background pb-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {
                        !isFirstStep ?
                          <motion.div
                            key="back-button"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              size={metaData.actionBtnSize || 'lg'}
                              variant="outline"
                              onClick={handlePrevious}
                              disabled={isFirstStep || isSubmiting}
                            >
                              <ChevronLeftIcon className="w-4 h-4" />
                              {metaData.backBtnLabel || 'Back'}
                            </Button>
                          </motion.div> : <span></span>
                      }
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout" initial={false}>
                      {isLastStep ? (
                        <motion.div
                          key="submit-button"
                          initial={{ opacity: 0, scale: 0.9, x: 30 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: 30 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            size={metaData.actionBtnSize || 'lg'}
                            onClick={handleSubmit}
                            loading={isSubmiting}
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
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            size={metaData.actionBtnSize || 'lg'}
                            onClick={handleNext}
                          >
                            {metaData.nextBtnLabel || 'Next'}
                            <ChevronRightIcon className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div> */}
                </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default StapperForm