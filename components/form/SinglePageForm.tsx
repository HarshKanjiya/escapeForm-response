"use client";

import { FormWithQuestionsAndEdges } from "@/types/common";
import { Question } from "@prisma/client";
import { useEffect, useState } from "react";
import RenderFormField from "./RenderFormField";

interface SinglePageFormProps {
  form: FormWithQuestionsAndEdges
}


const SinglePageForm = ({ form }: SinglePageFormProps) => {

  const [dataSource, setDataSource] = useState<Record<string, string | number | boolean | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!form) return;
    const ques = form.questions as Question[];
    setQuestions(ques);
  }, [])

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
    <div className="p-6 h-full w-full">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Form Preview</h1>
          <p className="text-muted-foreground">
            This is how your form will appear to users
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
            <div className="pt-6 border-t">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Submit Form
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default SinglePageForm