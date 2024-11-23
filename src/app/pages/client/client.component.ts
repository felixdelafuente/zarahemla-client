import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Client } from '../../shared/models/client.model';
import { LoyaltyTabComponent } from "./loyalty-tab/loyalty-tab.component";
import { VehicleTabComponent } from "./vehicle-tab/vehicle-tab.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    LoyaltyTabComponent,
    VehicleTabComponent
],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  clientId: string = "";

  constructor(private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';

    if (this.clientId != "") {
      console.log('Client Data from URL:', this.clientId);
    }
  }

  goBack() {
    
  }
}
