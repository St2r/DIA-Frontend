import {NgModule} from '@angular/core';
import {RoutesRoutingModule} from './routes-routing.module';
import {LoginComponent} from './passport/login/login.component';
import {RegisterComponent} from './passport/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DocumentComponent } from './document/document.component';
import { SpaceComponent } from './space/space.component';
import { TrashComponent } from './trash/trash.component';
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {NgZorroAntdModule, NzFormModule} from 'ng-zorro-antd';
import { DesktopComponent } from './desktop/desktop.component';
import { FolderComponent } from './folder/folder.component';
import {SharedModule} from '../shared/shared.module';
import { FindbackComponent } from './passport/findback/findback.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { CommonModule } from '@angular/common';
import {OwnComponent} from './dashboard/own/own.component';
import {UsedComponent} from './dashboard/used/used.component';
import {FavoritesComponent} from './dashboard/favorites/favorites.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserspaceComponent } from './userspace/userspace.component';
import { MessageboxComponent } from './messagebox/messagebox.component';
import { CommentsComponent } from './document/comments/comments.component';
import {PowerBoardComponent} from './document/power-board/power-board.component';
import { NewteamComponent } from './teamspace/newteam/newteam.component';
import { FolderLoadingComponent } from './folder/folder-loading/folder-loading.component';
import { FolderRouteComponent } from './folder-route/folder-route.component';


const Components = [
  LoginComponent,
  RegisterComponent,
  DocumentComponent,
  SpaceComponent,
  TrashComponent,
  DesktopComponent,
  FolderComponent,
  OwnComponent,
  UsedComponent,
  FavoritesComponent,
  FindbackComponent,
  FeedbackComponent,
  UserspaceComponent,
  MessageboxComponent,
  CommentsComponent,
  PowerBoardComponent,
];

@NgModule({
    declarations: [...Components, NewteamComponent, FolderLoadingComponent, FolderRouteComponent],
    imports: [
        RoutesRoutingModule,
        FormsModule,
        EditorModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        SharedModule,
        NzAlertModule,
        CommonModule
    ],
    exports: [
        FolderComponent
    ],
    providers: [
        {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
    ]
})
export class RoutesModule {
}
