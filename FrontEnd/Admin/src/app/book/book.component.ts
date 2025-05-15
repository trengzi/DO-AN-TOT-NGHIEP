import { Component, Pipe, PipeTransform } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {TableModule} from 'primeng/table';
import {RatingModule} from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { HttpClientModule } from '@angular/common/http';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageService } from '../../services/image.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SupplierService } from '../../services/supplier.service';
import { AuthorService } from '../../services/author.service';
import { PublisherService } from '../../services/publisher.service';
import { DropdownModule } from 'primeng/dropdown';
import { CategoryService } from '../../services/category.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';

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
  selector: 'app-book',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    RatingModule,
    FormsModule,
    HttpClientModule,
    FormatVndPipe,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FileUploadModule,
    CommonModule,
    ToastModule,
    InputTextareaModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    ConfirmDialogModule,
    PaginatorModule
  ],
  providers: [
    BookService,
    ImageService,
    MessageService,
    AuthorService,
    SupplierService,
    PublisherService,
    CategoryService,
    ConfirmationService
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {

  emptyGuid = '00000000-0000-0000-0000-000000000000';
  page = 0;
  listBook: any;
  curTotalRecord: any;
  listPublisher: any;
  listAuthor: any;
  listSupplier: any;
  listCategory: any;
  authorSelected: any;
  curBookId: any;

  files: File[] = []; // Lưu danh sách file
  uploadedUrls: string[] = [];
  body = {
    code: '',
    title: '',
    price: 0,
    priceDiscount: 0,
    quantity: 0,
    description: '',
    pageNumber: 0,
    coverType: '',
    weight: 0,
    publicationYear: new Date().getFullYear(),
    size: '',
    importPrice: 0,
    importDate: new Date(),
    imageUrls: '',
    publisherId: null,
    categoryId: null,
    supplierId: null,
  };

  showForm = false;
  showUpdate = false;
  constructor(
    private _bookService: BookService,
    private _imageService: ImageService,
    private _messageService: MessageService,
    private _supplierService: SupplierService,
    private _authorService: AuthorService,
    private _publisherService: PublisherService,
    private _categoryService: CategoryService,
    private confirmationService: ConfirmationService,
  ){
    this.getAll()
  }

  getAll(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    this._bookService.getBookByFilter('',this.emptyGuid, 0, 0, 0, this.page). subscribe(data => {
      this.listBook = data.books;
      this.curTotalRecord = data.totalRecords;
      this.listBook.forEach((sanPham: SanPham) => {
        if (sanPham.imageUrls) {
          sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
        } else {
          sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
        }
      });
    })
  }

  resetBody(){
    this.body = {
      code: '',
      title: '',
      price: 0,
      priceDiscount: 0,
      quantity: 0,
      description: '',
      pageNumber: 0,
      coverType: '',
      weight: 0,
      publicationYear: new Date().getFullYear(),
      size: '',
      importPrice: 0,
      importDate: new Date(),
      imageUrls: '',
      publisherId: null,
      categoryId: null,
      supplierId: null,
    };
    this.authorSelected = null;

    this.files = []; // Lưu danh sách file
    this.uploadedUrls = [];
  }

  showThemMoi(){
    this.resetBody()
    this._authorService.getAllAuthor().subscribe(data => {
      this.listAuthor = data;
    })
    this._supplierService.getAllSupplier().subscribe(data => {
      this.listSupplier = data;
    })
    this._publisherService.getAllPublisher().subscribe(data => {
      this.listPublisher = data;
    })
    this._categoryService.getAllCategory().subscribe(data => {
      this.listCategory = data;
    })
    this.showForm = true;
    this.showUpdate = false;
  }



  ganFile(event: any): void {
    console.log(event);
    this.files = event.currentFiles;
  }

  // Xóa file khỏi danh sách khi người dùng bỏ chọn
  xoaGanFile(event: any): void {

  }

  // Xóa toàn bộ file khi người dùng clear danh sách
  clearGanFile(): void {
    this.files = [];
  }

  // Xử lý upload
  myUploader(event: any): void {
    if (this.files.length === 0) {
      alert('Please select at least one file');
      return;
    }

    this._imageService.uploadImages(this.files).subscribe(
      (response) => {
        this.uploadedUrls = response.urls; // Gán URL ảnh trả về
        this.body.imageUrls = this.uploadedUrls.join(',');
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Upload ảnh thành công', life: 3000});
      },
      (error) => {
        console.error('Error uploading images:', error);
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'Có lỗi xảy ra, hãy thử lại sau', life: 3000});
      }
    );
  }

  addBook(){
    for (const key in this.body) {
      const typedKey = key as keyof typeof this.body;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body[typedKey] === null || this.body[typedKey] === '' || this.body[typedKey] === 0) {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }
    if(!this.uploadedUrls || this.uploadedUrls.length == 0)
    {
      this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng upload ảnh cho sản phẩm', life: 3000});
      return;
    }
    if(!this.authorSelected || this.authorSelected.length == 0)
    {
      this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng nhập tác giả cho sản phẩm', life: 3000});
      return;
    }

    this._bookService.postBook(this.body).subscribe(data => {
      const body2 = [];
      for(var at of this.authorSelected)
      {
        body2.push({
          bookId: data.id,
          authorId: at
        })

      }
      this._authorService.postBookAuthor(body2).subscribe(data2 => {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm sách thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      })
    })

  }

  deleteBook(bookId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._authorService.deleteBookAuthor(bookId).subscribe(data => {
          if(data.status == 'success')
          {
            this._bookService.deleteBook(bookId).subscribe(data2 => {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa sách thành công', life: 3000});
              this.getAll();
            })
          }
        })
      }
    });

  }

  onPageChange(event: any)
  {
    this.page = event.page;
    this.getAll();
  }

  showSua(bookId: any){
    this.curBookId = bookId;
    this._authorService.getAllAuthor().subscribe(data => {
      this.listAuthor = data;
    })
    this._supplierService.getAllSupplier().subscribe(data => {
      this.listSupplier = data;
    })
    this._publisherService.getAllPublisher().subscribe(data => {
      this.listPublisher = data;
    })
    this._categoryService.getAllCategory().subscribe(data => {
      this.listCategory = data;
    })
    this.showUpdate = true;
    this.showForm = true;
    this._bookService.getBookById(bookId).subscribe(data => {
      this.body = data;
      this.uploadedUrls = this.body.imageUrls.split(',');
      this.body.importDate = new Date(data.importDate)
    })
    this._authorService.getAuthorByBookId(bookId).subscribe(data => {
      this.authorSelected = data;
    })
  }

  updateBook(){
    for (const key in this.body) {
      const typedKey = key as keyof typeof this.body;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body[typedKey] === null || this.body[typedKey] === '' || this.body[typedKey] === 0) {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }
    if(!this.uploadedUrls || this.uploadedUrls.length == 0)
    {
      this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng upload ảnh cho sản phẩm', life: 3000});
      return;
    }
    if(!this.authorSelected || this.authorSelected.length == 0)
    {
      this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng nhập tác giả cho sản phẩm', life: 3000});
      return;
    }

    this._bookService.putBook(this.curBookId, this.body).subscribe(data => {
      if(data.status == 'success')
      {
        const body2 = [];
        for(var at of this.authorSelected)
        {
          body2.push(at)

        }
        this._authorService.putBookAuthor(this.curBookId, body2).subscribe(data2 => {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin sách thành công', life: 3000});
          this.showForm = false;
          this.getAll();
        })
      }

    })
  }
}
