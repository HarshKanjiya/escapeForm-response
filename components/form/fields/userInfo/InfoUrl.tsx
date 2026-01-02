import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Question } from "@/types/common";
import { useState, useEffect } from "react";
import { ExternalLinkIcon, XIcon } from "lucide-react";

interface UrlPreviewData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

interface Props {
  question: Question,
  value?: any,
  error?: string[],
  singlePage?: boolean
  onChange?: (value: any) => void,
  onError?: (errors: string[]) => void,
  onNextQuestionTrigger?: () => void
}

const InfoUrl = ({ question, value, onChange, error, singlePage }: Props) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAnswer(newValue);

    const errorMsg = validateUrl(newValue);
    setValidationError(errorMsg);

    // Clear preview if input is cleared or invalid
    if (!newValue || errorMsg) {
      setUrlPreview(null);
      setPreviewError(false);
    }

    // Only call onChange if valid or empty
    if (!errorMsg) {
      onChange?.(newValue);
      
      // Fetch preview for valid URLs
      if (newValue) {
        fetchUrlPreview(newValue);
      }
    }
  };

  const clearPreview = () => {
    setUrlPreview(null);
    setPreviewError(false);
  };


  const hasError = validationError || (error && error.length > 0);

  return (
    <div
      className='w-full space-y-2 p-2 pb-5'
    >
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
        <Input
          id={question.id}
          type="url"
          value={answer}
          onChange={handleInputChange}
          placeholder={question.placeholder || "https://example.com"}
          required={question.required}
          minLength={metadata.min as number || undefined}
          maxLength={metadata.max as number || undefined}
          className={cn(
            'border border-muted bg-white! py-6 px-4 text-lg sm:text-xl',
            metadata.max ? "pr-10" : "",
            "w-full",
            hasError && 'border-destructive'
          )}
        />

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

      {error && error.length > 0 && !validationError && (
        <p className="text-sm text-destructive mt-1">
          {error[0]}
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
                  className="flex-shrink-0 p-1 hover:bg-muted rounded-md transition-colors"
                  aria-label="Clear preview"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </a>
        </div>
      )}

      {!hasError && !urlPreview && !loadingPreview && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          <p>Enter a valid URL (e.g., https://example.com or www.example.com)</p>
          {metadata.min && typeof metadata.min === 'number' && (
            <p>Minimum {metadata.min} characters required</p>
          )}
        </div>
      )}
    </div>
  )
}

export default InfoUrl