import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../Types/member';

@Injectable({
  providedIn: 'root',
})
export class LikesService {

  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  likeIds = signal<string[]>([]);

  toggleLike(targetMemberId: string) {
    return this.http.post(this.baseUrl + 'likes/' + targetMemberId, {});
  }

  getLikes(predicate: string) {
    return this.http.get<Member[]>(this.baseUrl + 'likes', { params: { predicate } });
  }

  getCurrentMemberLikeIds() {
    return this.http.get<string[]>(this.baseUrl + 'likes/list').subscribe(likeIds => {
      this.likeIds.set(likeIds);
    });
  }

  clearCurrentMemberLikeIds() {
    this.likeIds.set([]);
  }

}
