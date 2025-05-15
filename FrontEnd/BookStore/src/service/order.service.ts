import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  url = 'https://localhost:7111/api/orders';
  urlOrderDetails = 'https://localhost:7111/api/orderDetails';
  urlReviews = 'https://localhost:7111/api/reviews';
  urlNganHang = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLj3jqlnGwFownYUHqeBHe5nZiasHXoP0fR-AMUKF7kLel8pyUeRr2P78GmQ0Pal7TSfSfXPZqeSMzGm7JWr4_K59SHPyKt_tO-9UVKXclsaedgHnR39buH71CwL6PVDL_CZePaU7Y6dIF4kDpJ3FduvkuLmG-2CIGxOyada2_-zU5ttohjGIveTgAvZN_-r56YhAMPcMxHJPqckhwBfIOEz1bgfbY6SawNPG5rQyhViCNtmbwbUPXNfroZ9rI_yEoR1qZkkzfZ_VTFevU9xNiaxluyJtA&lib=M_bZm-UDtcclU4JIU-aM93phCl2Gi7N5n';
  constructor(
    private http: HttpClient,
  ) { }

  postOrder(body: any): Observable<any>{
    return this.http.post(`${this.url}`, body, this.httpOptions);
  }

  postOrderDetail(body: any): Observable<any>{
    return this.http.post(`${this.urlOrderDetails}`, body, this.httpOptions);
  }

  getListDonHang(idAccount: any):  Observable<any>
  {
    return this.http.get(`${this.url}/getlistdonhangbyaccountid/${idAccount}`, this.httpOptions);
  }

  getDonHangById(idDonHang: any):  Observable<any>
  {
    return this.http.get(`${this.url}/${idDonHang}`, this.httpOptions);
  }

  getListSanPhamByIDDonHang(idDonHang: any, userId: any):  Observable<any>
  {
    return this.http.get(`${this.urlOrderDetails}/getlistsanphambyiddonhang/${idDonHang}/${userId}`, this.httpOptions);
  }

  huyDonHangById(idDonHang: any, don: any): Promise<any>
  {
    return this.http.put(`${this.url}/huyDonHang/${idDonHang}`, don, this.httpOptions).toPromise();
  }

  suaSanPhamTrongDonHang(idSanPham: any, idDonHang: any, kichCo: any, mau: any): Promise<any>
  {
    return this.http.put(`${this.urlOrderDetails}/suasanphamdonhang/${idSanPham}/${idDonHang}/${kichCo}/${mau}`,this.httpOptions).toPromise();
  }

  getDanhGiaVeSanPhamByAccount(sanPhamId: any, accountId: any,orderId: number): Observable<any>
  {
    return this.http.get(`${this.urlReviews}/getdanhgiavesanphambyaccount/${sanPhamId}/${accountId}/${orderId}`, this.httpOptions);
  }

  postDanhGia(body: any): Observable<any>
  {
    return this.http.post(this.urlReviews, body, this.httpOptions);
  }

  getReviewByBookId(bookId: any):Observable<any>
  {
    return this.http.get(`${this.urlReviews}/getReviewByBookId/${bookId}`, this.httpOptions);
  }
  // postAnh(body: any): Observable<any>
  // {
  //   return this.http.post(this.urlAnhDanhGia, body, this.httpOptions);
  // }


  getThanhToan(): Observable<any>{
    return this.http.get(this.urlNganHang);
  }

}


