import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  isEdit = false;
  invoiceId: string | null = null;
  isModal = false;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<InvoiceFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isModal = !!dialogRef;

    this.invoiceForm = this.fb.group({
      customerName: ['', Validators.required],
      bookingId: [''],
      amount: ['', [Validators.required, Validators.min(0)]],
      dueDate: ['', Validators.required],
      status: ['pending', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.isModal && this.data) {
      if (this.data.bookingId) {
        this.invoiceForm.patchValue({
          bookingId: this.data.bookingId,
          customerName: this.data.customerName || '',
          status: 'pending'
        });
      }
    } else {
      this.invoiceId = this.route.snapshot.paramMap.get('id');
      if (this.invoiceId) {
        this.isEdit = true;
        const invoice = this.invoiceService.getById(this.invoiceId);
        if (invoice) {
          this.invoiceForm.patchValue(invoice);
        }
      } else {
        // Query param support for bookingId when routed
        const queryBookingId = this.route.snapshot.queryParamMap.get('bookingId');
        if (queryBookingId) {
          this.invoiceForm.patchValue({ bookingId: queryBookingId, status: 'pending' });
        }
      }
    }
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      if (this.isEdit && this.invoiceId) {
        this.invoiceService.update(this.invoiceId, this.invoiceForm.value);
        this.snackBar.open('Invoice updated successfully!', 'Close', { duration: 3000 });
      } else {
        this.invoiceService.create(this.invoiceForm.value);
        this.snackBar.open('Invoice created successfully!', 'Close', { duration: 3000 });
      }

      this.closeOrNavigate();
    } else {
      this.invoiceForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.closeOrNavigate();
  }

  private closeOrNavigate(): void {
    if (this.isModal) {
      this.dialogRef.close(true);
    } else {
      this.router.navigate(['/invoices']);
    }
  }
}
