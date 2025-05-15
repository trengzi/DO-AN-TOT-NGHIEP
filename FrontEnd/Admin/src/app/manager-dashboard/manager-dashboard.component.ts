import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { FormatVndPipe } from '../dashboard/dashboard.component';
import { CarouselModule } from 'primeng/carousel';
import { MessageService } from 'primeng/api';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-manager-dashboard',
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
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent {

  thisYear = new Date().getFullYear();
  selectedYear = this.thisYear;
  list3year = [ this.thisYear, this.thisYear - 1, this.thisYear - 2]

  doanhThuNgay: any;
  doanhThuTuan: any;


  listSanPhamTuan: any;
  listSanPhamSapHetHang: any;

  listSanPhamThang: any;
  listSanPhamItLuotMua: any;


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

  botEmployeeDonHangTrongThang: any;
  botEmployeesTrongThang: any;

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

  basicOptions2 = {
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
                color: 'rgba(255,255,255,0.2)'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
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


    this._dashboardService.getDoanhThuTrongNgayManager().subscribe(data => {
      this.doanhThuNgay = data;
    })
    this._dashboardService.getDoanhThuTrongTuanManager().subscribe(data => {
      this.doanhThuTuan = data;
    })
    this._dashboardService.getSoLuongDonHangTheoThangManager().subscribe(data => {
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

    this.changeYear();
    this.getTopEmployeesAndUsers();
    this.getListSanPhamSapHetHang();
    this.getThongKeManagerExtend();
    this.getListSanPhamThang();
    this.getListSanPhamItLuotMua();
  }
  changeYear(){
    this._dashboardService.getThongKeTheoNamManager(this.selectedYear).subscribe(data => {
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
    this._dashboardService.getThongKeManagerExtendManager().subscribe(data => {
      this.thongKeCards = data;
    })
  }

  getTopEmployeesAndUsers(){
    this._dashboardService.getTopEmployeesAndUsersManager().subscribe(data => {
      this.topEmployeesTrongThang = data.topEmployeesTrongThang;
      this.botEmployeeDonHangTrongThang = data.botEmployeeDonHangTrongThang;
      this.botEmployeesTrongThang = data.botEmployeesTrongThang;
      this.topEmployeesTrongNam = data.topEmployeesTrongNam;
      this.topEmployeeDonHangTrongThang = data.topEmployeeDonHangTrongThang;
      this.topEmployeeDonHangTrongNam = data.topEmployeeDonHangTrongNam;
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
