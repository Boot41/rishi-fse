import * as yup from 'yup';

// Match Django's validation patterns
const today = new Date();
today.setHours(0, 0, 0, 0);

export const loginSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(150, 'Username cannot exceed 150 characters')
    .required('Username is required'),
  password: yup.string()
    .required('Password is required'),
});

export const registerSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(150, 'Username cannot exceed 150 characters')
    .required('Username is required'),
  email: yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  password2: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  first_name: yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  last_name: yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
});

export const financialProfileSchema = yup.object().shape({
  age: yup.number()
    .min(18, 'Age must be at least 18')
    .max(100, 'Age cannot be greater than 100')
    .required('Age is required'),
  monthly_salary: yup.number()
    .min(0, 'Monthly salary cannot be negative')
    .required('Monthly salary is required'),
  risk_tolerance: yup.string()
    .oneOf(['low', 'medium', 'high'], 'Risk tolerance must be low, medium, or high')
    .required('Risk tolerance is required'),
});

export const incomeSchema = yup.object().shape({
  source: yup.string()
    .min(3, 'Source must be at least 3 characters')
    .required('Source is required'),
  amount: yup.number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999999999.99, 'Amount is too large')
    .required('Amount is required'),
  date_received: yup.date()
    .max(today, 'Date received cannot be in the future')
    .required('Date received is required'),
});

export const expenseSchema = yup.object().shape({
  category: yup.string()
    .min(3, 'Category must be at least 3 characters')
    .required('Category is required'),
  amount: yup.number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999999999.99, 'Amount is too large')
    .required('Amount is required'),
  date_spent: yup.date()
    .max(today, 'Date spent cannot be in the future')
    .required('Date spent is required'),
});

export const investmentSchema = yup.object().shape({
  name: yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  investment_type: yup.string()
    .oneOf(['stocks', 'sip', 'fd', 'gold'], 'Invalid investment type')
    .required('Investment type is required'),
  amount_invested: yup.number()
    .min(0.01, 'Amount invested must be greater than 0')
    .max(999999999999.99, 'Amount is too large')
    .required('Amount invested is required'),
  current_value: yup.number()
    .min(0, 'Current value cannot be negative')
    .max(999999999999.99, 'Amount is too large')
    .required('Current value is required'),
  date_invested: yup.date()
    .required('Date invested is required'),
  interest_rate: yup.number()
    .nullable()
    .min(0.01, 'Interest rate must be greater than 0')
    .max(100, 'Interest rate cannot exceed 100'),
  years: yup.number()
    .nullable()
    .min(1, 'Years must be at least 1'),
});

export const aiChatSchema = yup.object().shape({
  message: yup.string()
    .min(2, 'Message must be at least 2 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
    .required('Message is required'),
});
