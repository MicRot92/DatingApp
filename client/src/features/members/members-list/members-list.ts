import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Member } from '../../../Types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../Types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";

@Component({
  selector: 'app-members-list',
  imports: [AsyncPipe, MemberCard, Paginator],
  templateUrl: './members-list.html',
  styleUrl: './members-list.css',
})
export class MembersList {


  private membersService = inject(MemberService);

  protected paginatedMembers$?: Observable<PaginatedResult<Member>>;

  pageNumber = 1;
  pageSize = 5;
  /**
   *
   */
  constructor() {
    this.loadMembers();
  }


  loadMembers() {
    this.paginatedMembers$ = this.membersService.getMembers(this.pageNumber, this.pageSize);
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadMembers();
  }
  // members$ = this.membersService.getMembersList();
}
