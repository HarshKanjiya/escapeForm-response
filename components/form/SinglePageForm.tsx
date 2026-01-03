"use client";

import { cn } from "@/lib/utils";
import { FormWithQuestionsAndEdges, Question } from "@/types/common";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import RenderFormField from "./RenderFormField";
import SignInRequired from "./SignInRequired";

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
  const [showEntryPage, setShowEntryPage] = useState(true);
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

  // Effect to show welcome screen after successful sign-in
  useEffect(() => {
    if (pendingSubmit && session) {
      setPendingSubmit(false);
      // Show welcome screen if exists, otherwise start form
      if (welcomeScreen) {
        setFormStarted(false);
      } else {
        setFormStarted(true);
      }
    }
  }, [session, pendingSubmit, welcomeScreen]);

  const handleEntryPageNext = () => {
    setShowEntryPage(false);
    // Check if authentication is required
    if (requiresAuth && !session) {
      setPendingSubmit(true);
      return;
    }
    // Show welcome screen if exists, otherwise start form
    if (welcomeScreen) {
      setFormStarted(false);
    } else {
      setFormStarted(true);
    }
  };

  const handleStartForm = () => {
    setFormStarted(true);
  };

  const handleResetForm = () => {
    // Reset all form state
    setDataSource({});
    setErrors({});
    setFormCompleted(false);
    setFormStarted(false);
    setShowEntryPage(true);
  };

  const handleSwitchAccount = async () => {
    // Sign out and then redirect back to form to sign in with different account
    await signOut({ redirect: false });
    setPendingSubmit(true);
    setFormStarted(false);
    setShowEntryPage(false);
  };

  const handleEndScreenNext = () => {
    // You can add logic here for what happens after end screen
    console.log('End screen completed');
  };

  // Show entry page first
  if (showEntryPage) {
    return (
      <div className="p-6 h-full w-full flex items-center justify-center">
        <div className="mx-auto max-w-2xl bg-white rounded-3xl corner-squircle border border-border/50 w-full">
          <div className="px-8 md:px-12 py-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="ring-4 ring-primary/20 shrink-0 overflow-hidden corner-squircle rounded-3xl border border-border/50 bg-background">
                <Image
                  src={form.logoUrl || '/logo-light.svg'}
                  alt="Form logo"
                  width={80}
                  height={80}
                  className="object-cover rounded-3xl corner-squircle"
                  quality={100}
                  priority
                  unoptimized={false}
                />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {form.name}
                </h1>
                {form.description && (
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    {form.description}
                  </p>
                )}
              </div>
              <Button
                onClick={handleEntryPageNext}
                size={metaData.actionBtnSize || 'lg'}
                className="mt-4 min-w-[160px] font-medium"
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in screen if authentication is required and user is not signed in
  if (pendingSubmit && requiresAuth && !session) {
    return (
      <SignInRequired
        status={status}
        onBack={() => {
          setPendingSubmit(false);
          setShowEntryPage(true);
        }}
        showBackButton={true}
      />
    );
  }

  // // Show welcome screen if not started and welcome screen exists
  // console.log('welcomeScreen :>> ', welcomeScreen);
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
  if (formCompleted && endScreen) {
    return (
      <div className="p-6 h-full w-full flex items-center justify-center">
        <RenderFormField
          question={endScreen}
          onChange={handleEndScreenNext}
          value={undefined}
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
    <div className="p-2 md:p-6">
      <div className="h-full w-full flex flex-col">
        <ScrollArea className="flex-1 h-full">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 items-center">
              <div className="mx-auto max-w-3xl bg-white rounded-3xl corner-squircle border border-border/50 w-full">
                <div className="px-4 py-4 sm:py-4 sm:px-6 md:px-8">
                  <div className="flex gap-5 items-start max-sm:flex-col max-sm:items-center">
                    <div className="ring-4 ring-primary/20 shrink-0 overflow-hidden corner-squircle rounded-3xl border border-border/50 bg-background">
                      <Image
                        src={form.logoUrl || '/logo-light.svg'}
                        alt="Form logo"
                        width={64}
                        height={64}
                        className="object-cover rounded-3xl corner-squircle"
                        quality={100}
                        priority
                        unoptimized={false}
                      />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                        {form.name}
                      </h1>
                      {form.description && (
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {form.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* User Account Section */}
                  {session?.user && (
                    <div className="pt-4 mt-4 sm:mt-6 sm:pt-6 border-t border-border/50">
                      <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                            <AvatarFallback className="text-xs">
                              {session.user.email?.[0].toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                            >
                              Switch account
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSwitchAccount}>
                              Sign in with another account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => signOut()}>
                              Sign out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mx-auto max-w-3xl bg-white rounded-3xl corner-squircle border border-border/50 w-full">

                {/* Form Fields */}
                {/* <form onSubmit={handleSubmit}> */}
                <div className="px-4 sm:p-6 md:p-8">
                  {questions.map((q, index) => (
                    <div key={q.id}>
                      <div className="py-2 sm:py-6 flex gap-2">
                        {/* <p className="bg-border/50 mt-3 rounded-3xl corner-squircle flex items-center justify-center p-4 h-8 w-8 aspect-square">
                          {index + 1}
                        </p> */}
                        <RenderFormField
                          question={q}
                          onChange={(v) => handleFieldChange(q.id, v)}
                          value={dataSource[q.id]}
                          singlePage={true}
                        />
                      </div>
                      {index < questions.length - 1 && (
                        <Separator />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mx-auto max-w-3xl bg-white rounded-3xl corner-squircle border border-border/50 w-full">
                {/* Submit Button Section */}
                {questions.length > 0 && (
                  <>
                    <div className="px-6 py-6">
                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size={metaData.actionBtnSize || 'lg'}
                        >
                          Clear
                        </Button>
                        <Button
                          type="submit"
                          size={metaData.actionBtnSize || 'lg'}
                          className={cn("min-w-[140px] font-medium")}
                        >
                          {metaData.submitBtnLabel || 'Submit Form'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>
      </div>
    </div>
  )
}

export default SinglePageForm