import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { single } from 'rxjs';
import { EditableMember, Member } from '../../../Types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../Types/user';

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
  private accountService = inject(AccountService);
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

    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      country: this.memberService.member()?.country || '',
      city: this.memberService.member()?.city || '',
    }

    console.log('user info', this.memberService.member());
  }

  ngOnDestroy(): void {
    this.memberService.editMode.set(false);
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = { ...this.memberService.member(), ...this.editableMember }
    this.memberService.updateMember(this.editableMember).subscribe(
      {
        next: () => {
          const currentUser = this.accountService.currentUser();
          if (currentUser && updatedMember.displayName != currentUser?.displayName) {
            currentUser.displayName = updatedMember.displayName;
            console.log('new name ', currentUser.displayName)
            this.accountService.setCurrentUser(currentUser);
          }
          this.memberService.editMode.set(false);
          this.memberService.member.set(updatedMember as Member);
          this.editForm?.reset(updatedMember);
          console.log('updated member', updatedMember)
          this.toastService.success('Profile updated successfully');
        }
      }
    )

  }
}
