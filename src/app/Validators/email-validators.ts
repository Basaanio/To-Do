import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value)
            return null

        const email: string = control.value

        const atIndex = email.indexOf('@')
        const dotIndex = email.lastIndexOf('.')

        if (atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1) {
            return null;
        }

        return {
            incorrectEmailFormat: {
                msg: 'Email format is incorrect'
            }
        };
    }
}