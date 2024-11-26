import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { Pagination } from '../../../shared/models/paginated-result.model';
import { Sale } from '../../../shared/models/sale.model';
import { PurchaseTabService } from '../purchase-tab/purchase-tab.service';
import { CommonModule } from '@angular/common';
import { ServiceTabService } from './service-tab.service';

@Component({
    selector: 'app-service-tab',
    imports: [
        CommonModule
    ],
    templateUrl: './service-tab.component.html',
    styleUrl: './service-tab.component.scss'
})
export class ServiceTabComponent {
  paginatedData: Sale[] = [];  // Store paginated data
  currentPage: number = 1;
  pageSize: number = 10;  // Adjust the page size
  totalPages: number = 1;
  pageNumbers: number[] = [];
  searchQuery: string = '';

  selectedItems: { ids: string[] } = { ids: [] }; // Store selected item IDs

  selectedItem: any;

  isLow: boolean = false;
  lowStocks: Sale[] = [];

  clientId: string = "";

  constructor(
    private service: ServiceTabService,
    private toastSale: ToastService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';

    if (this.clientId != "") {
      console.log("clientId", this.clientId);
      this.fetchPaginatedData(this.currentPage, undefined, this.clientId, "Services");
    } else {
      this.fetchPaginatedData(this.currentPage);
    }
  }

  fetchPaginatedData(page: number, query?: string, clientId?: string, branch?: string) {
    this.service.getPaginated(page, query, clientId, branch).subscribe({
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

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPaginatedData(page);
    }
  }
}
