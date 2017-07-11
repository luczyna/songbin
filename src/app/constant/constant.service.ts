import { Injectable } from '@angular/core';
import { Validators, ValidatorFn } from '@angular/forms';

@Injectable()
export class ConstantService {
  // For URL validation for Songs
  // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  private urlRegex: RegExp = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
  private urlValidator = Validators.pattern(this.urlRegex);

  constructor() { }

  public getUrlValidator(): ValidatorFn {
    return Validators.compose([Validators.required, this.urlValidator]);
  }


}
