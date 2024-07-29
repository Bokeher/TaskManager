import * as Validator from 'validatorjs';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Validate {
  error: String = '';

  validateRegistration(
    email: string,
    username: string,
    password: string,
    password_confirmation: string,
    toastr: ToastrService
  ) {
    return (
      this.validateEmail(email, toastr) &&
      this.validateUsername(username, toastr) &&
      this.validatePassword(password, toastr) &&
      this.validatePasswordConfirmation(password, password_confirmation, toastr)
    );
  }

  /**
   * @returns false when validation fails, else return true
   */
  validateUsername(username: string, toastr: ToastrService): boolean {
    const data = {
      username,
    };

    const rules = {
      username: 'required',
    };

    const customMessages = {
      'required.username': 'Please enter your username.',
    };

    const validation = new Validator(data, rules, customMessages);

    return this.checkValidation(validation, toastr);
  }

  /**
   * @returns false when validation fails, else return true
   */
  validateEmail(email: string, toastr: ToastrService): boolean {
    const data = {
      email,
    };

    const rules = {
      email: 'required|email',
    };

    const customMessages = {
      'required.email': 'Please enter your email.',
      'email.email': 'Invalid email format.'
    };

    const validation = new Validator(data, rules, customMessages);

    return this.checkValidation(validation, toastr);
  }
  
  /**
   * @returns false when validation fails, else return true
   */
  validatePassword(password: string, toastr: ToastrService): boolean {
    const data = {
      password,
    };

    const rules = {
      password:
        'min:8|required|string|regex:"(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])"',
    };

    const customMessages = {
      'required.password': 'Please enter your password.',
      'regex.password': 'Your password must contain at least one number, one uppercase letter, and one special character.',
    };

    const validation = new Validator(data, rules, customMessages);

    return this.checkValidation(validation, toastr);
  }

  /**
   * @returns false when validation fails, else return true
   */
  validatePasswordConfirmation(
    password: string, 
    password_confirmation: string, 
    toastr: ToastrService
  ): boolean {
    const data = {
      password,
      password_confirmation,
    };

    const rules = {
      password: 'required|confirmed',
    };

    const customMessages = {
      'required.password': 'Please confirm your password.',
      'confirmed.password': 'The passwords do not match.',
    };

    const validation = new Validator(data, rules, customMessages);

    return this.checkValidation(validation, toastr);
  }
  
  /**
   * @returns false when validation fails, else return true
   */
  validateProjectName(projectName: string, toastr: ToastrService): boolean {
    const data = {
      projectName,
    };

    const rules = {
      projectName: 'max:128|required|string',
    };

    const customMessages = {
      'required.projectName': 'Please enter project name.',
    };
    
    const validation = new Validator(data, rules, customMessages);
    
    return this.checkValidation(validation, toastr);
  }

  /**
   * @returns false when validation fails, else return true
   */
  validateTask(name: string, description: string, toastr: ToastrService): boolean {
    const data = {
      name,
      description,
    };

    const rules = {
      name: 'max:256|required|string',
      description: 'max:1000|string',
    };

    const customMessages = {
      'required.name': 'Please enter task name.',
    };

    const validation = new Validator(data, rules, customMessages);

    return this.checkValidation(validation, toastr);
  }

  /**
   * @returns false when validation fails, else return true
   */
  validateCategoryName(categoryName: string, toastr: ToastrService): boolean {
    const data = {
      categoryName,
    };

    const rules = {
      categoryName: 'max:256|required|string',
    };

    const customMessages = {
      'required.categoryName': 'Please enter category name.',
    };

    const validation = new Validator(data, rules, customMessages);

    return this.checkValidation(validation, toastr);
  }

  private checkValidation(validation: Validator.Validator<any>, toastr: ToastrService): boolean {
    if(validation.passes()) return true;

    const errors = validation.errors.all();

    for(const field in errors) {
      errors[field].forEach(error => {
        toastr.error(error);
      });
    }

    return false;
  }

}
