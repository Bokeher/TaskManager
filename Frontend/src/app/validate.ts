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
    let data = {
      email,
      name,
      password,
      password_confirmation,
      error: '',
    };

    let rules = {
      email: 'required|email',
      name: 'required',
      password:
        'min:8|string|confirmed|regex:"(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])"',
      password_confirmation: 'required',
    };

    let validation = new Validator(data, rules);
    if (validation.fails()) {
      this.error = 'Podano zły adres email użytkownika lub hasło!';
    }
    return validation;
  }

  validatePassword(password: string) {
    let data = {
      password,
      error: '',
    };

    let rules = {
      password:
        'min:8|required|string|regex:"(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])"',
    };

    let validation = new Validator(data, rules);
    return validation;
  }

  validatePasswordConfirmation(
    password: string,
    password_confirmation: string
  ) {
    let data = {
      password,
      password_confirmation,
      error: '',
    };

    let rules = {
      password: 'required|confirmed',
      password_confirmation: 'required',
    };

    let validation = new Validator(data, rules);
    return validation;
  }

  validateProjectName(projectName: string) {
    let data = {
      projectName,
      error: '',
    };

    let rules = {
      projectName: 'min:6|max:24|required|string',
    };

    let validation = new Validator(data, rules);
    return validation;
  }
}
