import * as yup from "yup";

// Regular expression for phone number
export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const numberRegExp = /[0-9]/;
export const yupValidators = {
  genericRequired: ({
    message,
    min,
    max,
  }: {
    message?: string;
    min?: number;
    max?: number;
  }) => {
    return yup
      .string()
      .trim()
      .required(message ? message : "This field is required")
      .min(min || 0, `This field must have at least ${min} characters`)
      .max(
        max || Infinity,
        `This field cannot be longer than ${max} characters`
      );
  },
  genericRequiredNumber: ({
    message,
    min,
    max,
    matches,
  }: {
    message?: string;
    min?: number;
    max?: number;
    matches?: string;
  }) => {
    return yup
      .string()
      .trim()
      .required(message ? message : "This field is required ")
      .matches(numberRegExp, matches ? matches : "Invalid number")
      .min(min || 0, `This field must have at least ${min} characters`)
      .max(
        max || Infinity,
        `This field cannot be longer than ${max} characters`
      );
  },
  generic: () => {
    return yup.string().trim();
  },
};
