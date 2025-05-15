using BookStore.Context;
using BookStore.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services.Interface
{
    public interface IDashboardsService
    {
        public Task<IEnumerable<object>> ThongKeTheoNam(int year);

        public Task<double> GetDoanhThuTrongNgay();

        public Task<double> getDoanhThuTrongTuan();

        public Task<IEnumerable<object>> GetSoLuongDonHangTheoThang();

        public Task<object> GetThongKeNguoiDung();

        public Task<IEnumerable<object>> get3SanPhamTuan();

        public Task<IEnumerable<object>> getlistSanPhamThang();

        public Task<IEnumerable<object>> getlistSanPhamItLuotMua();

        public Task<object> getDoanhThuByEmployeeId(Guid employeeId);

        public Task<IEnumerable<object>> ThongKeTheoNamEmployee(Guid employeeId, int year);

        public Task<IEnumerable<object>> GetStatusDonHangNumber(Guid employeeId);

        public Task<object> GetHieuSuatXuLyDonHang(Guid employeeId);

        public Task<IEnumerable<object>> HieuSuatTheoNamEmployee(Guid employeeId, int year);

        public Task<object> GetThongKeManagerExtend();

        public Task<object> GetTopEmployeesAndUsers();

        public Task<IEnumerable<object>> GetListSanPhamSapHetHang();

        public Task<object> GetThongKeQuanLy();

        public Task<double> GetDoanhThuTrongNgayManager(Guid managerId);

        public Task<double> GetDoanhThuTrongTuanManager(Guid managerId);


        public Task<IEnumerable<object>> GetSoLuongDonHangTheoThangManager(Guid managerId);

        public Task<IEnumerable<object>> ThongKeTheoNamManager(int year, Guid managerId);

        public Task<object> GetTopEmployeesAndUsersManager(Guid managerId);

        public Task<object> GetThongKeManagerExtendManager(Guid managerId);
    }
}
