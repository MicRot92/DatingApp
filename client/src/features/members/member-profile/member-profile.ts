import { Component, inject, signal } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { single } from 'rxjs';
import { Member } from '../../../Types/member';

@Component({
  selector: 'app-member-profile',
  imports: [],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile {
  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined)

  ngOnInit(): void {
    this.route.parent?.data.subscribe(
      data => { this.member.set(data['memberResolver']); }
    )
    console.log('user info', this.member());

  }
}
