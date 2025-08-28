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
  public invoiceService: InvoiceService 
  invoices: any[] = [];
  editingRowIndex: number | null = null;
  originalInvoiceData: any = null;

  constructor(userService: InvoiceService) {
    this.invoiceService = userService;
    registerLocaleData(localePt);
  }
  editRow(index: number) {
    this.editingRowIndex = index;

    // Faz uma cópia para restaurar se cancelar
    this.originalInvoiceData = { ...this.invoices[index] };
  }
  saveInvoice(index: number) {
    const invoice = this.invoices[index];
    // Aqui você pode chamar um serviço para salvar a fatura no backend, ex:
    this.invoiceService.UpdateInvoice(invoice).subscribe({
      next: (response) => {
        console.log('Atualizado com sucesso!', response);
        this.editingRowIndex = null;
        this.originalInvoiceData = null;
      },
      error: (error) => {
        console.error('Erro ao atualizar fatura', error);
        alert('Erro ao salvar fatura.');
      }
    });

    this.editingRowIndex = null;
    this.originalInvoiceData = null;
  }
  cancelEdit() {
    if (this.editingRowIndex !== null) {
      this.invoices[this.editingRowIndex] = { ...this.originalInvoiceData };
    }
    this.editingRowIndex = null;
    this.originalInvoiceData = null;
  }

  ngOnInit(): void {

    
    this.invoiceService?.GetInvoices().subscribe({
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
      this.invoiceService?.DeleteInvoice(id).subscribe({
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
