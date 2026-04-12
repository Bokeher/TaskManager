import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Validate {

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

  validateUsername(username: string | undefined, toastr: ToastrService): boolean {
    if (!username || username.trim() === '') {
      toastr.error($localize`:@@enterUsername: Please enter username.`);
      return false;
    }
    
    return true;
  }

  validateEmail(email: string, toastr: ToastrService): boolean {
    if (!email) {
      toastr.error($localize`:@@enterEmail: Please enter your email.`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toastr.error($localize`:@@invalidEmailFormat: Invalid email format.`);
      return false;
    }

    return true;
  }

  validatePassword(password: string, toastr: ToastrService): boolean {
    if (!password) {
      toastr.error($localize`:@@enterPassword: Please enter your password.`);
      return false;
    }

    if (password.length < 8) {
      toastr.error($localize`:@@passwordMinLength: Password must be at least 8 characters long.`);
      return false;
    }

    const passwordRegex = /(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])/;

    if (!passwordRegex.test(password)) {
      toastr.error(
        $localize`:@@passwordRequirements: Your password must contain at least one number, one uppercase letter, and one special character.`
      );
      return false;
    }

    return true;
  }

  validatePasswordConfirmation(
    password: string,
    password_confirmation: string,
    toastr: ToastrService
  ): boolean {
    if (!password_confirmation) {
      toastr.error($localize`:@@confirmPassword: Please confirm your password.`);
      return false;
    }

    if (password !== password_confirmation) {
      toastr.error($localize`:@@passwordDontMatch: The passwords do not match.`);
      return false;
    }

    return true;
  }

  validateProjectName(projectName: string | undefined, toastr: ToastrService): boolean {
    if (!projectName || projectName.trim() === '') {
      toastr.error($localize`:@@enterProjectName: Please enter project name.`);
      return false;
    }

    if (projectName.length > 128) {
      toastr.error($localize`:@@projectNameTooLong: Project name is too long.`);
      return false;
    }

    return true;
  }

  validateTask(name: string, description: string, toastr: ToastrService): boolean {
    if (!name || name.trim() === '') {
      toastr.error($localize`:@@enterTaskName: Please enter task name.`);
      return false;
    }

    if (name.length > 256) {
      toastr.error($localize`:@@taskNameTooLong: Task name is too long.`);
      return false;
    }

    if (description && description.length > 1000) {
      toastr.error($localize`:@@descriptionTooLong: Description is too long.`);
      return false;
    }

    return true;
  }

  validateCategoryName(categoryName: string, toastr: ToastrService): boolean {
    if (!categoryName || categoryName.trim() === '') {
      toastr.error($localize`:@@enterCategoryName: Please enter category name.`);
      return false;
    }

    if (categoryName.length > 256) {
      toastr.error($localize`:@@categoryNameTooLong: Category name is too long.`);
      return false;
    }

    return true;
  }
}