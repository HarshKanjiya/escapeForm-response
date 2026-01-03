import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Question } from "@/types/common";
import { useState, useEffect, useCallback, useRef } from "react";
import { ExternalLinkIcon, Link2Icon, XIcon } from "lucide-react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";

interface UrlPreviewData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

interface Props {
  question: Question,
  value?: any,
  singlePage?: boolean
  isFirstQuestion?: boolean,
  isLastQuestion?: boolean,
  onChange?: (value: any) => void,
  onNextQuestionTrigger?: (dir: 1 | -1) => void,
  onFormSubmit?: () => void
}

const InfoUrl = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [answer, setAnswer] = useState(value || "");
  const [validationError, setValidationError] = useState<string>("");
  const [urlPreview, setUrlPreview] = useState<UrlPreviewData | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const metadata = question.metadata || {};

  useEffect(() => {
    if (value) {
      setAnswer(value);
    }
  }, [value]);

  const validateUrl = (url: string): string => {
    if (!url) {
      setValidationError("");
      return "";
    }

    // URL validation pattern
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

    if (!urlPattern.test(url)) {
      return "Please enter a valid URL format";
    }

    // Additional validation: try to create URL object
    try {
      // Add protocol if missing for validation
      const urlToTest = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
      new URL(urlToTest);
    } catch {
      return "Please enter a valid URL format";
    }

    return "";
  };

  const fetchUrlPreview = async (url: string) => {
    setLoadingPreview(true);
    setPreviewError(false);
    setUrlPreview(null);

    try {
      // Ensure URL has protocol
      const urlToFetch = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;

      // Using a CORS proxy or your own API endpoint
      const response = await fetch(`/api/url-preview?url=${encodeURIComponent(urlToFetch)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch preview');
      }

      const data = await response.json();
      setUrlPreview({
        title: data.title || data.ogTitle,
        description: data.description || data.ogDescription,
        image: data.image || data.ogImage,
        url: urlToFetch
      });
    } catch (err) {
      console.error('Error fetching URL preview:', err);
      setPreviewError(true);
      // Set basic preview with just the URL
      setUrlPreview({
        url: url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
      });
    } finally {
      setLoadingPreview(false);
    }
  };

  // Debounced fetch - only called when user stops typing for 500ms
  const debouncedFetchPreview = useRef(
    debounce((url: string) => {
      const errorMsg = validateUrl(url);
      if (!errorMsg && url) {
        fetchUrlPreview(url);
      }
    }, 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchPreview.cancel();
    };
  }, [debouncedFetchPreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAnswer(newValue);

    const errorMsg = validateUrl(newValue);
    setValidationError(errorMsg);

    // Clear preview if input is cleared or invalid
    if (!newValue || errorMsg) {
      setUrlPreview(null);
      setPreviewError(false);
      debouncedFetchPreview.cancel(); // Cancel pending debounced call
    }

    // Only call onChange if valid or empty
    if (!errorMsg) {
      onChange?.(newValue);

      // Fetch preview for valid URLs with debounce
      if (newValue) {
        debouncedFetchPreview(newValue);
      }
    }
  };

  const clearPreview = () => {
    setUrlPreview(null);
    setPreviewError(false);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onNextQuestionTrigger?.(1);
    }
  };

  return (
    <div className='w-full space-y-2'>
      <div className="py-2">
        <Label
          htmlFor={question.id}
          className={cn(
            "font-medium text-foreground text-xl",
            question.required && "after:content-['*'] after:text-destructive",
            singlePage ? "text-lg" : "text-xl"
          )}
        >
          {question.title}
        </Label>

        {question.description && (
          <p className="text-md text-muted-foreground italic py-1">
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-1 relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Link2Icon className="w-5 h-5 rotate-135" />
          </div>
          <Input
            id={question.id}
            type="url"
            value={answer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder || "https://example.com"}
            required={question.required}
            minLength={metadata.min as number || undefined}
            maxLength={metadata.max as number || undefined}
            className={cn(
              'border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 px-0 pl-12 text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30',
              metadata.max ? "pr-10" : "",
              "w-full",
              validationError && 'border-destructive'
            )}
          />
        </div>

        {metadata.max && typeof metadata.max === 'number' && (
          <div className="flex justify-end absolute right-3 top-1/2 -translate-y-1/2">
            <span className={cn(
              "text-sm text-muted-foreground",
              answer.length > metadata.max * 0.9 && "text-orange-500",
              answer.length >= metadata.max && "text-destructive"
            )}>
              {answer.length} / {metadata.max}
            </span>
          </div>
        )}
      </div>

      {validationError && (
        <p className="text-sm text-destructive mt-1">
          {validationError}
        </p>
      )}

      {/* URL Preview */}
      {loadingPreview && (
        <div className="mt-4 border rounded-lg p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {urlPreview && !loadingPreview && (
        <div className="mt-4 border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow group">
          <a
            href={urlPreview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {urlPreview.image && !previewError && (
              <div className="relative w-full h-48 bg-muted overflow-hidden">
                <img
                  src={urlPreview.image}
                  alt={urlPreview.title || "URL Preview"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {urlPreview.title && (
                    <h4 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {urlPreview.title}
                    </h4>
                  )}

                  {urlPreview.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {urlPreview.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ExternalLinkIcon className="w-3 h-3" />
                    <span className="truncate">{urlPreview.url}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearPreview();
                  }}
                  className="shrink-0 p-1 hover:bg-muted rounded-md transition-colors"
                  aria-label="Clear preview"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </a>
        </div>
      )}

      {!validationError && !urlPreview && !loadingPreview && (
        <small className="text-xs text-muted-foreground space-y-1 pt-2">
          <p>Enter a valid URL (e.g., https://example.com or www.example.com)</p>
          {metadata.min && typeof metadata.min === 'number' && (
            <p>Minimum {metadata.min} characters required</p>
          )}
        </small>
      )}

      <div className="flex w-full items-center justify-end pt-12 gap-4">
        {
          !isFirstQuestion && (
            <Button size="xl" variant="secondary" className="border border-border/40" onClick={() => onNextQuestionTrigger?.(-1)}>
              Back
            </Button>
          )
        }
        {
          isLastQuestion ?
            <Button size="xl" onClick={() => onFormSubmit?.()}>
              Submit
            </Button> :
            <Button size="xl" onClick={() => onNextQuestionTrigger?.(1)}>
              Next
            </Button>
        }
      </div>
    </div>
  )
}

export default InfoUrl