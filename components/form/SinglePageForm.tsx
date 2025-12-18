"use client";

import { FormWithQuestionsAndEdges, Question } from "@/types/common";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import RenderFormField from "./RenderFormField";
import SignInRequired from "./SignInRequired";
import Image from "next/image";

interface SinglePageFormProps {
  form: FormWithQuestionsAndEdges
}


const SinglePageForm = ({ form }: SinglePageFormProps) => {
  const { data: session, status } = useSession();
  const [dataSource, setDataSource] = useState<Record<string, string | number | boolean | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [welcomeScreen, setWelcomeScreen] = useState<Question | null>(null);
  const [endScreen, setEndScreen] = useState<Question | null>(null);
  const [formStarted, setFormStarted] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Check if authentication is required
  const requiresAuth = !form.multipleSubmissions || !form.allowAnonymous;

  const metaData = {
    primaryColor: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.primaryColor as string | undefined) ?? '#6336F7' : '#6336F7',
    secondaryColor: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.secondaryColor as string | undefined) ?? '#2563eb' : '#2563eb',
    actionBtnSize: (typeof form.metadata === 'object' && !Array.isArray(form.metadata)) ? (form.metadata?.actionBtnSize as 'sm' | 'default' | 'lg' | 'xl' | undefined) ?? 'default' : 'default',
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

  const handleFieldChange = (questionId: string, value: string | number | boolean | string[]) => {
    setDataSource(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: []
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeSubmission();
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

  // Effect to start form after successful sign-in
  useEffect(() => {
    if (pendingSubmit && session && !formStarted) {
      setFormStarted(true);
      setPendingSubmit(false);
    }
  }, [session, pendingSubmit, formStarted]);

  const handleStartForm = () => {
    // Check if authentication is required before starting the form
    if (requiresAuth && !session) {
      setPendingSubmit(true);
      return;
    }
    setFormStarted(true);
  };

  const handleResetForm = () => {
    // Reset all form state
    setDataSource({});
    setErrors({});
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
    <div className="h-full w-full flex flex-col">
      <ScrollArea className="flex-1 h-full pr-8 py-4">
        <div className="mx-auto">
          <div className="px-2">
            <div className="py-6 flex gap-6 justify-start p-4 px-6 rounded-xl bg-white border-l-12 border-primary">
              <div className="flex items-center justify-center overflow-hidden corner-squircle rounded-4xl aspect-square h-fit w-fit">
                <Image
                  src={form.logoUrl || '/logo-light.svg'}
                  alt="Form logo"
                  width={60}
                  height={60}
                  className="object-contain rounded-lg"
                  quality={100}
                  priority
                  unoptimized={false}
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold ">{form.name}</h1>
                <span className="text-accent-foreground text-sm">{form.description}</span>
              </div>
            </div>
          </div>
          <form className="space-y-2" onSubmit={handleSubmit}>
            {questions.map((q) =>
              <RenderFormField
                key={q.id}
                question={q}
                onChange={(v) => handleFieldChange(q.id, v)}
                value={dataSource[q.id]}
                error={errors[q.id]}
              />
            )}

            {questions.length > 0 && (
              <div className="py-6 mt-8 border-t border-border/40">
                <div className="flex justify-center sm:justify-start">
                  <Button
                    type="submit"
                    size={metaData.actionBtnSize || 'default'}
                  >
                    {metaData.submitBtnLabel || 'Submit Form'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </ScrollArea>
    </div>
  )
}

export default SinglePageForm