import { HttpClientModule } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { CategoryService } from '../../service/category.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {SliderModule} from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../service/book.service';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import {InputTextModule} from 'primeng/inputtext';

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
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    HttpClientModule,
    PaginatorModule,
    SliderModule,
    FormsModule,
    FormatVndPipe,
    ButtonModule,
    DropdownModule,
    InputTextModule
  ],
  providers: [
    CategoryService,
    BookService
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  priceRange: number[] = [10000, 100000];
  priceRangeCopy: number[] = [10000, 100000];
  isPriceRange = false;
  curCategory = "Tất cả sản phẩm";
  listCategory: any;
  curIdCategory = '00000000-0000-0000-0000-000000000000';
  page = 0;
  curTotalRecord: any;
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  listCurBook: any;
  keyword = '';


  listOrder = [
    {name: 'Mặc định', value: 0},
    {name: 'Giá tăng dần', value: 1},
    {name: 'Giá giảm dần', value: 2},
    {name: 'Theo tên', value: 3},
  ];
  selectedOrder = this.listOrder[0].value;
  constructor(
    private _categoryService: CategoryService,
    private _bookService: BookService
  ){}

  ngOnInit(): void {
    this._categoryService.getAllCategory().subscribe(data =>{
      this.listCategory = data;
    })
    this.getBookByFilter();
  }

  changeList(name: any, id: any){
    this.curCategory = name;
    this.curIdCategory = id;
    this.page = 0;
    this.getBookByFilter();
  }

  getBookByFilter(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    this._bookService.getBookByFilter(this.keyword, this.curIdCategory, this.isPriceRange ? this.priceRangeCopy[0] : 0, this.isPriceRange ? this.priceRangeCopy[1] : 0, this.selectedOrder, this.page).subscribe(data =>{
      this.listCurBook = data.books;
      this.curTotalRecord = data.totalRecords;
      this.listCurBook.forEach((sanPham: SanPham) => {
        if (sanPham.imageUrls) {
          sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
        } else {
          sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
        }
      });
    });
  }

  setFilter(){
    this.priceRangeCopy[0] = this.priceRange[0];
    this.priceRangeCopy[1] = this.priceRange[1];
    this.isPriceRange = true;
    this.page = 0;
    this.getBookByFilter();
  }

  clearRange(){
    this.isPriceRange = false;
    this.getBookByFilter();
    this.page = 0;
  }

  onPageChange(event: any)
  {
    this.page = event.page;
    this.getBookByFilter();
  }
}
