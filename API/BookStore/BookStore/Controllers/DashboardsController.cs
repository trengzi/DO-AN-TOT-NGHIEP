using BookStore.Context;
using BookStore.Enum;
using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardsController : ControllerBase
    {
        private readonly DbBookContext _context;
        private readonly IdentityContext _identityContext;
        private readonly IDashboardsService _dashboardsService;

        public DashboardsController(DbBookContext context, IdentityContext identityContext, IDashboardsService dashboardsService)
        {
            _context = context;
            _identityContext = identityContext;
            _dashboardsService = dashboardsService;
        }

        // GET: api/Authors
        [HttpGet("thongKeTheoNam/{year}")]
        public  async Task<ActionResult<object>> ThongKeTheoNam(int year)
        {

            var res = await _dashboardsService.ThongKeTheoNam(year);
            return Ok(res);
        }

        [HttpGet("getDoanhThuTrongNgay")]
        public  async Task<ActionResult<double>> GetDoanhThuTrongNgay()
        {
            return  await _dashboardsService.GetDoanhThuTrongNgay();
        }

        [HttpGet("getDoanhThuTrongTuan")]
        public async Task<ActionResult<double>> getDoanhThuTrongTuan()
        {
            return  await _dashboardsService.getDoanhThuTrongTuan();
        }

        [HttpGet("getSoLuongDonHangTheoThang")]
        public  async Task<ActionResult<IEnumerable<object>>> GetSoLuongDonHangTheoThang()
        {
            var res = await _dashboardsService.GetSoLuongDonHangTheoThang();
            return Ok(res);
        }

        [HttpGet("getThongKeNguoiDung")]
        public async Task<ActionResult<object>> GetThongKeNguoiDung()
        {
            var res = await _dashboardsService.GetThongKeNguoiDung();
            return Ok(res);
        }



        [HttpGet("getlistSanPhamTuan")]
        public async Task<ActionResult<Book>> get3SanPhamTuan()
        {
            var res = await _dashboardsService.get3SanPhamTuan();
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getlistSanPhamThang")]
        public async Task<ActionResult<Book>> getlistSanPhamThang()
        {
            var res = await _dashboardsService.getlistSanPhamThang();
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getlistSanPhamItLuotMua")]
        public async Task<ActionResult<Book>> getlistSanPhamItLuotMua()
        {
            var res = await _dashboardsService.getlistSanPhamItLuotMua();
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getDoanhThuByEmployeeId/{employeeId}")]
        public async Task<ActionResult<object>> getDoanhThuByEmployeeId(Guid employeeId)
        {
            var res = await _dashboardsService.getDoanhThuByEmployeeId(employeeId);
            return Ok(res);
            
        }

        [HttpGet("thongKeTheoNamEmployee/{employeeId}/{year}")]
        public  async Task<ActionResult<object>> ThongKeTheoNamEmployee(Guid employeeId, int year)
        {
            var res = _dashboardsService.ThongKeTheoNamEmployee(employeeId, year);
            if (res == null)
                return NotFound();
            return Ok(res.Result);
        }

        [HttpGet("getStatusDonHangNumber/{employeeId}")]
        public async Task<ActionResult<object>> GetStatusDonHangNumber(Guid employeeId)
        {
            var res = await _dashboardsService.GetStatusDonHangNumber(employeeId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getHieuSuatXuLyDonHang/{employeeId}")]
        public async Task<ActionResult<object>> GetHieuSuatXuLyDonHang(Guid employeeId)
        {
            var res = await _dashboardsService.GetHieuSuatXuLyDonHang(employeeId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("hieuSuatTheoNamEmployee/{employeeId}/{year}")]
        public  async Task<ActionResult<object>> HieuSuatTheoNamEmployee(Guid employeeId, int year)
        {
             var res = await _dashboardsService.HieuSuatTheoNamEmployee(employeeId, year);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getThongKeManagerExtend")]
        public  async Task<ActionResult<object>> GetThongKeManagerExtend()
        {
            var res = await _dashboardsService.GetThongKeManagerExtend();
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getTopEmployeesAndUsers")]
        public async Task<ActionResult<object>> GetTopEmployeesAndUsers()
        {
            var res = await _dashboardsService.GetTopEmployeesAndUsers();
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getListSanPhamSapHetHang")]
        public async Task<ActionResult<Book>> GetListSanPhamSapHetHang()
        {
            var res = await _dashboardsService.GetListSanPhamSapHetHang();
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getThongKeQuanLy")]
        public async Task<ActionResult<object>> GetThongKeQuanLy()
        {
            var res = await _dashboardsService.GetThongKeQuanLy();
            if (res == null)
                return NotFound();
            return Ok(res);
        }


        [HttpGet("getDoanhThuTrongNgayManager/{managerId}")]
        public  async Task<ActionResult<double>> GetDoanhThuTrongNgayManager(Guid managerId)
        {
            var res = await _dashboardsService.GetDoanhThuTrongNgayManager(managerId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("getDoanhThuTrongTuanManager/{managerId}")]
        public async Task<ActionResult<double>> GetDoanhThuTrongTuanManager(Guid managerId)
        {
            var res = await _dashboardsService.GetDoanhThuTrongTuanManager(managerId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }


        [HttpGet("getSoLuongDonHangTheoThangManager/{managerId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetSoLuongDonHangTheoThangManager(Guid managerId)
        {
            var res = await _dashboardsService.GetSoLuongDonHangTheoThangManager(managerId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        // GET: api/Authors
        [HttpGet("thongKeTheoNamManager/{year}/{managerId}")]
        public async Task<ActionResult<object>> ThongKeTheoNamManager(int year, Guid managerId)
        {
            var res = await _dashboardsService.ThongKeTheoNamManager(year, managerId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }


        [HttpGet("getTopEmployeesAndUsersManager/{managerId}")]
        public async Task<ActionResult<object>> GetTopEmployeesAndUsersManager(Guid managerId)
        {
            var res = await  _dashboardsService.GetTopEmployeesAndUsersManager(managerId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }


        [HttpGet("getThongKeManagerExtendManager/{managerId}")]
        public  async Task<ActionResult<object>> GetThongKeManagerExtendManager(Guid managerId)
        {
            var res = await _dashboardsService.GetThongKeManagerExtendManager(managerId);
            if (res == null)
                return NotFound();
            return Ok(res);
        }
    }
}
