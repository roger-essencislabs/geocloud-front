import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/services/invoice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})

export class ProjectsComponent implements OnInit{
  public userService: InvoiceService 
  invoices: any[] = [];

  constructor(userService: InvoiceService) {
    this.userService = userService;
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
  
}
