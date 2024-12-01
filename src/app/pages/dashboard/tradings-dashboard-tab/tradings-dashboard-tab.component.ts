import { CommonModule } from "@angular/common";
import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChartData, ChartOptions } from "chart.js";
import saveAs from "file-saver";
import { BaseChartDirective } from "ng2-charts";
import { Cart } from "../../../shared/models/cart.model";
import { SaleItem } from "../../../shared/models/sale-item.model";
import { Sale } from "../../../shared/models/sale.model";
import { Service } from "../../../shared/models/service.model";
import { TradingItem } from "../../../shared/models/trading-item.model";
import { ServicesTabService } from "../../inventory/services-tab/services-tab.service";
import { TradingTabService } from "../../inventory/trading-tab/trading-tab.service";
import { SalesService } from "../../sales/sales.service";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-tradings-dashboard-tab',
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './tradings-dashboard-tab.component.html',
  styleUrl: './tradings-dashboard-tab.component.scss'
})
export class TradingsDashboardTabComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  reports: SaleItem[] = [];
  tableData: SaleItem[] = [];
  tradings: TradingItem[] = [];
  services: Service[] = [];
  errorMessage: string = '';

  selectedMonth: number | null = null; // The selected month value bound to ngModel
  months: { value: number; label: string }[] = []; // Array to hold months with values and labels

  selectedYear: number | null = null; // The selected year bound to ngModel

  lowStocks: TradingItem[] = [];

  salesByMonth: any;

  // Total sales variables
  dailySales: number = 0;
  weeklySales: number = 0;
  monthlySales: number = 0;
  yearlySales: number = 0;

  // Chart.js data
  public chartData: ChartData<'line'> = {
    labels: [], // Months
    datasets: [
      {
        label: 'Sales per Month',
        data: [], // Sales values
        fill: false,
        borderColor: 'rgba(255, 255, 255, 1)',
        tension: 0.1
      }
    ]
  };

  public chartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Sales per Month'
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Month'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Total Sales'
      }
    }
  }
};


  constructor(
    private salesService: SalesService,
    private tradingService: TradingTabService,
    private serviceService: ServicesTabService,
    private changeDetectorRef: ChangeDetectorRef
  ) { 

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
    this.selectedYear = new Date().getFullYear(); // Get the current year
    this.selectedMonth = new Date().getMonth() + 1;

    this.fetchTradings();
    this.fetchServices();
    this.fetchSales();
  }

  ngAfterViewInit(): void {
    // AfterViewInit is usually better for handling view-related updates
    if (this.chart) {
      this.chart.update();
    }
  }

  processSalesData(sales: SaleItem[]): void {
  this.salesByMonth = Array(12).fill(0); // Initialize array for each month

  const currentYear = new Date().getFullYear();

  // Filter sales by the current year and branch
  const filteredSales = sales.filter(sale => {
    const saleYear = new Date(sale.dateIssued).getFullYear();
    return saleYear === currentYear && sale.branch === "Tradings";
  });
    
    const uniqueSales = Array.from(new Set(filteredSales.map(sale => sale.transactionNumber)))
  .map(id => filteredSales.find(sale => sale.transactionNumber === id));


  // Sum the sales for each month
  uniqueSales.forEach((sale: any) => {
  const month = new Date(sale.dateIssued).getMonth(); // Get month (0-11)
  this.salesByMonth[month] += sale.cartItemSubTotal; // Sum sales by month
});


  // Update yearly sales from the same dataset
    this.yearlySales = filteredSales.reduce((total, sale) => total + sale.cartItemSubTotal, 0);
    const monthlyTotal = this.salesByMonth.reduce((sum: any, value: any) => sum + value, 0);
    if (monthlyTotal !== this.yearlySales) {
      console.warn('Mismatch found:', { monthlyTotal, yearlySales: this.yearlySales });
    }

  console.log('Filtered Sales for Current Year:', filteredSales);
  console.log('Sales Data by Month:', this.salesByMonth);
  console.log('Yearly Sales:', this.yearlySales);

  // Prepare chart data
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  this.chartData.labels = months;
  this.chartData.datasets[0].data = this.salesByMonth;

  // Manually trigger change detection
    this.changeDetectorRef.detectChanges();
    this.updateChartData();

}

  updateChartData() {
    // ... (process the data to generate this.salesByMonth as before)
    this.chartData = { // Use a new object to ensure change detection
      labels: this.chartData.labels,
      datasets: [{
        ...this.chartData.datasets[0],  // Spread to retain existing properties
        data: this.salesByMonth,
      }]
    };


    // Update chart if it exists
    if (this.chart) {
      this.chart.update(); // Use this instead of ChangeDetectorRef
    } else {
      console.warn("Chart not yet initialized."); // Handle this case if needed
    }
}

  fetchLowStocks() {
    this.tradingService.getLowStocks().subscribe({
      next: (response) => {
        // Extract body data
        this.lowStocks = response;
        console.log('Response body:', this.lowStocks);
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }

/**
 * Fetch and transform sales data into reports
 */
  fetchSales() {
    this.tableData = [];
    console.log('Fetching sales...');
    console.log('Selected Filters:', {
      year: this.selectedYear,
      month: this.selectedMonth,
    });

    // Fetch ALL sales first
    this.salesService.getSales().subscribe({
      next: (sales: Sale[]) => {
        console.log('Total sales fetched:', sales.length);

        console.log('Reports Before Transformation:', this.reports);

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

        // Log final filtered sales before transformation
        console.log('Final Filtered Sales:', filteredSales);

        console.log('Reports After Transformation:', this.reports);

        // Transform the filtered sales into sale items
        this.transformSalesToSaleItems(filteredSales);
        this.transformAllSales(sales)
        this.calculateTotalSales(sales);

        this.updateChartData();
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

  transformAllSales(sales: Sale[]) {
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
          } else {
            console.warn(`Trading item with ID ${cartItem.item} not found.`);
          }
        }
        // else if (sale.branch === 'Services') {
        //   // Find the service in this.services
        //   const serviceItem = this.services.find((service) => service._id === cartItem.item);
        //   if (serviceItem) {
        //     cartItemName = serviceItem.name;
        //     // console.log('Service Item Found:', serviceItem);
        //   } else {
        //     console.warn(`Service item with ID ${cartItem.item} not found.`);
        //   }
        // }
        else {
          console.error(`Unsupported branch type: ${sale.branch}`);
        }
      });
    });
    this.processSalesData(this.reports);
    console.log('Final Transformed Reports:', this.reports);
    console.log('Total Reports Count:', this.reports.length);
  } catch (error) {
    this.errorMessage = 'An error occurred while transforming sales data. Please try again.';
    console.error('Transformation Error:', error);
  }
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
            this.tableData.push({
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
          } else {
            console.warn(`Trading item with ID ${cartItem.item} not found.`);
          }
        }
        // else if (sale.branch === 'Services') {
        //   // Find the service in this.services
        //   const serviceItem = this.services.find((service) => service._id === cartItem.item);
        //   if (serviceItem) {
        //     cartItemName = serviceItem.name;
        //     // console.log('Service Item Found:', serviceItem);
        //   } else {
        //     console.warn(`Service item with ID ${cartItem.item} not found.`);
        //   }
        // }
        else {
          console.error(`Unsupported branch type: ${sale.branch}`);
        }
      });
    });
    this.processSalesData(this.tableData);
    console.log('Final Transformed Reports:', this.tableData);
    console.log('Total Reports Count:', this.tableData.length);
  } catch (error) {
    this.errorMessage = 'An error occurred while transforming sales data. Please try again.';
    console.error('Transformation Error:', error);
  }
  }
  
  /**
   * Calculate total sales for different time periods
   */
  calculateTotalSales(sales: Sale[]): void {
  // Ensure consistency by using filteredSales for both calculations
  const currentYear = new Date().getFullYear();
  const filteredSales = sales.filter(sale => {
  const saleYear = new Date(sale.dateIssued).getFullYear();
  const matchesBranch = sale.branch === "Tradings";
  const matchesYear = saleYear === currentYear;
  console.log(`Filtering sale: Year=${saleYear}, Matches Year=${matchesYear}, Matches Branch=${matchesBranch}`);
  return matchesYear && matchesBranch;
});


  // Calculate yearly sales
  this.yearlySales = filteredSales.reduce((total, sale) => total + sale.totalPrice, 0);

  console.log('Yearly Sales:', this.yearlySales);
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
