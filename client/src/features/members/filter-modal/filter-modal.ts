import { Component, ElementRef, model, output, ViewChild, viewChild } from '@angular/core';
import { Member, MemberFilterParams } from '../../../Types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {

  @ViewChild('filterModal') filterModal!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberFilterParams>();
  memberParams = model<MemberFilterParams>(new MemberFilterParams());


  /**
   *
   */
  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }

  submit() {
    this.submitData.emit(this.memberParams());
    this.close();
  }

  open() {
    console.log('Opening filter modal');
    this.filterModal.nativeElement.showModal();
  }

  close() {
    this.filterModal.nativeElement.close();
    this.closeModal.emit();
  }

  onMinAgeChange() {
    if (this.memberParams().minAge < 18) {
      this.memberParams().minAge = 18;
    }

  }


  onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.memberParams().maxAge = this.memberParams().minAge;
    }
  }
}
