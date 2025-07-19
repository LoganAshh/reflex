import { LogFormData, CompletedLogFormData } from "../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// FIXED: Validate form data that might have null actedOn
export const validateUrgeLog = (data: LogFormData): ValidationResult => {
  const errors: string[] = [];

  if (!data.urge.trim()) {
    errors.push("Please describe the urge you felt");
  }

  if (data.urge.length > 200) {
    errors.push("Urge description must be less than 200 characters");
  }

  if (data.location.length > 100) {
    errors.push("Location must be less than 100 characters");
  }

  if (data.trigger.length > 150) {
    errors.push("Trigger description must be less than 150 characters");
  }

  if (data.actedOn === null) {
    errors.push("Please indicate whether you acted on the urge");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to check if form data is complete
export const isFormDataComplete = (
  data: LogFormData
): data is CompletedLogFormData => {
  return data.actedOn !== null && data.urge.trim() !== "";
};

// Convert form data to completed form data (throws if incomplete)
export const toCompletedFormData = (
  data: LogFormData
): CompletedLogFormData => {
  if (!isFormDataComplete(data)) {
    throw new Error("Form data is incomplete");
  }

  return {
    urge: data.urge,
    location: data.location,
    trigger: data.trigger,
    actedOn: data.actedOn,
    replacementAction: data.replacementAction,
    notes: data.notes,
  };
};

export const validateStreakGoal = (data: {
  title: string;
  targetDays: number;
  category: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.title.trim()) {
    errors.push("Goal title is required");
  }

  if (data.title.length > 50) {
    errors.push("Goal title must be less than 50 characters");
  }

  if (data.targetDays < 1 || data.targetDays > 365) {
    errors.push("Target days must be between 1 and 365");
  }

  if (!data.category.trim()) {
    errors.push("Category is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
