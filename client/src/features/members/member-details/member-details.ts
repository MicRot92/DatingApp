import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../../../Types/member';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-details',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  private membersService = inject(MemberService);
  private route = inject(ActivatedRoute);

  protected member$?: Observable<Member>;

  ngOnInit(): void {
    this.member$ = this.loadMember();
  }

  loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    return this.membersService.getMember(id);
  }
}
