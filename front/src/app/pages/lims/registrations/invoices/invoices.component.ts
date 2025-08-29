import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/services/invoice.service';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule,FormsModule ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})

export class InvoicesComponent {
  // Variáveis
  public invoiceService: InvoiceService;
  invoices: any[] = [];
  editingRowIndex: number | null = null;
  originalInvoiceData: any = null;

  //////////////////////////////////////////////////////////////////////////
  /// Constructor
  //////////////////////////////////////////////////////////////////////////
  constructor(userService: InvoiceService) {
    this.invoiceService = userService;
    registerLocaleData(localePt);
  }
  //////////////////////////////////////////////////////////////////////////
  // On initialize the component. Read invoices from the database
  //////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
  
    this.invoiceService?.GetInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        console.log('Invoices:', invoices);
      },
      error: (error) => {
        console.error('Error fetching invoices:', error);
        alert('Error fetching invoices.');
      }
    });
  }
  //////////////////////////////////////////////////////////////////////////
  // On click on cancel button
  //////////////////////////////////////////////////////////////////////////
  cancelEdit() {
    if (this.editingRowIndex !== null) {
      const invoice = this.invoices[this.editingRowIndex];
      if (invoice.isNew) {
        this.invoices.splice(this.editingRowIndex, 1);
      }
    }
    this.editingRowIndex = null;
  }
  //////////////////////////////////////////////////////////////////////////
  // On click on edit button
  //////////////////////////////////////////////////////////////////////////
  editRow(index: number) {
    this.editingRowIndex = index;

    // Make a copy to restore if canceled
    this.originalInvoiceData = { ...this.invoices[index] };
  }
  //////////////////////////////////////////////////////////////////////////
  // On click on save button
  //////////////////////////////////////////////////////////////////////////
  saveInvoice(index: number) {
    const invoice = this.invoices[index];
    // Check if the invoice is new
    if (invoice.isNew) {
      // The invoice is being created
      this.invoiceService.CreateInvoice(invoice).subscribe({
        next: (response) => {
          console.log('Created successfully!', response);
          this.editingRowIndex = null;
          this.originalInvoiceData = null;
          this.invoices[index] = response;
        },
        error: (error) => {
          console.error('Error creating invoice:', error);
          alert('Error saving invoice.');
        }
      });
    }
    else
    {
      // The invoice is being edited
      this.invoiceService.UpdateInvoice(invoice).subscribe({
        next: (response) => {
          console.log('Updated successfully!', response);
          this.editingRowIndex = null;
          this.originalInvoiceData = null;
        },
        error: (error) => {
          console.error('Error updating invoice:', error);
          alert('Error saving invoice.');
        }
      });

      this.editingRowIndex = null;
      this.originalInvoiceData = null;
    }
  }
  //////////////////////////////////////////////////////////////////////////
  // On click on add button
  //////////////////////////////////////////////////////////////////////////
  addInvoice() {
    const newInvoice = {
      //id: this.invoices.length + 1,
      invoice: '',
      amount: 0,
      date: new Date(),
      status: 'Subscribed',
      isNew: true
    };
    this.invoices.push(newInvoice);
    this.editRow(this.invoices.length - 1);
  }
  //////////////////////////////////////////////////////////////////////////
  // On click on delete button
  //////////////////////////////////////////////////////////////////////////
  deleteInvoice(id: number) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.invoiceService?.DeleteInvoice(id).subscribe({
        next: () => {
          this.invoices = this.invoices.filter(invoice => invoice.id !== id);
          console.log('Invoice deleted:', id);
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
          alert('Error deleting invoice.');
        }
      });
    }
  }
}
