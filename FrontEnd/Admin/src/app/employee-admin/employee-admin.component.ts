import { HttpClientModule } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { EmployeeService } from '../../services/employee.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ManagerService } from '../../services/manager.service';
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
  selector: 'app-employee-admin',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    FormsModule,
    HttpClientModule,
    FormatVndPipe,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    CommonModule,
    CalendarModule,
    PaginatorModule
  ],
  providers:[
    MessageService,
    EmployeeService,
    ManagerService,
    ConfirmationService
  ],
  templateUrl: './employee-admin.component.html',
  styleUrl: './employee-admin.component.css'
})
export class EmployeeAdminComponent {
  showForm = false;
  showUpdate = false;
  listEmployee: any;
  listManager: any;

  body2 = {
    fullName: '',
    address: '',
    phone: '',
    email: '',
    hiredDate: new Date(),
    salary: 0,
    managerId: ''
  }
  curEmployeeId: any;

  constructor(
    private _employeeService: EmployeeService,
    private _messageService: MessageService,
    private _managerService: ManagerService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll();
  }

  getAll(){
    this._employeeService.getAllEmployee().subscribe(data => {
      this.listEmployee = data;
    });
    this._managerService.getAllManager().subscribe(data => {
      this.listManager = data;
    })
  }

  resetBody(){
    this.body2 = {
      fullName: '',
      address: '',
      phone: '',
      email: '',
      hiredDate: new Date(),
      salary: 0,
      managerId: '',
    };
  }

  showThemMoi(){
    this.resetBody();
    this.showForm = true;
    this.showUpdate = false;
  }

  showSua(employeeId: any){
    this.showForm = true;
    this.showUpdate = true;
    this.curEmployeeId = employeeId;
    this._employeeService.getEmployeeById(employeeId).subscribe(data => {
      this.body2 = data;
      this.body2.hiredDate = new Date(data.hiredDate);
    })
  }


  addBook(){
    for (const key in this.body2) {
      const typedKey = key as keyof typeof this.body2;
      // alert(typedKey + "      /        " + this.body[typedKey])
      if (this.body2[typedKey] === null || this.body2[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }
    this.body2.hiredDate.setHours(this.body2.hiredDate.getHours()+7);

    this._employeeService.postEmployee(this.body2).subscribe(data => {
      if(data.status == 'success')
      {
        this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Thêm nhân viên thành công', life: 3000});
        this.showForm = false;
        this.getAll();
      }
    })

  }

  deleteBook(employeeId: any){
    this.confirmationService.confirm({
      message: 'Xác nhận xóa bản ghi này?',
      accept: async () => {
        this._employeeService.deleteEmployee(employeeId).subscribe(data => {
          if(data.status == 'success')
          {
              this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Xóa nhân viên thành công', life: 3000});
              this.getAll();
          }
          if(data.status == 'exist')
          {
              this._messageService.add({severity:'info', summary: 'Thông báo', detail: 'Danh mục đang có sách, vui lòng kiểm tra lại', life: 3000});
          }
        })
      }
    });

  }

  updateBook(){
    for (const key in this.body2) {
      const typedKey = key as keyof typeof this.body2;
      // alert(typedKey + "      /        " + this.body2[typedKey])
      if (this.body2[typedKey] === null || this.body2[typedKey] === '') {
        this._messageService.add({severity:'error', summary: 'Thông báo', detail: 'vui lòng điền đầy đủ thông tin', life: 3000});
        return;
      }
    }
    this.body2.hiredDate.setHours(this.body2.hiredDate.getHours()+7);
    this._employeeService.putEmployee(this.curEmployeeId, this.body2).subscribe(data => {
      if(data.status == 'success')
      {
          this._messageService.add({severity:'success', summary: 'Thông báo', detail: 'Sửa thông tin nhân viên thành công', life: 3000});
          this.showForm = false;
          this.getAll();
      }

    })
  }
}
