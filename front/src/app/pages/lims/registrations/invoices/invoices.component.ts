import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/services/invoice.service';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})

export class InvoicesComponent {
  public userService: InvoiceService 
  invoices: any[] = [];

  constructor(userService: InvoiceService) {
    this.userService = userService;
    registerLocaleData(localePt);
  }

  ngOnInit(): void {

    
    this.userService?.GetInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        console.log('Invoices:', invoices);
      },
      error: (error) => {
        console.error('Error fetching invoices:', error);
      }
    });
  }

  deleteInvoice(id: number) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.userService?.DeleteInvoice(id).subscribe({
        next: () => {
          this.invoices = this.invoices.filter(invoice => invoice.id !== id);
          console.log('Invoice deleted:', id);
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
        }
      });
    }
  }
}
