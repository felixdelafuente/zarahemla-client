import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Client } from '../../shared/models/client.model';
import { LoyaltyTabComponent } from "./loyalty-tab/loyalty-tab.component";
import { VehicleTabComponent } from "./vehicle-tab/vehicle-tab.component";
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseTabComponent } from "./purchase-tab/purchase-tab.component";
import { ServiceTabComponent } from "./service-tab/service-tab.component";

@Component({
    selector: 'app-client',
    imports: [
        CommonModule,
        LoyaltyTabComponent,
        VehicleTabComponent,
        PurchaseTabComponent,
        ServiceTabComponent
    ],
    templateUrl: './client.component.html',
    styleUrl: './client.component.scss'
})
export class ClientComponent {
  clientId: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';

    if (this.clientId != "") {
      console.log('Client Data from URL:', this.clientId);
    }
  }

  goBack() {
    this.router.navigateByUrl('/management/billing-client')
  }
}
