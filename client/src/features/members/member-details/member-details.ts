import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../Types/member';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-details',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  private membersService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected member$?: Observable<Member>;
  protected title = signal<string | undefined>('Profile');

  ngOnInit(): void {
    this.member$ = this.loadMember();
    this.title.set(this.route.firstChild?.snapshot?.title);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({

      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      }
    })
  }

  loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    return this.membersService.getMember(id);
  }
}
