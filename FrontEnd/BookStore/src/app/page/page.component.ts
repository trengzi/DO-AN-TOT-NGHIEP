import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../../service/page.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    HttpClientModule
  ],
  providers: [
    PageService
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  pageHtml: any;
  title: any;

  constructor(
    private sanitizer : DomSanitizer,
    private route : ActivatedRoute,
    private _pageService: PageService
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== null && id !== "")
      {
        this._pageService.getPage(id).subscribe(data => {
          this.title = data.title;
          this.pageHtml = this.sanitizer.bypassSecurityTrustHtml(data.content);
        })
      }})
  };

}
