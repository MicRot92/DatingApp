import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/services/member-service';
import { Member } from '../../Types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  const membersService = inject(MemberService);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');


  if (!memberId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }
  console.log('inside resolver');
  var member = membersService.getMember(memberId);

  member.subscribe({
    next: memberRes => console.log('member from resolver ', memberRes),
  })
  return member;

};
