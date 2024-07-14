import * as Validator from 'validatorjs';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Validate {
  error: String = '';

  validateRegistration(
    email: string,
    name: string,
    password: string,
    password_confirmation: string
  ) {
    const data = {
      email,
      name,
      password,
      password_confirmation,
      error: '',
    };

    const rules = {
      email: 'required|email',
      name: 'required',
      password: 'min:8|string|confirmed|regex:"(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])"',
      password_confirmation: 'required',
    };

    const validation = new Validator(data, rules);
    
    if (validation.fails()) {
      this.error = 'Podano zły adres email użytkownika lub hasło!';
    }
    
    return validation;
  }

  /**
   * @returns false when validation fails, else return true
   */
  validatePassword(password: string, toastr: ToastrService) {
    const data = {
      password,
    };

    const rules = {
      password:
        'min:8|required|string|regex:"(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])"',
    };

    const validation = new Validator(data, rules);

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
      password_confirmation: 'required',
    };

    const validation = new Validator(data, rules);

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

    const validation = new Validator(data, rules);

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

    const validation = new Validator(data, rules);

    return this.checkValidation(validation, toastr);
  }

  private checkValidation(validation: Validator.Validator<any>, toastr: ToastrService): boolean {
    if(!validation.fails()) return true;

    const errors = validation.errors.all();

    for(const field in errors) {
      errors[field].forEach(error => {
        toastr.error(error);
      });
    }

    return false;
  }

}
