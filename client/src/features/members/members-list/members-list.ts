import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Member, MemberFilterParams } from '../../../Types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../Types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-members-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './members-list.html',
  styleUrl: './members-list.css',
})
export class MembersList implements OnInit {

  @ViewChild('filterModal', { static: false }) modal!: FilterModal;
  private membersService = inject(MemberService);

  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);

  memberFilterParams = new MemberFilterParams();

  ngOnInit(): void {
    this.loadMembers();
  }


  loadMembers() {
    this.membersService.getMembers(this.memberFilterParams).subscribe(result => {
      this.paginatedMembers.set(result);
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberFilterParams.pageNumber = event.pageNumber;
    this.memberFilterParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  openModal() {
    if (this.modal) {
      this.modal.open();
    } else {
      console.error('Modal not found');
    }
  }

  onCloseModal() {
    console.log('Filter modal closed');
  }

  onFilterChange(data: MemberFilterParams) {
    console.log('Received filter data:', data);
    this.memberFilterParams = data;
    this.memberFilterParams.pageNumber = 1;
    this.loadMembers();
  }

  resetFilters() {
    this.memberFilterParams = new MemberFilterParams();
    this.loadMembers();
  }
  // members$ = this.membersService.getMembersList();
}
