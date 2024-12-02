import { Component } from '@angular/core';
import { ClientsTabComponent } from "./clients-tab/clients-tab.component";
import { InvoicesTabComponent } from "./invoices-tab/invoices-tab.component";

@Component({
    selector: 'app-billing-client',
    standalone: true,
    imports: [ClientsTabComponent, InvoicesTabComponent],
    templateUrl: './billing-client.component.html',
    styleUrl: './billing-client.component.scss'
})
export class BillingClientComponent {

}
