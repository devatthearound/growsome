export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return '이메일을 입력해주세요.';
  if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다.';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return '비밀번호를 입력해주세요.';
  if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
  if (!/[A-Z]/.test(password)) return '비밀번호는 대문자를 포함해야 합니다.';
  if (!/[a-z]/.test(password)) return '비밀번호는 소문자를 포함해야 합니다.';
  if (!/[0-9]/.test(password)) return '비밀번호는 숫자를 포함해야 합니다.';
  if (!/[!@#$%^&*]/.test(password)) return '비밀번호는 특수문자를 포함해야 합니다.';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  if (!phone) return '전화번호를 입력해주세요.';
  if (!phoneRegex.test(phone)) return '올바른 전화번호 형식이 아닙니다.';
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return '이름을 입력해주세요.';
  if (name.length < 2) return '이름은 2자 이상이어야 합니다.';
  if (name.length > 50) return '이름은 50자 이하여야 합니다.';
  return null;
};

export const validateCompany = (company: string): string | null => {
  if (!company) return '회사명을 입력해주세요.';
  if (company.length > 100) return '회사명은 100자 이하여야 합니다.';
  return null;
};

export const validateSignupData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: '비밀번호가 일치하지 않습니다.' });
  }

  const nameError = validateName(data.name);
  if (nameError) errors.push({ field: 'name', message: nameError });

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.push({ field: 'phone', message: phoneError });

  const companyError = validateCompany(data.company);
  if (companyError) errors.push({ field: 'company', message: companyError });

  if (!data.visitPath) {
    errors.push({ field: 'visitPath', message: '방문 경로를 선택해주세요.' });
  }

  if (!data.termsAccepted) {
    errors.push({ field: 'termsAccepted', message: '이용약관 동의가 필요합니다.' });
  }

  if (!data.privacyPolicyAccepted) {
    errors.push({ field: 'privacyPolicyAccepted', message: '개인정보 처리방침 동의가 필요합니다.' });
  }

  return errors;
}; 