import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PowerBoardService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getCollaborators(docid: string): Observable<{
    level1: { username: string, avatar: string, isTeamMember: boolean }[],
    level2: { username: string, avatar: string, isTeamMember: boolean }[],
    level3: { username: string, avatar: string, isTeamMember: boolean }[],
    level4: { username: string, avatar: string, isTeamMember: boolean, isCreator: boolean }[],
  }> {
    const params = new HttpParams().set('docid', docid);
    return this.http.get<any>(environment.baseUrl + 'doc/get-corporation', {params});
  }

  public getPower(docid: string): Observable<{ userPower: number, shareProperty: number }> {
    console.log('函数中docid' + docid);
    const params = new HttpParams().set('docid', docid);
    return this.http.get<{ userPower: number, shareProperty: number }>(environment.baseUrl + 'doc/get-power', {params});
  }

  public setShareOption(docid: string, shareOption: number): Observable<any> {
    const form = new FormData();
    form.set('docid', docid);
    form.set('shareOption', shareOption + '');
    console.log({docid, shareOption});
    return this.http.post(environment.baseUrl + 'doc/set-share-option/', form);
  }

  public setPower(docid: string, username: string, power: number): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('username', username);
    form.set('docid', docid);
    form.set('power', power + '');
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/set-power/', form);
  }

  public search(username: string): Observable<{ username: string, avatar: string, userid: string }> {
    const params = new HttpParams().set('username', username);
    return this.http.get<{ username: string, avatar: string, userid: string }>(environment.baseUrl + 'user/getlistbyname', {params});
  }
}
