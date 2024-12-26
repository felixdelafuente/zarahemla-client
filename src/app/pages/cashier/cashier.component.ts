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
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent,
    FormsModule,
    ConfirmationModalComponent
],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.scss'
})
export class CashierComponent {  
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

  searchQuery = "";
  quantityControl = 0;
  currentPage: number = 1;

  selectedItem: { id: string, category: string, name: string, sellingPrice: number } | undefined;

  clientQuery = "";
  clientResult: Client[] = [];
  selectedClient: Client | undefined;

  discountQuery = "";
  discountResult: Discount[] = [];
  selectedDiscount: Discount | undefined;

  discount: Discount | undefined;

  paymentReceived = 0;
  change = 0;

  checkoutCart: NewSale | undefined;

  transactionNumberField: number = 0;
  branchField: string = "Choose...";
  clientField: string = "";
  cartField: Cart[] = [];
  discountField: number = 0;
  totalPriceField: number = 0;
  paidField: boolean = true;
  dateIssuedField: Date = new Date();
  recurringField: boolean = false;

  constructor(
    private tradingService: TradingTabService,
    private serviceService: ServicesTabService,
    private clientService: ClientsTabService,
    private discountService: LoyaltyTabService,
    private toastService: ToastService,
    private loyaltyService: LoyaltyTabService
  ) {
  }

  resetForm(): void {
    // this.transactionNumberField = 0;
    // this.branchField = "";
    // this.clientField = "";
    this.cartField = [];
    // this.discountField = 0;
    // this.totalPriceField = 0;
    // this.paidField = true;
    // this.dateIssuedField= new Date();
    // this.recurringField = false;

    this.cartViewList = [];
    // this.selectedClient = undefined;

    this.totalPriceField = 0;
  }

  

  fetchPaginatedData(page: number, searchQuery: string) {
    const query: string = searchQuery || "";
    console.log("query", query);
    if (this.branchField== "Tradings") {
      console.log("branch selected", this.branchField);
      this.tradingService.getPaginated(page, query).subscribe({
      next: (response) => {
          // Extract body data
          let tradingResponse: TradingItem[] = response.body;
          tradingResponse.forEach((item: TradingItem) => {
            this.filterList.push({
              id: item._id,
              category: item.brand,
              name: item.size,
              sellingPrice: item.sellingPrice
            });
          });
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
    } else if (this.branchField == "Services") {
      console.log("branch selected", this.branchField);
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
      console.log("no branch selected", this.branchField);
    }
  }

  selectItem(item: { id: string, category: string, name: string, sellingPrice: number }) {
    this.searchQuery = "";
    this.selectedItem = item;
    this.filterList = [];
  }

  addToCart() {
    if (this.quantityControl <= 0) {
      this.toastService.show(
          "Quantity must be more than 0.",
          'warning'
        );
    } else {
      if (this.selectedItem != undefined) {
      this.cartViewList.push({
      item: this.selectedItem.id,
      name: this.selectedItem.name,
      itemPrice: this.selectedItem.sellingPrice,
      quantity: this.quantityControl ?? 0,
      subTotal: this.selectedItem.sellingPrice * (this.quantityControl ?? 0)
      });

      this.totalPriceField += this.selectedItem.sellingPrice * (this.quantityControl ?? 0);
    
      this.selectedItem = undefined;
      this.quantityControl = 0;
    } else {
      console.log("no selected Item");
      this.toastService.show(
          "No selected item.",
          'warning'
        );
    }
    }
  }

  fetchClients(page: number, clientQuery: string) {
    const query: string = clientQuery || "";

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
    this.discountField = 0;
    this.clientQuery = "";
    this.selectedClient = client;
    this.clientField = client._id;
    this.clientResult = [];
    console.log('Selected client', this.clientField);
  }

  fetchDiscounts(page: number, discountQuery: string) {
    const query: string = discountQuery || "";

    this.loyaltyService.getPaginated(page, query, this.clientField).subscribe({
      next: (response) => {
          // Extract body data
          this.discountResult = response.body;
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }

  selectDiscount(discount: Discount) {
    this.discountField = 0;
    this.discountQuery = "";
    this.selectedDiscount = discount;
    this.discountField = discount.value;
    this.discountResult = [];
    this.totalPriceField -= this.discountField ?? 0;
    console.log('Selected client', this.totalPriceField);
  }

  calculateChange() {
    const payment = Number(this.paymentReceived || 0);
    const totalPrice = Number(this.totalPriceField || 0);
    this.change = payment - totalPrice
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

    const isRecurring: boolean = this.recurringField;
    console.log("client", this.selectedClient?._id);

    this.transactionNumberField = transactionNumber;
    this.cartField = this.cartData;
    // this.discountField = this.discount?.value ?? 0;


    this.checkoutCart = {
      transactionNumber: this.transactionNumberField,
      branch: this.branchField,
      client: this.clientField,
      cart: this.cartField,
      discount: this.discountField,
      totalPrice: Number(this.totalPriceField),
      paid: !isRecurring,
      dateIssued: new Date(),
      recurring: this.recurringField
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
