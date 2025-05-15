import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { CarouselModule } from 'primeng/carousel';
import { DashboardService } from '../../services/dashboard.service';

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
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DropdownModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ChartModule,
    FormatVndPipe,
    CarouselModule
  ],
  providers:[
    MessageService,
    DashboardService
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  thisYear = new Date().getFullYear();
  selectedYear = this.thisYear;
  list3year = [ this.thisYear, this.thisYear - 1, this.thisYear - 2]

  doanhThuNgay: any;
  doanhThuTuan: any;

  sumUser: any;
  sumUserLock: any;
  sumUserMonth: any;


  listSanPhamTuan: any;
  listSanPhamThang: any;
  listSanPhamItLuotMua: any;
  listSanPhamSapHetHang: any;


  botEmployeeDonHangTrongThang: any;
  botEmployeesTrongThang: any;




  thongKeCards = {
    doanhThuNamTruoc: 0,
    doanhThuNamHienTai: 0,
    tangTruongTheoThang: 0,
    tiLeHoanThanhDonHang: 0,
    tiLeHoanThanhDonHangTrongThang: 0,
    soDonHangXuLyTrongThang: 0,
    soDonHangXuLyTrongNam: 0,
    thoiGianXuLyDonHangTrungBinhTrongThang: 0,
    tiLeHuyDonTrongThang: 0,
  }

  topEmployeesTrongThang: any;
  topEmployeesTrongNam: any;
  topEmployeeDonHangTrongThang: any;
  topEmployeeDonHangTrongNam: any;
  topKhachTrungThanh: any;
  topKhachMuaNhieuTrongThang: any;
  topManager: any;
  topManagerMonth: any;

  basicData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
          label: 'Doanh thu',
          data: [],
          fill: false,
          borderColor: '#42A5F5',
          tension: .4
      },
    ]
  };
  basicData2 = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
        {
            label: 'Đơn hàng',
            backgroundColor: '#42A5F5',
            data: []
        },
        {
            label: 'Đơn hàng đã hủy',
            backgroundColor: 'red',
            data: []
        }
    ]
};

  basicOptions = {
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        }
    }
  };

  constructor(
    private _dashboardService: DashboardService
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this._dashboardService.getThongKeQuanLy().subscribe(data => {
      this.topManager = data.topManager;
      this.topManagerMonth = data.topManagerMonth;
    })
    this._dashboardService.getDoanhThuTrongNgay().subscribe(data => {
      this.doanhThuNgay = data;
    })
    this._dashboardService.getDoanhThuTrongTuan().subscribe(data => {
      this.doanhThuTuan = data;
    })
    this._dashboardService.getSoLuongDonHangTheoThang().subscribe(data => {
      const updatedData = data.map((x: any) => x.totalOrders);
      const updatedData2 = data.map((x: any) => x.canceledOrders);

      this.basicData2 = {
        ...this.basicData,
        datasets: [{
          ...this.basicData2.datasets[0],
          data: updatedData
        },
        {
          ...this.basicData2.datasets[1],
          data: updatedData2
        }]
      };
    })

    this._dashboardService.getThongKeNguoiDung().subscribe(data => {
      this.sumUser = data.totalUsers;
      this.sumUserMonth = data.newUsersThisMonth;
      this.sumUserLock = data.lockUser
    })
    this.changeYear();
    this.getTopEmployeesAndUsers();
    this.getListSanPhamSapHetHang();
    this.getThongKeManagerExtend();
    this.getListSanPhamThang();
    this.getListSanPhamTuan();
    this.getListSanPhamItLuotMua();
  }
  changeYear(){
    this._dashboardService.getThongKeTheoNam(this.selectedYear).subscribe(data => {
      const updatedData = data.map((x: any) => x.revenue || 0);
    this.basicData = {
      ...this.basicData,
      datasets: [{
        ...this.basicData.datasets[0],
        data: updatedData
      }]
    };
    })
  }


  getListSanPhamTuan(){
    interface SanPham {
      imageUrls: string;
    }
    if(!this.listSanPhamTuan)
    {
      this._dashboardService.getlistSanPhamTuan().subscribe(data => {
        this.listSanPhamTuan = data;
        this.listSanPhamTuan.forEach((sanPham: SanPham) => {
          if (sanPham.imageUrls) {
            sanPham.imageUrls = sanPham.imageUrls.split(',')[0];
          } else {
            sanPham.imageUrls = '';
          }
        });
      })
    }

  }

  getListSanPhamThang(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    if(!this.listSanPhamThang)
    {
      this._dashboardService.getlistSanPhamThang().subscribe(data => {
        this.listSanPhamThang = data;
        this.listSanPhamThang.forEach((sanPham: SanPham) => {
          if (sanPham.imageUrls) {
            sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
          } else {
            sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
          }
        });
      })
    }

  }

  getListSanPhamItLuotMua(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    if(!this.listSanPhamItLuotMua)
    {
      this._dashboardService.getlistSanPhamItLuotMua().subscribe(data => {
        this.listSanPhamItLuotMua = data;
        this.listSanPhamItLuotMua.forEach((sanPham: SanPham) => {
          if (sanPham.imageUrls) {
            sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
          } else {
            sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
          }
        });
      })
    }
  }

  getThongKeManagerExtend(){
    this._dashboardService.getThongKeManagerExtend().subscribe(data => {
      this.thongKeCards = data;
    })
  }

  getTopEmployeesAndUsers(){
    this._dashboardService.getTopEmployeesAndUsers().subscribe(data => {
      this.topEmployeesTrongThang = data.topEmployeesTrongThang;
      this.topEmployeesTrongNam = data.topEmployeesTrongNam;
      this.botEmployeeDonHangTrongThang = data.botEmployeeDonHangTrongThang;
      this.botEmployeesTrongThang = data.botEmployeesTrongThang;
      this.topEmployeeDonHangTrongThang = data.topEmployeeDonHangTrongThang;
      this.topEmployeeDonHangTrongNam = data.topEmployeeDonHangTrongNam;
      this.topKhachTrungThanh = data.topKhachTrungThanh,
      this.topKhachMuaNhieuTrongThang = data.topKhachMuaNhieuTrongThang
    })
  }

  getListSanPhamSapHetHang(){
    interface SanPham {
      imageUrls: string;
      // Các trường dữ liệu khác của sản phẩm
    }
    if(!this.listSanPhamSapHetHang)
    {
      this._dashboardService.listSanPhamSapHetHang().subscribe(data => {
        this.listSanPhamSapHetHang = data;
        this.listSanPhamSapHetHang.forEach((sanPham: SanPham) => {
          if (sanPham.imageUrls) {
            sanPham.imageUrls = sanPham.imageUrls.split(',')[0]; // Giữ lại URL đầu tiên trong chuỗi
          } else {
            sanPham.imageUrls = ''; // Nếu không có giá trị imageUrls, gán là chuỗi rỗng
          }
        });
      })
    }

  }
}
