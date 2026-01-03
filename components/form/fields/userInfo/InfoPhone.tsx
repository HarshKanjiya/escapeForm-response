import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { PhoneIcon } from "lucide-react";
import { COUNTRIES } from "@/constants/common";
import { Button } from "@/components/ui/button";

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

const InfoPhone = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const metadata = question.metadata || {};
  const allowAnyCountry = metadata.allowAnyCountry !== false;
  const allowedCountries = metadata.allowedCountries as string[] | undefined;

  // Filter countries based on metadata
  const availableCountries = allowAnyCountry
    ? COUNTRIES
    : COUNTRIES.filter(country => allowedCountries?.includes(country.code));

  const [selectedCountry, setSelectedCountry] = useState(availableCountries[0]?.code || "US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  useEffect(() => {
    if (value && typeof value === 'string') {
      // Try to parse existing value (format: "+1-5551234567")
      const parts = value.split('-');
      if (parts.length === 2) {
        const dialCode = parts[0];
        const number = parts[1];
        const country = COUNTRIES.find(c => c.dialCode === dialCode);
        if (country) {
          setSelectedCountry(country.code);
          setPhoneNumber(number);
        }
      }
    }
  }, [value]);

  const validatePhoneNumber = (): boolean => {
    setValidationError([]);

    if (question.required && !phoneNumber) {
      setValidationError(["This question is required"]);
      return true;
    }

    if (!phoneNumber) return false;

    const errors: string[] = [];

    // Basic phone number validation (digits and common symbols)
    const phonePattern = /^[\d\s()+-]+$/;

    if (!phonePattern.test(phoneNumber)) {
      errors.push("Please enter a valid phone number");
    } else {
      // Check minimum length
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length < 6) {
        errors.push("Phone number is too short");
      }
    }

    setValidationError(errors);
    return errors.length > 0;
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    updateValue(countryCode, phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);

    // Validate on change
    if (newNumber) {
      const errors: string[] = [];
      const phonePattern = /^[\d\s()+-]+$/;

      if (!phonePattern.test(newNumber)) {
        errors.push("Please enter a valid phone number");
      } else {
        const digitsOnly = newNumber.replace(/\D/g, '');
        if (digitsOnly.length > 0 && digitsOnly.length < 6) {
          errors.push("Phone number is too short");
        }
      }
      setValidationError(errors);
    } else {
      setValidationError([]);
    }

    updateValue(selectedCountry, newNumber);
  };

  const updateValue = (countryCode: string, number: string) => {
    if (!number) {
      onChange?.(undefined);
      return;
    }

    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      // Format: "+1-5551234567"
      const fullNumber = `${country.dialCode}-${number}`;
      onChange?.(fullNumber);
    }
  };

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry);

  const onNextClick = () => {
    if (validatePhoneNumber()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onNextQuestionTrigger?.(1);
  };

  const onSubmitClick = () => {
    if (validatePhoneNumber()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onFormSubmit?.();
  };

  const hasError = validationError.length > 0;

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
          <p className="text-md text-muted-foreground italic py-1 mt-2">
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex gap-2">
          {/* Country Code Select */}
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[140px] border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30 shadow-none px-0 pr-2">
              <SelectValue>
                {selectedCountryData && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedCountryData.flag}</span>
                    <span className="text-sm">{selectedCountryData.dialCode}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{country.dialCode}</span>
                    <span className="text-lg">{country.flag}</span>
                    {/* <span className="text-sm text-muted-foreground">{country.name}</span> */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Phone Number Input */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <Input
              id={question.id}
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={question.placeholder || "555 123 4567"}
              required={question.required}
              className={cn(
                'border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 px-0 pl-12 text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30',
                hasError && 'border-destructive'
              )}
            />
          </div>
        </div>
      </div>

      {validationError.length > 0 && (
        <div className="space-y-1">
          {validationError.map((error, index) => (
            <p key={index} className="text-sm text-destructive mt-1">
              {error}
            </p>
          ))}
        </div>
      )}

      {!hasError && !allowAnyCountry && allowedCountries && allowedCountries.length > 0 && (
        <div className="text-xs text-muted-foreground pt-2">
          <p>Only {allowedCountries.join(', ')} country codes allowed</p>
        </div>
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
            <Button size="xl" onClick={onSubmitClick} className={cn(shouldShake && "animate-shake")}>
              Submit
            </Button> :
            <Button size="xl" onClick={onNextClick} className={cn(shouldShake && "animate-shake")}>
              Next
            </Button>
        }
      </div>
    </div>
  )
}

export default InfoPhone