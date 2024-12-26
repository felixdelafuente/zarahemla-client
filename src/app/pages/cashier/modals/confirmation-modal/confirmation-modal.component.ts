import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CashierService } from '../../cashier.service';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { NewSale } from '../../../../shared/models/new-sale.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientsTabService } from '../../../billing-client/clients-tab/clients-tab.service';
import { Client } from '../../../../shared/models/client.model';
import { Service } from '../../../../shared/models/service.model';
import { TradingItem } from '../../../../shared/models/trading-item.model';
import { TradingTabService } from '../../../inventory/trading-tab/trading-tab.service';
import { ServicesTabService } from '../../../inventory/services-tab/services-tab.service';
import { Cart } from '../../../../shared/models/cart.model';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() checkoutData: NewSale | undefined; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  clientResult: Client | undefined = undefined;

  constructor(
    private service: CashierService,
    private toastService: ToastService,
    private clientService: ClientsTabService,
    private tradingService: TradingTabService,
    private serviceService: ServicesTabService
  ) { }

  onClose() {
    const modalElement = document.getElementById('confirmCheckoutModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide(); // Safely hide the modal if an instance exists
    } else {
      console.error("Modal element with ID 'confirmCheckoutModal' not found.");
    }
  }

  onCheckout() {
    if (this.checkoutData) {
      this.service.add(this.checkoutData).subscribe({
        next: (data: any) => {
          this.onSave.emit(data);
          this.toastService.show('Transaction completed successfully!', 'success');
          if (this.checkoutData) {
            this.clientService.getById(this.checkoutData.client).subscribe({
              next: (response) => {
                  // Extract body data
                this.clientResult = response;
                
                if (this.clientResult && this.checkoutData) {
                  this.generateInvoice(this.checkoutData, this.clientResult); // Generate the invoice

                  this.checkoutData.cart.forEach((item: Cart) => {
                    this.tradingService.modifyQuantity(item.item, -item.quantity).subscribe({
                      next: (data: any) => {
                        this.toastService.show('Modified quantity successfully!', 'success');
                    },
                    error: (msg: any) => {
                      console.log("error:", msg);
                      this.toastService.show(
                        'Failed to modify quantity. Please try again.',
                        'danger'
                      );
                    },
                  });
                  });
                }
              },
              error: (err) => {
                console.error('Error fetching paginated data', err);
              }
            });
          }
        },
        error: (msg: any) => {
          console.log("error:", msg);
          this.toastService.show(
            'Failed to complete transaction. Please try again.',
            'danger'
          );
        },
      });
    } else {
      this.toastService.show(
        'Failed to load cart data. Please try again.',
        'danger'
      );
    }
  }

  generateInvoice(sale: NewSale, client: Client) {
    const doc = new jsPDF();

    const imgData = 'data:public/images/zarahemla-logo.png;base64,...';
    doc.addImage(imgData, 'JPEG', 150, 10, 50, 50);

    // Header content
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Invoice", 20, 20);

    // Transaction details
    doc.setFontSize(12);
    doc.text(`Invoice #: ${sale.transactionNumber}`, 20, 30);
    doc.text(`Date: ${new Date(sale.dateIssued).toLocaleDateString()}`, 20, 40);
    doc.text(`Branch: ${sale.branch}`, 20, 50);

    // Bill from details
    doc.text("Bill From:", 20, 60);
    doc.text("Zarahemla Trading and Services", 20, 65);
    doc.text("Diversion Road, Batangas, 4200", 20, 70);
    doc.text("09569508545", 20, 75);

    // Bill to details
    doc.text("Bill To:", 20, 85);
    doc.text(`${client.name}`, 20, 90);
    doc.text(`${client.contact}`, 20, 95);
    doc.text(`${client.email}`, 20, 100);

    const cartDetails: any[] = [];
    const fetchPromises: Promise<void>[] = sale.cart.map((item) => {
      if (sale.branch === "Tradings") {
        // Fetch trading details
        return new Promise((resolve, reject) => {
          this.tradingService.getById(item.item).subscribe({
            next: (response: TradingItem) => {
              cartDetails.push({
                name: response.brand,
                description: response.description,
                quantity: item.quantity,
                price: item.itemPrice,
                subtotal: item.quantity * item.itemPrice,
              });
              resolve();
            },
            error: (err) => {
              console.error("Error fetching trading item details:", err);
              reject(err);
            },
          });
        });
      } else if (sale.branch === "Services") {
        // Fetch service details
        return new Promise((resolve, reject) => {
          this.serviceService.getById(item.item).subscribe({
            next: (response: Service) => {
              cartDetails.push({
                name: response.name,
                description: response.description,
                quantity: item.quantity,
                price: item.itemPrice,
                subtotal: item.quantity * item.itemPrice,
              });
              resolve();
            },
            error: (err) => {
              console.error("Error fetching service item details:", err);
              reject(err);
            },
          });
        });
      }

      // If branch does not match Tradings or Services, return a resolved Promise
      return Promise.resolve();
    });

    // Wait for all promises to resolve before generating the table
    Promise.all(fetchPromises)
      .then(() => {
        const yPosition = 110; // Starting Y position for the table

        autoTable(doc, {
          startY: yPosition,
          head: [["Item", "Description", "Quantity", "Price", "Sub Total"]],
          body: cartDetails.map((detail) => [
            detail.name,
            detail.description,
            detail.quantity.toString(),
            `Php ${detail.price.toFixed(2)}`,
            `Php ${detail.subtotal.toFixed(2)}`,
          ]),
          theme: "grid",
          headStyles: { fillColor: [176, 42, 55], textColor: [255, 255, 255] },
        });

        // Add total price, discount, and payment status
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.text(`Total Price: Php ${sale.totalPrice.toFixed(2)}`, 20, finalY);
        doc.text(`Discount: Php ${sale.discount.toFixed(2)}`, 20, finalY + 10);
        doc.text(`Payment Type: ${sale.recurring ? "Recurring" : "Single Payment"}`, 20, finalY + 20);
        doc.text(`Paid: ${sale.paid ? "Yes" : "No"}`, 20, finalY + 30);

        // Save the PDF
        doc.save(`Invoice_${sale.transactionNumber}.pdf`);
      })
      .catch((error) => {
        console.error("Error resolving item details for invoice:", error);
      });
  }
}
