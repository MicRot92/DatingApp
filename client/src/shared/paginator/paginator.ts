import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  pageNumber = model(1);
  pageSize = model(10);
  totalItems = input<number>(0);
  pageSizeOptions = input<number[]>([5, 10, 20, 50]);

  pageChange = output<{ pageNumber: number, pageSize: number }>();
  lastItemIndex(): number {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalItems());
  }

  onPageChange(newPage?: number, pageSize?: EventTarget | null) {
    if (newPage)
      this.pageNumber.set(newPage);
    if (pageSize) {

      const pageSizeValue = Number((pageSize as HTMLSelectElement).value);
      this.pageSize.set(pageSizeValue);
    }

    this.pageChange.emit({ pageNumber: this.pageNumber(), pageSize: this.pageSize() });
  }
}
