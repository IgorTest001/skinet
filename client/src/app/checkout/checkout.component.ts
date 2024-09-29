import { Component, OnInit } from '@angular/core';
import { NgControl, FormControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutParentForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService) { }

  ngOnInit() {
    this.createCheckoutForm();
    this.getAddressFormValues();
  }

  createCheckoutForm(){
    this.checkoutParentForm = this.formBuilder.group({
      addressForm: this.formBuilder.group({     // addressForm has the same name as addressForm has in the checkout-address.component.html
        firstName: [null, Validators.required], // this addressForm serves as parent form, which serves as input for the child addressForm in checkout-address.component.html
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required]
      }),
      deliveryForm: this.formBuilder.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.formBuilder.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe(address => {
      if (address) {
        this.checkoutParentForm.get('addressForm').patchValue(address);
      }
    }, error => {
      console.log(error);
    });
  }

}
