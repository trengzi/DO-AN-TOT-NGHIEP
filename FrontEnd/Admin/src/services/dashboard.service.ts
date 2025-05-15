import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/dashboards';
  constructor(
    private http: HttpClient,
  ) { }

  getThongKeTheoNam(year: any): Observable<any>{
    return this.http.get(`${this.url}/thongKeTheoNam/${year}`, this.httpOptions);
  }

  getDoanhThuTrongNgay(): Observable<any>{
    return this.http.get(`${this.url}/getDoanhThuTrongNgay`, this.httpOptions);
  }

  getThongKeQuanLy(): Observable<any>{
    return this.http.get(`${this.url}/getThongKeQuanLy`, this.httpOptions);
  }


  getDoanhThuTrongTuan(): Observable<any>{
    return this.http.get(`${this.url}/getDoanhThuTrongTuan`, this.httpOptions);
  }

  getSoLuongDonHangTheoThang(): Observable<any>{
    return this.http.get(`${this.url}/getSoLuongDonHangTheoThang`, this.httpOptions);
  }

  getThongKeNguoiDung(): Observable<any>{
    return this.http.get(`${this.url}/getThongKeNguoiDung`, this.httpOptions);
  }

  getlistSanPhamTuan(): Observable<any>{
    return this.http.get(`${this.url}/getlistSanPhamTuan`, this.httpOptions);
  }

  getlistSanPhamThang(): Observable<any>{
    return this.http.get(`${this.url}/getlistSanPhamThang`, this.httpOptions);
  }

  getlistSanPhamItLuotMua(): Observable<any>{
    return this.http.get(`${this.url}/getlistSanPhamItLuotMua`, this.httpOptions);
  }



  getDoanhThuByEmployeeId(EmployeeId: any): Observable<any>{
    return this.http.get(`${this.url}/getDoanhThuByEmployeeId/${EmployeeId}`, this.httpOptions);
  }

  getThongKeTheoNamEmployee(employeeId: any, year: any): Observable<any>{
    return this.http.get(`${this.url}/thongKeTheoNamEmployee/${employeeId}/${year}`, this.httpOptions);
  }

  getStatusDonHangNumber(employeeId: any): Observable<any>{
    return this.http.get(`${this.url}/getStatusDonHangNumber/${employeeId}`, this.httpOptions);
  }

  getHieuSuatXuLyDonHang(employeeId: any): Observable<any>{
    return this.http.get(`${this.url}/getHieuSuatXuLyDonHang/${employeeId}`, this.httpOptions);
  }

  getHieuSuatTheoNamEmployee(employeeId: any, year: any): Observable<any>{
    return this.http.get(`${this.url}/hieuSuatTheoNamEmployee/${employeeId}/${year}`, this.httpOptions);
  }



  getThongKeManagerExtend(): Observable<any>{
    return this.http.get(`${this.url}/getThongKeManagerExtend`, this.httpOptions);
  }

  getTopEmployeesAndUsers(): Observable<any>{
    return this.http.get(`${this.url}/getTopEmployeesAndUsers`, this.httpOptions);
  }
  listSanPhamSapHetHang(): Observable<any>{
    return this.http.get(`${this.url}/getListSanPhamSapHetHang`, this.httpOptions);
  }







  getDoanhThuTrongNgayManager(): Observable<any>{
    return this.http.get(`${this.url}/getDoanhThuTrongNgayManager/${AuthService.employeeId}`, this.httpOptions);
  }

  getDoanhThuTrongTuanManager(): Observable<any>{
    return this.http.get(`${this.url}/getDoanhThuTrongTuanManager/${AuthService.employeeId}`, this.httpOptions);
  }

  getSoLuongDonHangTheoThangManager(): Observable<any>{
    return this.http.get(`${this.url}/getSoLuongDonHangTheoThangManager/${AuthService.employeeId}`, this.httpOptions);
  }

  getThongKeManagerExtendManager(): Observable<any>{
    return this.http.get(`${this.url}/getThongKeManagerExtendManager/${AuthService.employeeId}`, this.httpOptions);
  }
  getThongKeTheoNamManager(year: any): Observable<any>{
    return this.http.get(`${this.url}/thongKeTheoNamManager/${year}/${AuthService.employeeId}`, this.httpOptions);
  }
  getTopEmployeesAndUsersManager(): Observable<any>{
    return this.http.get(`${this.url}/getTopEmployeesAndUsersManager/${AuthService.employeeId}`, this.httpOptions);
  }
}
