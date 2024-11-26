import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastComponent } from "../../shared/components/toast/toast.component";
import { Cart } from '../../shared/models/cart.model';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ServicesTabService } from '../inventory/services-tab/services-tab.service';
import { ToastService } from '../../core/services/toast.service';
import { TradingTabService } from '../inventory/trading-tab/trading-tab.service';
import { TradingItem } from '../../shared/models/trading-item.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { ClientsTabService } from '../billing-client/clients-tab/clients-tab.service';
import { Client } from '../../shared/models/client.model';
import { Discount } from '../../shared/models/discount.model';
import { LoyaltyTabService } from '../client/loyalty-tab/loyalty-tab.service';
import { Service } from '../../shared/models/service.model';
import { NewSale } from '../../shared/models/new-sale.model';
import { ConfirmationModalComponent } from "./modals/confirmation-modal/confirmation-modal.component";
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-cashier',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastComponent,
        FormsModule,
        ConfirmationModalComponent
    ],
    templateUrl: './cashier.component.html',
    styleUrl: './cashier.component.scss'
})
export class CashierComponent {
  salesForm: FormGroup;
  
  filterList: { id: string, category: string, name: string, sellingPrice: number }[] = [];
  cartViewList: {
    item: string,
    name: string,
    itemPrice: number,
    quantity: number,
    subTotal: number
  }[] = [];
  cartData: Cart[] = [];

  isLoading = false;

  searchQuery = new FormControl('');
  quantityControl = new FormControl(0);
  currentPage: number = 1;

  selectedItem: { id: string, category: string, name: string, sellingPrice: number } | undefined;

  clientQuery = new FormControl('');
  clientResult: Client[] = [];
  selectedClient: Client | undefined;

  discount: Discount | undefined;

  paymentReceived = new FormControl(0);
  change = new FormControl(0);

  checkoutCart: NewSale | undefined;

  constructor(
    private fb: FormBuilder,
    private tradingService: TradingTabService,
    private serviceService: ServicesTabService,
    private clientService: ClientsTabService,
    private discountService: LoyaltyTabService,
    private toastService: ToastService
  ) {
    this.salesForm = this.fb.group({
      branch: ['', [Validators.required]],
      client: ['', [Validators.required]],
      cart: [[], [Validators.required]],
      discount: [0, [Validators.required]],
      totalPrice: [0, [Validators.required]],
      paid: [true, [Validators.required]],
      dateIssued: [Date.now(), [Validators.required]],
      recurring: [false, [Validators.required]],
    });
  }

  resetForm() {
    this.checkoutCart = undefined;
    this.cartData = [];
    this.cartViewList = [];
    this.selectedItem = undefined;
    this.searchQuery = new FormControl('');   
    this.quantityControl = new FormControl(0);
    this.salesForm.get('client')?.patchValue('');
    this.salesForm.get('cart')?.patchValue([]);
    this.salesForm.get('discount')?.patchValue(0);
    this.salesForm.get('totalPrice')?.patchValue(0);
    this.salesForm.get('paid')?.patchValue(true);
    this.salesForm.get('recurring')?.patchValue(false);
  }

  fetchPaginatedData(page: number, searchQuery: FormControl) {
    const query: string = searchQuery.value || "";
    console.log("query", query);
    if (this.salesForm.value.branch == "Tradings") {
      console.log("branch selected", this.salesForm.value.branch);
      this.tradingService.getPaginated(page, query).subscribe({
      next: (response) => {
          // Extract body data
          let tradingResponse: TradingItem[] = response.body;
          tradingResponse.forEach((item: TradingItem) => {
            this.filterList.push({
              id: item._id,
              category: item.category,
              name: item.brand,
              sellingPrice: item.sellingPrice
            });
          });
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
    } else if (this.salesForm.value.branch == "Services") {
      console.log("branch selected", this.salesForm.value.branch);
      this.serviceService.getPaginated(page, query).subscribe({
      next: (response) => {
          // Extract body data
          let tradingResponse: Service[] = response.body;
          tradingResponse.forEach((item: Service) => {
            this.filterList.push({
              id: item._id,
              category: item.category,
              name: item.name,
              sellingPrice: item.sellingPrice
            });
          });
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
    } else {
      console.log("no branch selected", this.salesForm.value.branch);
    }
  }

  selectItem(item: { id: string, category: string, name: string, sellingPrice: number }) {
    this.searchQuery = new FormControl('');
    this.selectedItem = item;
    this.filterList = [];
  }

  addToCart() {
    if (this.selectedItem != undefined) {
      this.cartViewList.push({
      item: this.selectedItem.id,
      name: this.selectedItem.name,
      itemPrice: this.selectedItem.sellingPrice,
      quantity: this.quantityControl.value ?? 0,
      subTotal: this.selectedItem.sellingPrice * (this.quantityControl.value ?? 0)
      });

      this.salesForm.value.totalPrice += this.selectedItem.sellingPrice * (this.quantityControl.value ?? 0);
    
      this.selectedItem = undefined;
      this.quantityControl = new FormControl(0);
    } else {
      console.log("no selected Item");
    }
    
  }

  fetchClients(page: number, clientQuery: FormControl) {
    const query: string = clientQuery.value || "";

    this.clientService.getPaginated(page, query).subscribe({
      next: (response) => {
          // Extract body data
          this.clientResult = response.body;
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }

  selectClient(client: Client) {
    this.salesForm.value.discount = 0;
    this.clientQuery = new FormControl('');
    this.selectedClient = client;
    this.salesForm.value.client = client._id;
    this.clientResult = [];

    this.discountService.getPaginated(this.currentPage, undefined, client._id).subscribe({
      next: (response) => {
          // Extract body data
        this.discount = response.body[0];
        this.salesForm.value.discount = this.discount;
        this.salesForm.value.totalPrice -= this.discount?.value ?? 0;
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }

  calculateChange() {
    const payment: number = Number(this.paymentReceived.value);
    const totalPrice: number = Number(this.salesForm.value.totalPrice);
    if (totalPrice) {
      this.change.setValue(payment - totalPrice);
    }
  }

  getUniqueTransactionNumber(): number {
  const now = new Date();
  
  // Format date and time to YYYYMMDDHHMMSS (e.g., 20241125123045)
  const transactionNumberString = 
    now.getFullYear().toString() + // YYYY
    (now.getMonth() + 1).toString().padStart(2, '0') + // MM (0-based index, add 1)
    now.getDate().toString().padStart(2, '0') + // DD
    now.getHours().toString().padStart(2, '0') + // HH
    now.getMinutes().toString().padStart(2, '0') + // MM
    now.getSeconds().toString().padStart(2, '0'); // SS

  // Convert the string to a number
  return Number(transactionNumberString);
}

  checkout() {
    this.cartViewList.forEach((item: {
      item: string,
      name: string,
      itemPrice: number,
      quantity: number,
      subTotal: number
    }) => this.cartData.push({
      item: item.item,
      itemPrice: item.itemPrice,
      quantity: item.quantity,
      subTotal: item.subTotal
    }));
    console.log("cartData", this.cartData);

    const transactionNumber: number = this.getUniqueTransactionNumber();

    const isRecurring: boolean = this.salesForm.value.recurring;

    this.checkoutCart = {
      transactionNumber: transactionNumber,
      branch: this.salesForm.value.branch,
      client: this.salesForm.value.client,
      cart: this.cartData,
      discount: this.discount?.value ?? 0,
      totalPrice: Number(this.salesForm.value.totalPrice),
      paid: !isRecurring,
      dateIssued: new Date(),
      recurring: this.salesForm.value.recurring
    };

    console.log("checkout", this.checkoutCart);

    const modalElement = document.getElementById('confirmCheckoutModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'confirmCheckoutModal' not found.");
    }
  } 

  onSave(event: any) {
    // Close the modal after saving data
    const modalElement = document.getElementById('confirmCheckoutModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.resetForm();
      } else {
        console.error("No Bootstrap modal instance found for 'confirmCheckoutModal'.");
      }
    } else {
      console.error("Modal element with ID 'confirmCheckoutModal' not found.");
    }
  }
}
