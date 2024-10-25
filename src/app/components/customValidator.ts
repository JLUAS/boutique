import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordValidator(password: string): ValidatorFn {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,}$/;
    return (control: AbstractControl) => {
      const passwordValue = control.value;
      if (!regex.test(passwordValue)) {
        return { invalidPassword: true };
      }
      return null;
    };
  }
}
