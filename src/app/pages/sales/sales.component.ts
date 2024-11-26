import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SalesService } from './sales.service';
import { SaleItem } from '../../shared/models/sale-item.model';
import { Sale } from '../../shared/models/sale.model';
import { Cart } from '../../shared/models/cart.model';
import { forkJoin, map } from 'rxjs';
import { TradingTabService } from '../inventory/trading-tab/trading-tab.service';
import { ServiceTabService } from '../client/service-tab/service-tab.service';
import { Service } from '../../shared/models/service.model';
import { TradingItem } from '../../shared/models/trading-item.model';
import { ServicesTabService } from '../inventory/services-tab/services-tab.service';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-sales',
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.scss'
})
export class SalesComponent {
  reports: SaleItem[] = [];
  tradings: TradingItem[] = [];
  services: Service[] = [];
  errorMessage: string = '';

  selectedDate: number | null = null; // The selected date bound to ngModel
  days: number[] = []; // Array to hold days from 1 to 31

  selectedWeek: number | null = null; // The selected week value bound to ngModel
  weeks: { value: number; label: string }[] = []; // Array to hold weeks with values and labels


  selectedMonth: number | null = null; // The selected month value bound to ngModel
  months: { value: number; label: string }[] = []; // Array to hold months with values and labels

  selectedYear: number | null = null; // The selected year bound to ngModel
  years: number[] = []; // Array to hold years in descending order

  // Total sales variables
  dailySales: number = 0;
  weeklySales: number = 0;
  monthlySales: number = 0;
  yearlySales: number = 0;

  constructor(
    private salesService: SalesService,
    private tradingService: TradingTabService,
    private serviceService: ServicesTabService
  ) { 
    // Populate the days array with numbers from 1 to 31
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Populate the weeks array with value-label pairs
    this.weeks = [
      { value: 1, label: 'Week 1' },
      { value: 2, label: 'Week 2' },
      { value: 3, label: 'Week 3' },
      { value: 4, label: 'Week 4' }
    ];

    // Populate the months array with value-label pairs
    this.months = [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' }
    ];
  }

  ngOnInit(): void {
    this.fetchTradings();
    this.fetchServices();
    this.fetchSales();

    const currentYear = new Date().getFullYear(); // Get the current year
    const startYear = 2024; // Define the starting year

    // Populate the years array from currentYear to startYear in descending order
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }

  /**
 * Fetch and transform sales data into reports
 */
/**
 * Fetch and transform sales data into reports
 */
fetchSales() {
  console.log('Fetching sales...');
  console.log('Selected Filters:', {
    year: this.selectedYear,
    month: this.selectedMonth,
    date: this.selectedDate,
    week: this.selectedWeek
  });

  // Fetch ALL sales first
  this.salesService.getSales().subscribe({
    next: (sales: Sale[]) => {
      console.log('Total sales fetched:', sales.length);

      // Reset reports array
      this.reports = [];
      
      // Start with all sales
      let filteredSales = sales;

      // Filter by year (if a year is selected)
      if (this.selectedYear) {
        filteredSales = filteredSales.filter(sale => {
          const saleYear = new Date(sale.dateIssued).getFullYear();
          const yearMatch = saleYear.toString() === this.selectedYear?.toString();
          console.log(`Year Filter - Sale Year: ${saleYear}, Selected Year: ${this.selectedYear}, Match: ${yearMatch}`);
          return yearMatch;
        });
        console.log('Sales after year filter:', filteredSales.length);
      }

      // Filter by month (if a month is selected)
      if (this.selectedMonth) {
        filteredSales = filteredSales.filter(sale => {
          const saleMonth = new Date(sale.dateIssued).getMonth() + 1;
          const monthMatch = saleMonth.toString() === this.selectedMonth?.toString();
          console.log(`Month Filter - Sale Month: ${saleMonth}, Selected Month: ${this.selectedMonth}, Match: ${monthMatch}`);
          return monthMatch;
        });
        console.log('Sales after month filter:', filteredSales.length);
      }

      // Filter by date (if a date is selected)
      if (this.selectedDate) {
        filteredSales = filteredSales.filter(sale => {
          const saleDate = new Date(sale.dateIssued).getDate();
          const dateMatch = saleDate.toString() === this.selectedDate?.toString();
          console.log(`Date Filter - Sale Date: ${saleDate}, Selected Date: ${this.selectedDate}, Match: ${dateMatch}`);
          return dateMatch;
        });
        console.log('Sales after date filter:', filteredSales.length);
      }

      // Filter by week (if a week is selected)
      if (this.selectedWeek) {
        filteredSales = filteredSales.filter(sale => {
          const saleDate = new Date(sale.dateIssued);   
          const firstDayOfMonth = new Date(saleDate.getFullYear(), saleDate.getMonth(), 1);
          const week = Math.ceil((saleDate.getDate() + firstDayOfMonth.getDay()) / 7);
          
          const weekMatch = week.toString() === this.selectedWeek?.toString();
          console.log(`Week Filter - Calculated Week: ${week}, Selected Week: ${this.selectedWeek}, Match: ${weekMatch}`);
          console.log(`Sale Date Details:`, {
            fullDate: saleDate,
            year: saleDate.getFullYear(),
            month: saleDate.getMonth(),
            date: saleDate.getDate(),
            firstDayOfMonth: firstDayOfMonth
          });
          
          return weekMatch;
        });
        console.log('Sales after week filter:', filteredSales.length);
      }

      // Log final filtered sales before transformation
      console.log('Final Filtered Sales:', filteredSales);

      // Transform the filtered sales into sale items
      this.transformSalesToSaleItems(filteredSales);
      this.calculateTotalSales(sales);
    },
    error: (err) => {
      this.errorMessage = 'Failed to fetch sales data. Please try again.';
      console.error('Sales Fetch Error:', err);
    },
  });
}


  fetchTradings() {
    this.tradingService.getAll().subscribe({
      next: (items: TradingItem[]) => {
        this.tradings = items;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch sales data. Please try again.';
        console.error(err);
      },
    });
  }

  fetchServices() {
    this.serviceService.getAll().subscribe({
      next: (services: Service[]) => {
        this.services = services;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch sales data. Please try again.';
        console.error(err);
      },
    });
  }

  transformSalesToSaleItems(sales: Sale[]) {
  console.log('Transforming Sales to Sale Items. Sales count:', sales.length);

  try {
    sales.map((sale: Sale) => {
      sale.cart.map((cartItem: Cart) => {
        let cartItemName = '';
        
        // console.log('Processing Sale:', {
        //   transactionNumber: sale.transactionNumber,
        //   branch: sale.branch,
        //   dateIssued: sale.dateIssued
        // });

        if (sale.branch === 'Tradings') {
          // Find the trading item in this.tradings
          const tradingItem = this.tradings.find((item) => item._id === cartItem.item);
          if (tradingItem) {
            cartItemName = tradingItem.brand;
            // console.log('Trading Item Found:', tradingItem);
          } else {
            console.warn(`Trading item with ID ${cartItem.item} not found.`);
          }
        } else if (sale.branch === 'Services') {
          // Find the service in this.services
          const serviceItem = this.services.find((service) => service._id === cartItem.item);
          if (serviceItem) {
            cartItemName = serviceItem.name;
            // console.log('Service Item Found:', serviceItem);
          } else {
            console.warn(`Service item with ID ${cartItem.item} not found.`);
          }
        } else {
          console.error(`Unsupported branch type: ${sale.branch}`);
        }
        
        this.reports.push({
          transactionNumber: sale.transactionNumber,
          branch: sale.branch,
          clientName: sale.client.name,
          clientEmail: sale.client.email,
          clientContact: sale.client.contact,
          cartItemId: cartItem.item,
          cartItemName,
          cartItemPrice: cartItem.itemPrice,
          cartItemQuantity: cartItem.quantity,
          cartItemSubTotal: cartItem.subTotal,
          discount: sale.discount,
          totalPrice: sale.totalPrice,
          paid: sale.paid,
          dateIssued: sale.dateIssued,
          recurring: sale.recurring,
        });
      });
    });
    
    console.log('Final Transformed Reports:', this.reports);
    console.log('Total Reports Count:', this.reports.length);
  } catch (error) {
    this.errorMessage = 'An error occurred while transforming sales data. Please try again.';
    console.error('Transformation Error:', error);
  }
  }
  
  /**
   * Calculate total sales for different time periods
   */
  calculateTotalSales(sales: Sale[]) {
    const today = new Date();

    // Reset totals
    this.dailySales = 0;
    this.weeklySales = 0;
    this.monthlySales = 0;
    this.yearlySales = 0;

    sales.forEach((sale) => {
      const saleDate = new Date(sale.dateIssued);

      // Daily sales
      if (
        saleDate.getFullYear() === today.getFullYear() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getDate() === today.getDate()
      ) {
        this.dailySales += sale.totalPrice;
      }

      // Weekly sales (past 7 days)
      const daysDifference =
        (today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDifference >= 0 && daysDifference < 7) {
        this.weeklySales += sale.totalPrice;
      }

      // Monthly sales
      if (
        saleDate.getFullYear() === today.getFullYear() &&
        saleDate.getMonth() === today.getMonth()
      ) {
        this.monthlySales += sale.totalPrice;
      }

      // Yearly sales
      if (saleDate.getFullYear() === today.getFullYear()) {
        this.yearlySales += sale.totalPrice;
      }
    });

    console.log('Total Sales:', {
      dailySales: this.dailySales,
      weeklySales: this.weeklySales,
      monthlySales: this.monthlySales,
      yearlySales: this.yearlySales,
    });
  }

  onReset() {
    this.selectedDate = null;
    this.selectedWeek = null;
    this.selectedMonth = null;
    this.selectedYear = null;
    this.fetchSales();
  }

  exportReportsToExcel(): void {
    if (this.reports.length === 0) {
      alert('No data available to export!');
      return;
    }

    const formattedReports = this.reports.map(report => ({
      'Transaction Number': report.transactionNumber,
      Branch: report.branch,
      'Client Name': report.clientName,
      'Client Email': report.clientEmail,
      'Client Contact': report.clientContact,
      'Cart Item Name': report.cartItemName,
      'Cart Item Price': report.cartItemPrice,
      'Cart Item Quantity': report.cartItemQuantity,
      'Cart Item SubTotal': report.cartItemSubTotal,
      Discount: report.discount,
      'Total Price': report.totalPrice,
      Paid: report.paid,
      'Date Issued': report.dateIssued,
      Recurring: report.recurring,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedReports);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

    // Generate a binary Excel file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob and save it
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Sales_Reports.xlsx');
  }
}
