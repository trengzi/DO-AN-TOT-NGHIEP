import { HttpClientModule } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { BookService } from '../../service/book.service';
import { CommonModule } from '@angular/common';

@Pipe({ standalone: true, name: 'formatVnd' })
export class FormatVndPipe implements PipeTransform {
  transform(value: any): string {
    const soTien: number = parseFloat(value);

    // Kiểm tra nếu giá trị là NaN hoặc không phải số
    if (isNaN(soTien)) {
      // Trả về giá trị không thay đổi nếu không phải số
      return value;
    }

    // Định dạng số tiền trong đơn vị VND
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
  }
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    PaginatorModule,
    FormsModule,
    FormatVndPipe,
    HttpClientModule,
    RouterOutlet,
    RouterModule,
    CommonModule,
  ],
  providers: [
    BookService
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  keyword: any;
  listBook: any;
  page = 0;
  curTotalRecord: any;
  constructor(
    private route: ActivatedRoute,
    private _bookService: BookService
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.params.subscribe(params => {
      this.keyword = localStorage.getItem('keyword');
      this.page = 0;
      this.getBookByFilter();
    });
  }

  onPageChange(event: any)
  {
    this.page = event.page;
    this.getBookByFilter();
  }

  getBookByFilter(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    this._bookService.getBookSearch(this.keyword, this.page).subscribe(data =>{
      this.listBook = data.books;
      this.curTotalRecord = data.totalRecords;
      this.listBook.forEach((sanPham: SanPham) => {
        if (sanPham.imageUrls) {
          sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
        } else {
          sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
        }
      });
    });
  }
}
