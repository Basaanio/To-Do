
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validatePassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password: string = control.value || '';
    
        if (!password) {
            return null;  // Return null if password is empty or not provided
        }
    
        if (password.length < 8) {
            return null;  // No validation errors for passwords shorter than 8 characters
        }
    
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#%]/.test(password);
    
        const isValid = hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
    
        return isValid ? null : {
            incorrectPasswordFormat: {
                msg: 'Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (! @ # %).'
            }
        };
    };
}
