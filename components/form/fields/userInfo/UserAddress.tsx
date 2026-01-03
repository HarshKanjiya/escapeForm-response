import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { COUNTRIES } from "@/constants/common";

interface AddressValue {
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  postalCode?: string;
}

interface Props {
  question: Question,
  value?: any,
  error?: string[],
  singlePage?: boolean
  onChange?: (value: any) => void,
  onError?: (errors: string[]) => void,
  onNextQuestionTrigger?: (dir: 1 | -1) => void,
}

const UserAddress = ({ question, value, onChange, error, singlePage }: Props) => {
  const metadata = question.metadata || {};

  const [addressData, setAddressData] = useState<AddressValue>({
    address: value?.address || "",
    address2: value?.address2 || "",
    city: value?.city || "",
    state: value?.state || "",
    zip: value?.zip || "",
    country: value?.country || "US",
    postalCode: value?.postalCode || ""
  });

  useEffect(() => {
    if (value) {
      setAddressData({
        address: value?.address || "",
        address2: value?.address2 || "",
        city: value?.city || "",
        state: value?.state || "",
        zip: value?.zip || "",
        country: value?.country || "US",
        postalCode: value?.postalCode || ""
      });
    }
  }, [value]);

  const handleFieldChange = (field: keyof AddressValue, newValue: string) => {
    const updatedData = {
      ...addressData,
      [field]: newValue
    };
    setAddressData(updatedData);
    onChange?.(updatedData);
  };

  const hasError = error && error.length > 0;

  // Field configurations based on metadata
  const fields = [
    {
      name: 'address' as keyof AddressValue,
      label: 'Address',
      show: metadata.address !== false,
      required: metadata.addressRequired === true,
      placeholder: '123 Main Street'
    },
    {
      name: 'address2' as keyof AddressValue,
      label: 'Address Line 2',
      show: metadata.address2 === true,
      required: metadata.address2Required === true,
      placeholder: 'Apt, Suite, Unit, etc. (optional)'
    },
    {
      name: 'city' as keyof AddressValue,
      label: 'City',
      show: metadata.city !== false,
      required: metadata.cityRequired === true,
      placeholder: 'City'
    },
    {
      name: 'state' as keyof AddressValue,
      label: 'State / Province',
      show: metadata.state !== false,
      required: metadata.stateRequired === true,
      placeholder: 'State or Province'
    },
    {
      name: 'zip' as keyof AddressValue,
      label: 'ZIP Code',
      show: metadata.zip === true,
      required: metadata.zipRequired === true,
      placeholder: '12345'
    },
    {
      name: 'postalCode' as keyof AddressValue,
      label: 'Postal Code',
      show: metadata.postalCode === true,
      required: metadata.postalCodeRequired === true,
      placeholder: 'Postal Code'
    }
  ];

  const showCountry = metadata.country !== false;
  const countryRequired = metadata.countryRequired === true;

  return (
    <div className='w-full space-y-2 py-2 pb-5'>
      <div className="py-2">
        <Label
          htmlFor={question.id}
          className={cn(
            "font-medium text-foreground text-xl",
            question.required && "after:content-['*'] after:text-destructive"
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

      <div className="space-y-4">
        {fields.map((field) => {
          if (!field.show) return null;

          return (
            <div key={field.name} className="space-y-1">
              <Label
                htmlFor={`${question.id}-${field.name}`}
                className={cn(
                  "text-sm font-medium",
                  field.required && "after:content-['*'] after:text-destructive after:ml-1"
                )}
              >
                {field.label}
              </Label>
              <Input
                id={`${question.id}-${field.name}`}
                type="text"
                value={addressData[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className={cn(
                  'border border-muted bg-white py-5 px-4 text-base w-full',
                  hasError && 'border-destructive'
                )}
              />
            </div>
          );
        })}

        {/* Country Field */}
        {showCountry && (
          <div className="space-y-1">
            <Label
              htmlFor={`${question.id}-country`}
              className={cn(
                "text-sm font-medium",
                countryRequired && "after:content-['*'] after:text-destructive after:ml-1"
              )}
            >
              Country
            </Label>
            <Select
              value={addressData.country || "US"}
              onValueChange={(value) => handleFieldChange('country', value)}
            >
              <SelectTrigger className="py-5">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default UserAddress