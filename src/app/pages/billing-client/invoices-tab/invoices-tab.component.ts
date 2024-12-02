import { Component } from '@angular/core';
import { InvoicesTabService } from './invoices-tab.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { Pagination } from '../../../shared/models/paginated-result.model';
import { Sale } from '../../../shared/models/sale.model';
import * as bootstrap from 'bootstrap';
import { UpdatePaidRecurringModalComponent } from "./modals/update-paid-recurring-modal/update-paid-recurring-modal.component";
import { FormsModule } from '@angular/forms';
import { ClientsTabService } from '../clients-tab/clients-tab.service';
import { Client } from '../../../shared/models/client.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ServicesTabService } from '../../inventory/services-tab/services-tab.service';
import { TradingTabService } from '../../inventory/trading-tab/trading-tab.service';
import { Service } from '../../../shared/models/service.model';
import { TradingItem } from '../../../shared/models/trading-item.model';

@Component({
  selector: 'app-invoices-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UpdatePaidRecurringModalComponent
],
  templateUrl: './invoices-tab.component.html',
  styleUrl: './invoices-tab.component.scss'
})
export class InvoicesTabComponent {
  paginatedData: Sale[] = [];  // Store paginated data
  currentPage: number = 1;
  pageSize: number = 10;  // Adjust the page size
  totalPages: number = 1;
  pageNumbers: number[] = [];
  searchQuery: string = '';

  selectedItems: { ids: string[] } = { ids: [] }; // Store selected item IDs

  selectedItem: any;

  isOverdue: boolean = false;
  lowStocks: Sale[] = [];

  clientId: string = "";

  filterField: string = "All";
  isPaid: boolean | undefined = undefined;

  clientResult: Client | undefined = undefined;

  constructor(
    private service: InvoicesTabService,
    private toastSale: ToastService,
    private route: ActivatedRoute,
    private clientService: ClientsTabService,
    private tradingService: TradingTabService,
    private serviceService: ServicesTabService
  ) { }
  
  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';

    if (this.clientId != "") {
      console.log("clientId", this.clientId);
      this.fetchPaginatedData(this.currentPage);
    } else {
      this.fetchPaginatedData(this.currentPage);
    }
  }

  fetchPaginatedData(page: number, paid?: string) {
    this.paginatedData = [];
    console.log("paid", paid);
    if (paid == "Paid") {
      this.isPaid = true;
    } else if (paid == "Unpaid") {
      this.isPaid = false;
    } else {
      this.isPaid = undefined;
    }
    console.log("bool", this.isPaid);
    if (this.isPaid !== undefined) {
      this.service.getPaginated(page, this.isPaid).subscribe({
        next: (response) => {
          const paginationHeader = response.headers.get('Pagination');
          if (paginationHeader) {
            const pagination: Pagination = JSON.parse(paginationHeader);
            this.currentPage = pagination.currentPage;
            this.totalPages = Math.ceil(pagination.totalItems / this.pageSize);
            this.pageNumbers = Array.from({ length: this.totalPages }, (_, index) => index + 1);
          }

          // Extract body data
          this.paginatedData = response.body;
          console.log('Response body:', this.paginatedData);
          console.log('Pagination data:', paginationHeader);
          console.log('All headers:', response.headers);

        },
        error: (err) => {
          console.error('Error fetching paginated data', err);
        }
      });
    } else {
      this.service.getPaginated(page).subscribe({
        next: (response) => {
          const paginationHeader = response.headers.get('Pagination');
          if (paginationHeader) {
            const pagination: Pagination = JSON.parse(paginationHeader);
            this.currentPage = pagination.currentPage;
            this.totalPages = Math.ceil(pagination.totalItems / this.pageSize);
            this.pageNumbers = Array.from({ length: this.totalPages }, (_, index) => index + 1);
          }

          // Extract body data
          this.paginatedData = response.body;
          console.log('Response body:', this.paginatedData);
          console.log('Pagination data:', paginationHeader);
          console.log('All headers:', response.headers);

        },
        error: (err) => {
          console.error('Error fetching paginated data', err);
        }
      });
    }
    
  }

  seeDuePayment() {
    const modalElement = document.getElementById('overdueModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'overdueModal' not found.");
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPaginatedData(page);
    }
  }

  onEditPaidRecurring(item: Sale) {
    this.selectedItem = item;

    const modalElement = document.getElementById('updatePaidRecurringModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'updatePaidRecurringModal' not found.");
    }
  }

  onSave(item: any) {
    // Handle saving the updated data (e.g., make an API call)
    console.log('Updateddata:', item);

    // Close the modal after saving data
    const modalElement = document.getElementById('updatePaidRecurringModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'updatePaidRecurringModal'.");
      }
    } else {
      console.error("Modal element with ID 'updatePaidRecurringModal' not found.");
    }
  }

  onViewInvoice(saleData: Sale) {
    this.clientService.getById(saleData.client._id).subscribe({
      next: (response) => {
          // Extract body data
        this.clientResult = response;
        
        if (this.clientResult && saleData) {
          this.generateInvoice(saleData, this.clientResult); // Generate the invoice
        }
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }

  generateInvoice(sale: Sale, client: Client) {
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
