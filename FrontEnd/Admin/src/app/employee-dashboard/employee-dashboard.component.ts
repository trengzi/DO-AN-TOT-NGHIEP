import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { TrangThaiDonHang } from '../Enums/Enums';

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
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    ChartModule,
    RouterModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    DropdownModule,
    FormatVndPipe
  ],
  providers:[
    DashboardService
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {

  doanhThuCaNhan = 0;
  doanhThuCaNhanThang = 0;
  soLuongDonHangSolved = 0;
  soLuongDonHang = 0;
  hieuSuat = 0;
  thisYear = new Date().getFullYear();
  selectedYear = this.thisYear;
  selectedYear2 = this.thisYear;
  list3year = [ this.thisYear, this.thisYear - 1, this.thisYear - 2]

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
          label: 'Hiệu suất xử lý đơn hàng',
          data: [],
          fill: false,
          borderColor: '#42A5F5',
          tension: .4
      },
    ]
  };

  dataPie = {
    labels: [TrangThaiDonHang.DaHuy, TrangThaiDonHang.ChoXacNhan, TrangThaiDonHang.DangChuanBiHang, TrangThaiDonHang.DangGiaoHang, TrangThaiDonHang.GiaoHangThanhCong],
    datasets: [
        {
            data: [],
            backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#AB47BC",
                "#FF7043"
            ],
            hoverBackgroundColor: [
                "#64B5F6",
                "#81C784",
                "#FFB74D",
                "#AB47BC",
                "#FF7043"
            ]
        }
    ]
  }
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
    this.getAll();
    this.changeYear();
    this.changeYear2();
  }

  getAll(){
    this._dashboardService.getDoanhThuByEmployeeId(AuthService.employeeId).subscribe(data => {
      this.doanhThuCaNhan = data.allTimeRevenue;
      this.doanhThuCaNhanThang = data.thisMonthRevenue;
      this.soLuongDonHang = data.numOrderNotSolve;
      this.soLuongDonHangSolved = data.numOrder;
    })
    this._dashboardService.getStatusDonHangNumber(AuthService.employeeId).subscribe(data => {
      const updatedData = data.map((x: any) => x.count || 0);
      this.dataPie = {
        ...this.dataPie,
        datasets: [{
          ...this.dataPie.datasets[0],
          data: updatedData
        }]
      };
    })

    this._dashboardService.getHieuSuatXuLyDonHang(AuthService.employeeId).subscribe(data => {

      this.hieuSuat = data.performance;
      const updatedData = data.map((x: any) => x.revenue || 0);
      this.basicData2 = {
        ...this.basicData2,
        datasets: [{
          ...this.basicData.datasets[0],
          data: updatedData
        }]
      };
    })
  }

  changeYear(){
    this._dashboardService.getThongKeTheoNamEmployee(AuthService.employeeId,this.selectedYear).subscribe(data => {
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

  changeYear2(){
    this._dashboardService.getHieuSuatTheoNamEmployee(AuthService.employeeId,this.selectedYear2).subscribe(data => {
      const updatedData = data.map((x: any) => x.efficiency || 0);
    this.basicData2 = {
      ...this.basicData2,
      datasets: [{
        ...this.basicData2.datasets[0],
        data: updatedData
      }]
    };
    })
  }
}
