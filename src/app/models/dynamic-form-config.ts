export interface DinamicFormConfig {
  type: Fields;
  label: string;
  name: string;
  initialValue?: any;
  placeholder?: string;
  options?: string[];
 // validation?: ValidatorFn[];
}

export type Fields = 'input' | 'select' | 'radio' | 'checkbox,' | 'date';
