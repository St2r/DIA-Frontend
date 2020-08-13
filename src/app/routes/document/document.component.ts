import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DocService} from './doc.service';
import {ActivatedRoute, Params, Routes} from '@angular/router';
import {Subject, Observable} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

declare const tinymce: any;

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  form: FormGroup;
  docId: string;

  // 防抖 保存文本内容
  withRefresh = false;
  updateResult = new Observable<{ msg: string }>();
  private updateContent = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private docService: DocService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
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
      toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      image_advtab: true,

      init_instance_callback(editor) {
        // 根据权限可以关闭文档的编辑权限
        tinymce.activeEditor.setMode('readonly');
        tinymce.activeEditor.setMode('design');
      }
    });
    // 初始化表单
    this.form = this.fb.group({
      Title: 'title',
      Content: '由模版新建文档'
    });
    this.route.params.subscribe((params: Params) => {
      this.docId = params.id;
    });

    // TODO 如何显示保存结果？
    // 防抖 保存文本内容
    this.updateResult = this.updateContent.pipe(
      debounceTime(5000),
      distinctUntilChanged(),
      switchMap(
        newcontent => this.docService.modifyContent(this.docId, newcontent)
      )
    );
  }

  testKeyUp(event: any): void {
    console.log(event);
    alert("111");
  }


  // saveContent(): void {
  //   this.docService.modifyContent(this.docId, )
  // }

  saveContent(): void {
    this.updateContent.next(this.form.value.Content);
  }

  showUpdateRes(): void {

  }

}
