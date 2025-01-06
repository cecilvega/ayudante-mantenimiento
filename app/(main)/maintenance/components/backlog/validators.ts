import { Timestamp } from "firebase/firestore";

export interface BacklogFormData {
  ot: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  assignees: string[];
  systemName: string;
  subsystemName: string;
  positionName: string;
}

export interface FormErrors {
  ot?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  assignees?: string;
  systemName?: string;
  subsystemName?: string;
  positionName?: string;
}

export function validateBacklogForm(formData: BacklogFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};
  let isValid = true;

  // OT Validation
  if (!formData.ot || isNaN(Number(formData.ot))) {
    errors.ot = "La OT es requerida y debe ser un número";
    isValid = false;
  }
  if (formData.ot && formData.ot.length !== 9) {
    errors.ot = "La OT debe tener 9 dígitos";
    isValid = false;
  }

  // Title Validation
  if (!formData.title.trim()) {
    errors.title = "El título es requerido";
    isValid = false;
  }
  if (formData.title.length < 10) {
    errors.title = "El título debe tener al menos 10 caracteres";
    isValid = false;
  }

  // Description Validation
  if (!formData.description.trim()) {
    errors.description = "La descripción es requerida";
    isValid = false;
  }
  if (formData.description.length < 20) {
    errors.description = "La descripción debe tener al menos 20 caracteres";
    isValid = false;
  }

  // Date Validations
  if (!formData.startDate) {
    errors.startDate = "La fecha de inicio es requerida";
    isValid = false;
  }

  if (!formData.endDate) {
    errors.endDate = "La fecha de término es requerida";
    isValid = false;
  }

  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) {
      errors.endDate = "La fecha de término debe ser posterior a la de inicio";
      isValid = false;
    }

    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diffHours > 72) {
      errors.endDate = "La duración no puede exceder 72 horas";
      isValid = false;
    }
  }

  // Assignees Validation
  if (!formData.assignees.some((assignee) => assignee.trim())) {
    errors.assignees = "Debe haber al menos un asignado";
    isValid = false;
  }

  // System Hierarchy Validation
  if (!formData.systemName) {
    errors.systemName = "El sistema es requerido";
    isValid = false;
  }

  if (!formData.subsystemName) {
    errors.subsystemName = "El subsistema es requerido";
    isValid = false;
  }

  if (!formData.positionName) {
    errors.positionName = "La posición es requerida";
    isValid = false;
  }

  return { isValid, errors };
}

// Helper to convert form data to Firestore format
export function formatBacklogForFirestore(formData: BacklogFormData) {
  return {
    ot: parseInt(formData.ot),
    title: formData.title.trim(),
    description: formData.description.trim(),
    systemName: formData.systemName,
    subsystemName: formData.subsystemName,
    positionName: formData.positionName,
    assignees: formData.assignees.filter((a) => a.trim()),
    startDate: Timestamp.fromDate(new Date(formData.startDate)),
    endDate: Timestamp.fromDate(new Date(formData.endDate)),
  };
}
