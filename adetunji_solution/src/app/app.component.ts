import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import { Subject } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatDatepickerModule, MatRadioModule, ReactiveFormsModule, CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'adetunji_solution';
  public paymentForm!: FormGroup;
  public ngUnsubscribe = new Subject<void>();
  public isChecking = true;
  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.initForm();
    this.getAcctType();
  }

  public getAcctType(){
    this.paymentForm.get('acctType')?.valueChanges.subscribe(val => {
      this.isChecking = val === 'checking';
      if(val === 'checking'){
        this.debitCard.reset();
      }else{
        this.checkingAccount.reset();
      }
    });
  }
  public initForm(): void{
    this.paymentForm = this.fb.group({
      loanAcctNumber: [null, [Validators.required]],
      acctType: ['checking', [Validators.required]],
      checkingAccount: this.fb.group({
        routingNumber: ['', [Validators.required, this.routingNumbValidator]],
        bankAcctNumber: [null, [Validators.required]],
        confirmBankAcctNumber:  [null, [Validators.required]],
      }),
      debitCard: this.fb.group({
        cardNumber: [null, [Validators.required]],
        nameOnCard: ['', [Validators.required]],
        confirmBankAcctNumber:  [null, [Validators.required]],
        expDate: [null, [Validators.required]],
        CVV: ['', [Validators.required, this.cvvValidator]],
      }),
    });
  }

  public get debitCard(): FormGroup{
    return this.paymentForm.get('debitCard') as FormGroup;
  }
  public get checkingAccount(): FormGroup{
    return this.paymentForm.get('checkingAccount') as FormGroup;
  }
  public submitPaymentForm(){
    console.log(this.paymentForm.value)
  }
  
  public cvvValidator(control: AbstractControl): {[key: string]: boolean} | null{
    if(control.value?.toString() !== 3){
      return {cvvErr: true};
    }
    return null;
  }
  public routingNumbValidator(control: AbstractControl): {[key: string]: boolean} | null {
    if(control.value?.toString().length < 9){
      return {routingNumErr: true}
    }
    return null;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
