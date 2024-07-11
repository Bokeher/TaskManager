import * as Validator from 'validatorjs';
import { Injectable } from '@angular/core';

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

  validatePassword(password: string) {
    const data = {
      password,
      error: '',
    };

    const rules = {
      password:
        'min:8|required|string|regex:"(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])"',
    };

    return new Validator(data, rules);
  }

  validatePasswordConfirmation(
    password: string,
    password_confirmation: string
  ) {
    const data = {
      password,
      password_confirmation,
      error: '',
    };

    const rules = {
      password: 'required|confirmed',
      password_confirmation: 'required',
    };

    return new Validator(data, rules);
  }

  validateProjectName(projectName: string) {
    const data = {
      projectName,
      error: '',
    };

    const rules = {
      projectName: 'max:128|required|string',
    };

    return new Validator(data, rules);
  }

  validateTask(name: string, description: string) {
    const data = {
      name,
      description,
    };

    const rules = {
      name: 'max:256|required|string',
      description: 'max:1000|string',
    };

    return new Validator(data, rules);
  }
}
