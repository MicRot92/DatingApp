import { Component, inject, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../Types/member';
import { MemberCard } from "../members/member-card/member-card";
import { Paginator } from "../../shared/paginator/paginator";
import { PaginatedResult } from '../../Types/pagination';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists {
  private likesService = inject(LikesService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected pageNumber = 1;
  protected pageSize = 5;

  protected predicate = 'liked';
  tabs = [
    { label: 'Liked Members', value: 'liked' },
    { label: 'Members Who Liked You', value: 'likedBy' },
    { label: 'Mutual Likes', value: 'mutual' }
  ];

  setPredicate(predicate: string) {
    this.predicate = predicate;
    this.pageNumber = 1;
    this.loadLikes();
  }

  ngOnInit(): void {
    this.loadLikes();
  }
  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: members => {
        console.log('loaded liked members: ', members);
        this.paginatedMembers.set(members);
      }
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadLikes();
  }
}
