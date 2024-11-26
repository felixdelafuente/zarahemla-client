import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServicesTabComponent } from "./services-tab/services-tab.component";
import { TradingTabComponent } from "./trading-tab/trading-tab.component";

@Component({
    selector: 'app-inventory',
    imports: [CommonModule, ServicesTabComponent, TradingTabComponent],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  
}
