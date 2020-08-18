import { Component, OnInit, Input } from '@angular/core';
import { addDays, formatDistance } from 'date-fns';
import { CommentService } from './comment.service'
import { NzMessageService } from 'ng-zorro-antd/message';
import { DocComment } from './doccomment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() docid: string;

  // 评论区drawer的变量和函数
  visible = false;

  submitting = false;
  user = {
    author: '',
    avatar: ''
  };
  inputValue = '';

  // 评论区数据
  data: DocComment[] = [
    new class implements DocComment{
      commentid = '001';
      creatorname = 'Han Solo';
      creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
      content =
        'We supply a series of design principles, practical patterns and high quality design resources \
        (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
      createtime = formatDistance(new Date(), addDays(new Date(), 1));
      children = [
        new class implements DocComment{
          commentid = '001';
          creatorname = 'Han Solo';
          creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
          content =
            'We supply a series of design principles, practical patterns and high quality design resources \
            (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
          createtime = formatDistance(new Date(), addDays(new Date(), 1));
          children = [];
        },
        new class implements DocComment{
          commentid = '001';
          creatorname = 'Han Solo';
          creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
          content =
            'We supply a series of design principles, practical patterns and high quality design resources \
            (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
          createtime = formatDistance(new Date(), addDays(new Date(), 1));
          children = [];
        },
      ];
    },
    new class implements DocComment{
      commentid = '001';
      creatorname = 'Han Solo';
      creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
      content =
        'We supply a series of design principles, practical patterns and high quality design resources \
        (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
      createtime = formatDistance(new Date(), addDays(new Date(), 1));
      children = [];
    },
  ];

  constructor(
    private commentService: CommentService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.commentService.getComments(this.docid).subscribe(
      res => {
        console.log(res);
        res.comments.forEach(comment => this.data.push(comment));
      },
      error => {
        console.log('加载评论失败');
      }
    );
    this.commentService.getBasicInfo('').subscribe(
      res => {
        this.user.author = res.uname;
        this.user.author = res.avatar;
      }
    );
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleSubmit(): void {
    this.submitting = true;
    const content = this.inputValue;
    this.commentService.createComment(this.docid, content).subscribe(
      res => {
        if (res.msg === 'true') {
          this.inputValue = '';
          this.submitting = false;
          this.message.create('success', '提交成功');
        }
        else {
          console.log(res);
          this.submitting = false;
          this.message.create('error', '提交失败，请稍后再试');
        }
      },
      error => {
        this.submitting = false;
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
      }
    );
  }
}
