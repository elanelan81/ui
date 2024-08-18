import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';


  function mustContainQuestionMark (contorl: AbstractControl) {
    if( contorl.value.includes('?')) {
      return null;
    }
    return { doesNotContainsQuestionMark:true};
  }
  function emailIdsUnique(control: AbstractControl) {
    if(control.value !== 'test@example.com') {
      return of(null);
    }
    return of({ notUnique: true});
  }
  let initialEmailValue = '';
  const savedForm = window.localStorage.getItem('saved-login-form');
  if(savedForm){
    const loadedFrom = JSON.parse(savedForm);
    initialEmailValue = loadedFrom.email;
  }

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent  implements OnInit{

  private desttoryRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIdsUnique],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6),
         mustContainQuestionMark],
         
    }),
  });

  get emailIdsInvalid() {
    return (
      this.form.controls.email.touched && this.form.controls.email.dirty
      && this.form.controls.email.invalid
    );
  }
  get passwordIdsInvalid() {
    return (
      this.form.controls.password.touched && this.form.controls.password.dirty
      && this.form.controls.password.invalid
    );
  }

  ngOnInit() {
    /*
    const savedForm = window.localStorage.getItem('saved-login-form');
    if(savedForm){
      const loadedFrom = JSON.parse(savedForm);
      this.form.patchValue({
        email: loadedFrom.email,
      });
    }
*/
    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: value => {
        window.localStorage.setItem('saved-login-form',
        JSON.stringify({email: value.email})
        );
      }
    });
    this.desttoryRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit(){
    //this.form.value.email = email;
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}
