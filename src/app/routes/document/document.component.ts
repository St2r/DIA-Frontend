import {Component, OnDestroy, OnInit, HostListener, NgZone} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DocService} from './doc.service';
import {ActivatedRoute, Params, Router, Routes} from '@angular/router';
import {Subject, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzCascaderOption} from 'ng-zorro-antd/cascader';
import {DialogService} from '../../core/services/dialog.service';
import { addDays, formatDistance } from 'date-fns';
import { DocItemService } from '../../shared/doc-item/doc-item.service';

declare const tinymce: any;
declare const window: any;

const belongOptions = [
  {
    value: 'personal',
    label: '个人',
    isLeaf: true
  },
  {
    value: 'team',
    label: '团队',
    children: [
      {
        value: '1',
        label: '团队1',
        isLeaf: true
      },
      {
        value: '2',
        label: '团队2',
        isLeaf: true
      },
      {
        value: '3',
        label: '团队3',
        isLeaf: true
      }
    ]
  }
];


@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {

  docId: string;
  public isTeamDoc = false;

  // 收藏切换按钮
  public switchLoading = false;
  public isFavored = false;

  nzBelongOptions: any[] | null = null;
  values: any[] | null = null;

  private timer;

  // 评论区drawer的变量和函数
  visible = false;

  // 分享
  sharingVisible = false;
  sharingFresh = false;

  sharingCancel(): void {
    this.sharingVisible = false;
  }

  sharingOk(): void {
    this.sharingVisible = false;
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  // 防抖 保存文本内容
  updateResult$ = new Observable<{ msg: string }>();
  private updateContent$ = new Subject<string>();

  public modified_mark: boolean = false;

  constructor(
    private docService: DocService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    public dialogService: DialogService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    window.MyEditor = {component: this};

    this.route.params.subscribe((params: Params) => {
      this.docId = params.id;
      console.log(this.docId);
    });

    this.initEditor();

    // 自动保存
    this.updateResult$ = this.updateContent$.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      switchMap( text => {
        this.modified_mark = false;
        return this.docService.modifyContent(this.docId, text);
      }),
    );
    this.updateResult$.subscribe(
      res => {
        if (res.msg === 'true') {
          console.log('自动保存成功');
        }
        else {
          console.log('自动保存失败');
        }
      },
      error => {
        console.log('自动保存时发生了奇怪的错误');
      }
    );
  }

  ngOnDestroy() {
    tinymce.remove();
    window.MyEditor = null;
  }

  initEditor() {
    // tinyMCE配置
    tinymce.init({
      base_url: '/tinymce/',
      suffix: '.min',
      selector: 'textarea#tiny',
      apiKey: 'pzsbp1xb6j13dd4aduwebi7815hzj1upr7v42ojpcbc8c7pu',

      height: 800,
      statusbar: false,
      toolbar_sticky: true,
      theme: 'silver',
      plugins: 'save tinycomments image',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author',
      toolbar1: 'image save | formatselect || bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      toolbar2: 'image',
      image_advtab: true,

      init_instance_callback(editor) {
        console.log('editor initialized');
        window.MyEditor.component.initData();
      },
      setup: function(editor) {
        editor.on('keyup', function(e) {
          console.log('KeyUp! But nothing happened...');
          window.MyEditor.component.autoSave();
        });
      }
    });
  }

  initData() {
    this.docService.getDocument(this.docId).subscribe(
      res => {
        console.log(res);
        this.isFavored = res.starred;
        this.switchLoading = false;
        tinymce.activeEditor.setContent(res.Content);
        this.isTeamDoc = res.isTeamDoc;
      }
    );
  }

  clickSave(): void {
    console.log(tinymce.activeEditor.getContent());
    this.docService.modifyContent(this.docId, tinymce.activeEditor.getContent()).subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.create('success', '保存成功');
        } else {
          this.message.create('error', '保存失败，请稍后重试');
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后重试');
      }
    );
  }

  clickBack(): void {
    // history.go(-1);
    this.router.navigate(['/dashboard/own']);
  }

  clickSwitch(): void {
    this.switchLoading = true;
    console.log('switch' + this.isFavored);
    if (this.isFavored) {
      console.log(this.isFavored);
      this.docService.favorDoc(this.docId).subscribe(
        res => {
          console.log(res);
          if (res.msg === 'true') {
            this.message.create('success', '成功加入收藏');
          }
          else {
            this.message.create('error', '操作失败，请稍后再试');
          }
          this.switchLoading = false;
        }
      );
    }
    else {
      this.docService.unFavorDoc(this.docId).subscribe(
        res => {
          console.log(res);
          if (res.msg === 'true') {
            this.message.create('success', '成功取消收藏');
          }
          else {
            this.message.create('error', '操作失败，请稍后再试');
          }
          this.switchLoading = false;
        }
      );
    }
  }

  onChanges(values: any): void {
    console.log(values, this.values);
  }

  autoSave() {
    this.modified_mark = true;
    this.updateContent$.next(tinymce.activeEditor.getContent());
  }
}

