import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { PhoneIcon } from "lucide-react";
import { COUNTRIES } from "@/constants/common";

interface Props {
  question: Question,
  value?: any,
  error?: string[],
  singlePage?: boolean
  onChange?: (value: any) => void,
  onError?: (errors: string[]) => void,
  onNextQuestionTrigger?: () => void
}

const InfoPhone = ({ question, value, onChange, error, singlePage }: Props) => {
  const metadata = question.metadata || {};
  const allowAnyCountry = metadata.allowAnyCountry !== false;
  const allowedCountries = metadata.allowedCountries as string[] | undefined;

  // Filter countries based on metadata
  const availableCountries = allowAnyCountry
    ? COUNTRIES
    : COUNTRIES.filter(country => allowedCountries?.includes(country.code));

  const [selectedCountry, setSelectedCountry] = useState(availableCountries[0]?.code || "US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationError, setValidationError] = useState<string>("");

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

  const validatePhoneNumber = (number: string): string => {
    if (!number) {
      setValidationError("");
      return "";
    }

    // Basic phone number validation (digits and common symbols)
    const phonePattern = /^[\d\s()+-]+$/;

    if (!phonePattern.test(number)) {
      return "Please enter a valid phone number";
    }

    // Check minimum length
    const digitsOnly = number.replace(/\D/g, '');
    if (digitsOnly.length < 6) {
      return "Phone number is too short";
    }

    return "";
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    updateValue(countryCode, phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);

    const errorMsg = validatePhoneNumber(newNumber);
    setValidationError(errorMsg);

    if (!errorMsg) {
      updateValue(selectedCountry, newNumber);
    }
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
  const hasError = validationError || (error && error.length > 0);

  return (
    <div className='w-full space-y-2 p-2 pb-5'>
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
            <SelectTrigger className="w-[140px] py-6">
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
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm font-medium">{country.dialCode}</span>
                    <span className="text-sm text-muted-foreground">{country.name}</span>
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
                'border border-muted bg-white! py-6 pl-11 pr-4 text-lg w-full',
                hasError && 'border-destructive'
              )}
            />
          </div>
        </div>
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

      {!hasError && !allowAnyCountry && allowedCountries && allowedCountries.length > 0 && (
        <div className="text-xs text-muted-foreground pt-2">
          <p>Only {allowedCountries.join(', ')} country codes allowed</p>
        </div>
      )}
    </div>
  )
}

export default InfoPhone