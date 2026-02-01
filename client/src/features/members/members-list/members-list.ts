import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { filter, Observable } from 'rxjs';
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
  private updatedParams = new MemberFilterParams();

  /**
   *
   */
  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberFilterParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }

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
    this.memberFilterParams = { ...data };
    this.updatedParams = { ...data };
    this.memberFilterParams.pageNumber = 1;
    this.loadMembers();
  }

  resetFilters() {
    this.memberFilterParams = new MemberFilterParams();
    this.loadMembers();
  }

  get displaySelectedFilters(): string {
    const defaultParams = new MemberFilterParams();
    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(`Gender: ${this.updatedParams.gender}`);
    } else {
      filters.push(`Gender: All`);
    }

    if (this.updatedParams.minAge !== defaultParams.minAge || this.updatedParams.maxAge !== defaultParams.maxAge) {
      filters.push(`Age: ${this.updatedParams.minAge} - ${this.updatedParams.maxAge}`);
    } else {
      filters.push(`Age: All`);
    }

    filters.push(`Order by: ${this.updatedParams.orderBy === 'lastActive' ? 'Last Active' : 'Newest Members'}`);

    return filters.join(', ');
  }
}
