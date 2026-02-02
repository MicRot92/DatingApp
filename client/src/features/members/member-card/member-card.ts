import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../Types/member';
import { RouterLink } from "@angular/router";
import { AgePipe } from "../../../core/pipes/age-pipe";
import { LikesService } from '../../../core/services/likes-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  member = input.required<Member>();
  private likesService = inject(LikesService);
  protected hasLiked = computed(() => { return this.likesService.likeIds().includes(this.member().id) });

  toggleLike(event: Event) {
    event.stopPropagation();

    this.likesService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likesService.likeIds.update(ids => ids.filter(id => id !== this.member().id));
        } else {
          this.likesService.likeIds.update(ids => [...ids, this.member().id]);
        }
      }
    });
  }
}
