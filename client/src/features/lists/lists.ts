import { Component, inject, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../Types/member';
import { MemberCard } from "../members/member-card/member-card";

@Component({
  selector: 'app-lists',
  imports: [MemberCard],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists {
  private likesService = inject(LikesService);
  protected members = signal<Member[]>([]);
  protected predicate = 'liked';
  tabs = [
    { label: 'Liked Members', value: 'liked' },
    { label: 'Members Who Liked You', value: 'likedBy' },
    { label: 'Mutual Likes', value: 'mutual' }
  ];

  setPredicate(predicate: string) {
    this.predicate = predicate;
    this.loadLikes();
  }

  ngOnInit(): void {
    this.loadLikes();
  }
  loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: members => {
        console.log('loaded liked members: ', members);
        this.members.set(members);
      }
    });
  }
}
