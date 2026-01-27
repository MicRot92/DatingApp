import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { single } from 'rxjs';
import { EditableMember, Member } from '../../../Types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window: beforeunload', ['$event']) notifiy($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined)
  protected memberService = inject(MemberService);
  private toastService = inject(ToastService);
  protected editableMember: EditableMember =
    {
      displayName: '',
      description: '',
      city: '',
      country: '',
    }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(
      data => { this.member.set(data['memberResolver']); }
    )

    this.editableMember = {
      displayName: this.member()?.displayName || '',
      description: this.member()?.description || '',
      country: this.member()?.country || '',
      city: this.member()?.city || '',
    }

    console.log('user info', this.member());
  }

  ngOnDestroy(): void {
    this.memberService.editMode.set(false);
  }

  updateProfile() {
    if (!this.member()) return;
    const updatedMember = { ...this.member(), ...this.editableMember }
    this.memberService.updateMember(this.editableMember).subscribe(
      {
        next: () => {
          this.toastService.success('Profile updated successfully');
          this.memberService.editMode.set(false);
          this.editForm?.reset(updatedMember);
        }
      }
    )

    console.log('updated member', updatedMember)
    this.toastService.success('user updated');
    this.memberService.editMode.set(false);
  }
}
