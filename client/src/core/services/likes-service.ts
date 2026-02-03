import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../../Types/member';
import { PaginatedResult } from '../../Types/pagination';

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

  getLikes(predicate: string, pageNumber: number = 1, pageSize: number = 10) {
    let params = new HttpParams();
    params = params.append('predicate', predicate);
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'likes', { params: params });
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
