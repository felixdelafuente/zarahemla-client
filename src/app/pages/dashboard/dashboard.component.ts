import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
import { SalesService } from '../sales/sales.service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TradingsDashboardTabComponent } from "./tradings-dashboard-tab/tradings-dashboard-tab.component";
import { ServicesDashboardTabComponent } from "./services-dashboard-tab/services-dashboard-tab.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TradingsDashboardTabComponent,
    ServicesDashboardTabComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
}
