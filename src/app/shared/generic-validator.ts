import { FormGroup, AbstractControl } from '@angular/forms';

// Provide all set of validation messages here
const VALIDATION_MESSAGES = {
    txtFirstName: {
        required: 'Please enter first name',
        pattern: 'First name is invalid',
        minLength: 'The name length must be greater than 4',
        maxLength: 'The name length must be smaller than 30'
    },
    txtLastName: {
        pattern: 'Last name is invalid',
        minLength: 'The name length must be greater than 4',
        maxLength: 'The name length must be smaller than 30'
    },
    txtEmail: {
        required: 'Please enter email address',
        email: 'This email is invalid'
    },
    txtMobile: {
        required: 'Please enter mobile number',
        pattern: 'This mobile number is invalid',
        minLength: 'The mobile number length must be greater than 10',
        maxLength: 'The mobile number length must be smaller than 10'
    },
    txtPan: {
        required: 'Please enter pan number',
        pattern: 'This pan number is invalid',
        minLength: 'The pan number length must be greater than 10',
        maxLength: 'The pan number length must be smaller than 10'
    },
    txtPassport: {
        required: 'Please enter passport number',
        pattern: 'This passport number is invalid',
        minLength: 'The passport number length must be greater than 8',
        maxLength: 'The passport number length must be smaller than 8'
    },
    ddlCountry: {
        required: 'Please select country'
    },
    ddlState: {
        required: 'Please select state'
    },
    ddlCity: {
        required: 'Please select city'
    },
    imgProfile: {
        required: 'Please select profile pic'
    },
    txtDOB: {
        required: 'Please enter date of birth',
        underage: 'Age must be at least 18 years'
    },
    txtDOJ: {
        required: 'Please enter date of joinee'
    },
    txtOldPassword: {
        required: 'Please enter password',
        pattern: 'The password must have at least 8 characters 1 uppercase 1 numeric and 1 special characters',
        minlength: 'The password length must be greater than or equal to 8'
    },
    txtPassword: {
        required: 'Please enter password',
        pattern: 'The password must have at least 8 characters 1 uppercase 1 numeric and 1 special characters',
        minlength: 'The password length must be greater than or equal to 8'
    },
    txtConfirmPassword: {
        required: 'Please enter confirm password',
        pattern: 'The confirm password must have at least 8 characters 1 uppercase 1 numeric and 1 special characters',
        minlength: 'The password length must be greater than or equal to 8',
        match: 'Password does not match'
    },
    txtOTP: {
        required: 'Please enter otp',
        minLength: 'The otp length must be greater than 5',
        maxLength: 'The otp length must be smaller than 7'
    },
    rdoGender: {
      required: 'Please select gender'
    }
};

export class GenericValidator {
    // By default the defined set of validation messages is pass but a custom message when the class is called can also be passed
    constructor(private validationMessages: { [key: string]: { [key: string]: string } } = VALIDATION_MESSAGES) { }

    // this will process each formcontrol in the form group
    // and then return the error message to display
    // the return value will be in this format `formControlName: 'error message'`;
    processMessages(container: FormGroup): { [key: string]: string } {
        const messages: { [key: string]: any } = {}
        var errorMessage = '';
        // loop through all the formControls
        for (const controlKey in container.controls) {
            if (container.controls.hasOwnProperty(controlKey)) {
                // get the properties of each formControl
                const controlProperty = container.controls[controlKey];
                // If it is a FormGroup, process its child controls.
                if (controlProperty instanceof FormGroup) {
                    const childMessages = this.processMessages(controlProperty);
                    Object.assign(messages, childMessages);
                } else {
                    // Only validate if there are validation messages for the control
                    if (this.validationMessages[controlKey]) {
                        messages[controlKey] = '';
                        if ((controlProperty.dirty || controlProperty.touched) && controlProperty.errors) {
                            // loop through the object of errors
                            Object.keys(controlProperty.errors).map(messageKey => {
                                if (this.validationMessages[controlKey][messageKey]) {
                                    messages[controlKey] += this.validationMessages[controlKey][messageKey] + ' ';
                                }
                            });
                        }
                    }
                }
            }
        }
        return messages;
    }

    static passwordMatch(control: AbstractControl): void | null {
        let passwordControl: AbstractControl = control.get('txtPassword') as AbstractControl;
        let confirmPasswordControl: AbstractControl = control.get('txtConfirmPassword') as AbstractControl;

        if (passwordControl.pristine || confirmPasswordControl.pristine) {
            return null;
        }

        if (passwordControl.value === confirmPasswordControl.value) {
            return null;
        }

        confirmPasswordControl.setErrors({ match: true });
    }

    static validateGender(control: AbstractControl): void | null {
        let genderControl: AbstractControl = control.get('rdoGender') as AbstractControl;
        const selected = genderControl.value;
        if (selected) {
          return null;
        }

        genderControl.setErrors({ required: true });
    }
}