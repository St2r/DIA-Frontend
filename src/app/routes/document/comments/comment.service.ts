import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import { DocComment } from './doccomment'

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpClient,
  ) { }

  public getComments(docid: string): Observable<{ comments: DocComment[] }> {
    const params = new HttpParams().set('docid', docid);
    return this.http.get<any>(environment.baseUrl + 'comment/get/', { params });
  }

  public createComment(docid: string, content: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('docid', docid);
    form.set('content', content);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'comment/new/', form);
  }

  public replyToComment(commentid: string, content: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('commentid', commentid);
    form.set('content', content);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'comment/replyto/', form);
  }

  public modifyComment(commentid: string, content: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('commentid', commentid);
    form.set('content', content);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'comment/modify/', form);
  }

  public deleteComment(commentid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('commentid', commentid);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'comment/delete/', form);
  }

  public starCommnet(commentid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('commentid', commentid);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'comment/star/', form);
  }

  public getBasicInfo(uid: string): Observable<{ msg: string, uname: string, avatar: string }> {
    const form = new FormData();
    form.set('uid', uid);
    return this.http.post<{
      msg: string, uname: string, avatar: string
    }>(environment.baseUrl + 'userinfo/basic/', form);
  }
}
