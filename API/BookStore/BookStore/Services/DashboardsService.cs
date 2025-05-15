using BookStore.Context;
using BookStore.Enum;
using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class DashboardsService : IDashboardsService
    {
        private readonly DbBookContext _context;
        private readonly IdentityContext _identityContext;

        public DashboardsService(DbBookContext context, IdentityContext identityContext)
        {
            _context = context;
            _identityContext = identityContext;
        }

        public async Task<IEnumerable<object>> ThongKeTheoNam(int year)
        {
            var monthlyRevenue = await _context.Orders
            .Where(o => o.Status == OrderStatus.GiaoHangThanhCong && o.Created.HasValue && o.Created.Value.Year == year) 
            .GroupBy(o => o.Created.Value.Month) 
            .Select(g => new
            {
                Month = g.Key,  
                Revenue = g.Sum(o => o.TotalPrice) 
            })
            .OrderBy(x => x.Month) 
            .ToListAsync();

            var allMonths = Enumerable.Range(1, 12); 
            var filledRevenue = allMonths
                .GroupJoin(
                    monthlyRevenue,
                    month => month,
                    revenue => revenue.Month,
                    (month, revenueGroup) => new
                    {
                        Month = month,
                        Revenue = revenueGroup.Sum(r => r.Revenue) 
                    })
                .ToList();
            return filledRevenue;
        }

        public  async Task<double> GetDoanhThuTrongNgay()
        {
            return _context.Orders.Where(x => x.Created.HasValue && x.Created.Value.Date == DateTime.Today && x.Status == OrderStatus.GiaoHangThanhCong).Sum(x => x.TotalPrice) ?? 0;
        }

        public async Task<double> getDoanhThuTrongTuan()
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek + 1);
            if (today.DayOfWeek == DayOfWeek.Sunday)
            {
                startOfWeek = today.AddDays(-6);
            }
            var endOfWeek = startOfWeek.AddDays(7);

            var doanhThu = await _context.Orders
                .Where(x => x.Created.HasValue
                            && x.Created.Value >= startOfWeek
                            && x.Created.Value < endOfWeek
                            && x.Status == OrderStatus.GiaoHangThanhCong)
                .SumAsync(x => (double?)x.TotalPrice) ?? 0;

            return doanhThu;
        }

        public  async Task<IEnumerable<object>> GetSoLuongDonHangTheoThang()
        {
            int currentYear = DateTime.Now.Year;

            var orderStats = await _context.Orders
                .Where(x => x.Created.HasValue && x.Created.Value.Year == currentYear)
                .GroupBy(x => x.Created.Value.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    TotalOrders = g.Count(),
                    CanceledOrders = g.Count(x => x.Status == OrderStatus.DaHuy)
                })
                .ToListAsync();

            var fullYearData = Enumerable.Range(1, 12).Select(month => new
            {
                Month = month,
                TotalOrders = orderStats.FirstOrDefault(x => x.Month == month)?.TotalOrders ?? 0,
                CanceledOrders = orderStats.FirstOrDefault(x => x.Month == month)?.CanceledOrders ?? 0
            });

            return fullYearData;
        }

        public async Task<object> GetThongKeNguoiDung()
        {
            int currentYear = DateTime.Now.Year;
            int currentMonth = DateTime.Now.Month;

            int totalUsers = await _context.Users.CountAsync();

            int newUsersThisMonth = await _context.Users
                .Where(x => x.Created.HasValue 
                            && x.Created.Value.Year == currentYear 
                            && x.Created.Value.Month == currentMonth)
                .CountAsync();

            int userLock = await _identityContext.Users
                .Where(x => x.LockoutEnd > DateTimeOffset.Now)
                .CountAsync();

            return new
            {
                TotalUsers = totalUsers,
                NewUsersThisMonth = newUsersThisMonth,
                LockUser = userLock
            };
        }



        [HttpGet("getlistSanPhamTuan")]
        public async Task<IEnumerable<object>> get3SanPhamTuan()
        {
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);

            var Book = (from book in _context.Books
                       join orderDetail in _context.OrderDetails on book.Id equals orderDetail.BookId into orderDetails
                       from orderDetail in orderDetails.DefaultIfEmpty()
                       where orderDetail.Created >= startOfWeek && orderDetail.Created < endOfWeek || orderDetail == null // thêm trạng thái là đã giao hàng
                       group orderDetail by new { book.Id, book.Title, book.Price, book.Code, book.PriceDiscount, book.ImageUrls } into bookGroup
                       select new
                       {
                           bookGroup.Key.Id,
                           bookGroup.Key.Title,
                           bookGroup.Key.Price,
                           bookGroup.Key.Code,
                           bookGroup.Key.PriceDiscount,
                           bookGroup.Key.ImageUrls,
                           numberSell = bookGroup.Sum(x => x.Quantity)
                       })
                       .OrderByDescending(b => b.numberSell)
                       .Take(10)
                       .ToList();

            return Book;
        }

        public async Task<IEnumerable<object>> getlistSanPhamThang()
        {
            var startOfMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            var Book = (from book in _context.Books
                       join orderDetail in _context.OrderDetails on book.Id equals orderDetail.BookId into orderDetails
                       from orderDetail in orderDetails.DefaultIfEmpty()
                       where orderDetail.Created >= startOfMonth && orderDetail.Created < endOfMonth || orderDetail == null// thêm trạng thái là đã giao hàng
                       group orderDetail by new { book.Id, book.Title, book.Price, book.Code, book.PriceDiscount, book.ImageUrls } into bookGroup
                       select new
                       {
                           bookGroup.Key.Id,
                           bookGroup.Key.Title,
                           bookGroup.Key.Price,
                           bookGroup.Key.Code,
                           bookGroup.Key.PriceDiscount,
                           bookGroup.Key.ImageUrls,
                           numberSell = bookGroup.Sum(x => x.Quantity)
                       })
                       .OrderByDescending(b => b.numberSell)
                       .Take(10)
                       .ToList();

            return Book;
        }

        public async Task<IEnumerable<object>> getlistSanPhamItLuotMua()
        {
            var thisYear = DateTime.Now.Year;
            var thisMonth = DateTime.Now.Month;
            var Book = (from book in _context.Books
                       join orderDetail in _context.OrderDetails on book.Id equals orderDetail.BookId into orderDetails
                       from orderDetail in orderDetails.DefaultIfEmpty()
                       join order in _context.Orders on orderDetail.OrderId equals order.Id into orderGroups
                       from order in orderGroups.DefaultIfEmpty()
                       where order.Created.HasValue && order.Created.Value.Year == thisYear && order.Created.Value.Month == thisMonth || order.Created == null
                       group orderDetail by new { book.Id, book.Title, book.Price, book.Code, book.PriceDiscount, book.ImageUrls } into bookGroup
                       select new
                       {
                           bookGroup.Key.Id,
                           bookGroup.Key.Title,
                           bookGroup.Key.Price,
                           bookGroup.Key.Code,
                           bookGroup.Key.PriceDiscount,
                           bookGroup.Key.ImageUrls,
                           numberSell = bookGroup.Sum(x => x.Quantity)
                       })
                       .OrderBy(b => b.numberSell)
                       .Take(10)
                       .ToList();

            return Book;
        }

        public async Task<object> getDoanhThuByEmployeeId(Guid employeeId)
        {

            var allTimeRevenue = _context.Orders.Where(x => x.EmployeeId == employeeId && x.Status == OrderStatus.GiaoHangThanhCong).Sum(x => x.TotalPrice);

            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;
            var thisMonthRevenue = _context.Orders.Where(x => x.EmployeeId == employeeId
                                                    && (x.Created.HasValue ? x.Created.Value.Month : 0) == currentMonth
                                                    && (x.Created.HasValue ? x.Created.Value.Year : 0) == currentYear
                                                    && x.Status == OrderStatus.GiaoHangThanhCong).Sum(x => x.TotalPrice);

            var numOrder = await _context.Orders.CountAsync(x => (x.Created.HasValue ? x.Created.Value.Month : 0) == currentMonth
                                                    && x.EmployeeId == employeeId
                                                    && (x.Created.HasValue ? x.Created.Value.Year : 0) == currentYear
                                                    && x.Status == OrderStatus.GiaoHangThanhCong);
            var numOrderNotSolve = await _context.Orders.CountAsync(x => (x.Created.HasValue ? x.Created.Value.Month : 0) == currentMonth
                                                    && x.EmployeeId == employeeId
                                                    && (x.Created.HasValue ? x.Created.Value.Year : 0) == currentYear);
            return new { AllTimeRevenue = allTimeRevenue, ThisMonthRevenue = thisMonthRevenue, NumOrder = numOrder, NumOrderNotSolve = numOrderNotSolve};
        }

        public  async Task<IEnumerable<object>> ThongKeTheoNamEmployee(Guid employeeId, int year)
        {
            var monthlyRevenue = _context.Orders
            .Where(o => o.Status == OrderStatus.GiaoHangThanhCong && o.Created.HasValue && o.EmployeeId == employeeId && o.Created.Value.Year == year) 
            .GroupBy(o => o.Created.Value.Month) 
            .Select(g => new
            {
                Month = g.Key,              
                Revenue = g.Sum(o => o.TotalPrice) 
            })
            .OrderBy(x => x.Month) 
            .ToList();

            var allMonths = Enumerable.Range(1, 12); 
            var filledRevenue = allMonths
                .GroupJoin(
                    monthlyRevenue,
                    month => month,
                    revenue => revenue.Month,
                    (month, revenueGroup) => new
                    {
                        Month = month,
                        Revenue = revenueGroup.Sum(r => r.Revenue)
                    })
                .ToList();
            return filledRevenue;
        }

        public async Task<IEnumerable<object>> GetStatusDonHangNumber(Guid employeeId)
        {
            var allStatuses = new List<string>
            {
                OrderStatus.DaHuy,
                OrderStatus.ChoXacNhan,
                OrderStatus.DangChuanBiHang,
                OrderStatus.DangGiaoHang,
                OrderStatus.GiaoHangThanhCong
            };

            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;
            var query = allStatuses
                        .GroupJoin(
                        _context.Orders,
                        status => status,
                        order => order.Status,
                        (status, orders) => new
                        {
                            Status = status,
                            Count = orders
                            .Where(o => o.EmployeeId == employeeId 
                                        && (o.Created.HasValue ? o.Created.Value.Month : 0) == currentMonth 
                                        && (o.Created.HasValue ? o.Created.Value.Year : 0) == currentYear)
                            .Count()
                        })
                    .ToList();
            return query;
        }

        public async Task<object> GetHieuSuatXuLyDonHang(Guid employeeId)
        {

            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;
            var completedOrders = await _context.Orders
                .Where(o => o.Status == OrderStatus.GiaoHangThanhCong 
                            && o.SolveDate != null 
                            && o.ReceiptDate != null 
                            && o.EmployeeId == employeeId
                            && (o.Created.HasValue ? o.Created.Value.Month : 0) == currentMonth 
                            && (o.Created.HasValue ? o.Created.Value.Year : 0) == currentYear)
                .ToListAsync();

            if (completedOrders.Count == 0)
            {
                return new { Performance = 0 };
            }

            var totalProcessingTime = completedOrders
                .Sum(o => (o.SolveDate.Value - o.ReceiptDate.Value).TotalHours); 

            var performance = totalProcessingTime / completedOrders.Count;

            return new { Performance = performance };
        }

        public  async Task<IEnumerable<object>> HieuSuatTheoNamEmployee(Guid employeeId, int year)
        {
             // Lọc các đơn hàng đã giao thành công và của nhân viên theo năm
            var orders = await _context.Orders
                .Where(o => o.Status == OrderStatus.GiaoHangThanhCong
                            && o.Created.HasValue
                            && o.EmployeeId == employeeId
                            && o.Created.Value.Year == year)
                .ToListAsync();
             // Nhóm dữ liệu theo tháng và tính tổng thời gian xử lý và số lượng đơn hàng
            var monthlyData = orders
                .GroupBy(o => o.Created.Value.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    TotalProcessingTime = g.Sum(o => 
                        (o.SolveDate.HasValue && o.ReceiptDate.HasValue) 
                            ? (o.SolveDate.Value - o.ReceiptDate.Value).TotalHours 
                            : 0),
                    OrderCount = g.Count()
                })
                .OrderBy(x => x.Month)
                .ToList();

            var monthlyEfficiency = monthlyData.Select(m => new
            {
                m.Month,
                Efficiency = m.OrderCount > 0 ? m.TotalProcessingTime / m.OrderCount : 0 
            }).ToList();
            var allMonths = Enumerable.Range(1, 12);
            var filledEfficiency = allMonths
                .GroupJoin(
                    monthlyEfficiency,
                    month => month,
                    efficiency => efficiency.Month,
                    (month, efficiencyGroup) => new
                    {
                        Month = month,
                        Efficiency = efficiencyGroup.Any() ? efficiencyGroup.First().Efficiency : 0 // Nếu không có hiệu suất cho tháng thì trả về 0
                    })
                .ToList();

            return filledEfficiency;
        }

        public  async Task<object> GetThongKeManagerExtend()
        {
            var thisYear = DateTime.Now.Year;
            var lastYear = thisYear - 1;

            var doanhThuNamTruoc = await _context.Orders.Where(x => x.Created.HasValue && x.Created.Value.Year == lastYear && x.Status == OrderStatus.GiaoHangThanhCong).SumAsync(x => x.TotalPrice);
            var doanhThuNamHienTai = await _context.Orders.Where(x => x.Created.HasValue && x.Created.Value.Year == thisYear && x.Status == OrderStatus.GiaoHangThanhCong).SumAsync(x => x.TotalPrice);

            var lastMonth = DateTime.Now.AddMonths(-1);
            var doanhThuThangHienTai = await _context.Orders.Where(x => x.Created.HasValue && x.Created.Value.Year == thisYear && x.Created.Value.Month == DateTime.Now.Month && x.Status == OrderStatus.GiaoHangThanhCong).SumAsync(x => x.TotalPrice);
            var doanhThuThangTruoc = await _context.Orders.Where(x => x.Created.HasValue && x.Created.Value.Year == lastMonth.Year && x.Created.Value.Month == lastMonth.Month && x.Status == OrderStatus.GiaoHangThanhCong).SumAsync(x => x.TotalPrice);

            var tangTruongTheoThang = doanhThuThangTruoc == 0 ? 0 : (((double)doanhThuThangHienTai - (double)doanhThuThangTruoc) / doanhThuThangTruoc);


            var soDonHangHuyVaThanhCong = await _context.Orders.CountAsync(x => x.Status == OrderStatus.GiaoHangThanhCong || x.Status == OrderStatus.DaHuy);
            var soDonHangThanhCong = await _context.Orders.CountAsync(x => x.Status == OrderStatus.GiaoHangThanhCong);
            var tiLeHoanThanhDonHang = soDonHangHuyVaThanhCong == 0 ? 0 : ((double)soDonHangThanhCong / soDonHangHuyVaThanhCong);

            var soDonHangHuyVaThanhCongTrongThang = await _context.Orders.CountAsync(x => (x.Status == OrderStatus.GiaoHangThanhCong|| x.Status == OrderStatus.DaHuy) && x.Created.HasValue && x.Created.Value.Year == thisYear && x.Created.Value.Month == DateTime.Now.Month);
            var soDonHangThanhCongTrongThang = await _context.Orders.CountAsync(x => x.Status == OrderStatus.GiaoHangThanhCong && x.Created.HasValue && x.Created.Value.Year == thisYear && x.Created.Value.Month == DateTime.Now.Month);
            var tiLeHoanThanhDonHangTrongThang = soDonHangHuyVaThanhCongTrongThang == 0 ? 0: ((double)soDonHangThanhCongTrongThang / soDonHangHuyVaThanhCongTrongThang);
            

            var soDonHangXuLyTrongThang = await _context.Orders.CountAsync(x => x.Created.HasValue && x.Created.Value.Year == thisYear && x.Created.Value.Month == DateTime.Now.Month);
            var soDonHangXuLyTrongNam = await _context.Orders.CountAsync(x => x.Created.HasValue && x.Created.Value.Year == thisYear);


            var thoiGianXuLyDonHangTrongThang =  _context.Orders
                                        .Where(x => x.SolveDate.HasValue 
                                                    && x.ReceiptDate.HasValue 
                                                    && x.Created.HasValue 
                                                    && x.Created.Value.Year == thisYear 
                                                    && x.Created.Value.Month == DateTime.Now.Month)
                                        .AsEnumerable()
                                        .Sum(x => (x.SolveDate.Value - x.ReceiptDate.Value).TotalHours > 0 
                                                    ? (x.SolveDate.Value - x.ReceiptDate.Value).TotalHours : 0);
            var tongSoDonHangTrongThang = await _context.Orders.CountAsync(x => x.Created.HasValue && x.Created.Value.Year == thisYear && x.Created.Value.Month == DateTime.Now.Month);
            var thoiGianXuLyDonHangTrungBinhTrongThang = tongSoDonHangTrongThang == 0 ? 0 : ((double)thoiGianXuLyDonHangTrongThang / tongSoDonHangTrongThang);

            var soDonHuyTrongThang = await _context.Orders.CountAsync(x => (x.Status == OrderStatus.DaHuy && x.Created.HasValue && x.Created.Value.Year == thisYear && x.Created.Value.Month == DateTime.Now.Month));
            var tiLeHuyDonTrongThang = soDonHangXuLyTrongThang == 0 ? 0 : ((double)soDonHuyTrongThang / soDonHangXuLyTrongThang);


            return new
            {
                doanhThuNamTruoc = doanhThuNamTruoc,
                doanhThuNamHienTai = doanhThuNamHienTai,
                tangTruongTheoThang = tangTruongTheoThang,
                tiLeHoanThanhDonHang = tiLeHoanThanhDonHang,
                tiLeHoanThanhDonHangTrongThang = tiLeHoanThanhDonHangTrongThang,
                soDonHangXuLyTrongThang = soDonHangXuLyTrongThang,
                soDonHangXuLyTrongNam = soDonHangXuLyTrongNam,
                thoiGianXuLyDonHangTrungBinhTrongThang = thoiGianXuLyDonHangTrungBinhTrongThang,
                tiLeHuyDonTrongThang = tiLeHuyDonTrongThang
            };
        }

        [HttpGet("getTopEmployeesAndUsers")]
        public async Task<object> GetTopEmployeesAndUsers()
        {
            var thisYear = DateTime.Now.Year;
            var thisMonth = DateTime.Now.Month;
            var employeesTrongThang = _context.Orders
                                .Where(o => o.Status == OrderStatus.GiaoHangThanhCong && o.EmployeeId.HasValue && o.Created.HasValue && o.Created.Value.Year == thisYear && o.Created.Value.Month == thisMonth)
                                .AsEnumerable()
                                .GroupBy(o => o.EmployeeId)
                                .Select(g => new
                                {
                                    EmployeeId = g.Key,
                                    TotalRevenue = g.Sum(o => o.TotalPrice),
                                    AverageProcessingTime = g.Average(o => (o.SolveDate.HasValue && o.ReceiptDate.HasValue)
                                        ? (o.SolveDate.Value - o.ReceiptDate.Value).TotalHours
                                        : 0),
                                    TotalOrders = g.Count()
                                })
                                .Join(
                                    _context.Employees,
                                    orderGroup => orderGroup.EmployeeId,
                                    employee => employee.Id,
                                    (orderGroup, employee) => new
                                    {
                                        EmployeeId = orderGroup.EmployeeId,
                                        FullName = employee.FullName,
                                        TotalRevenue = orderGroup.TotalRevenue,
                                        AverageProcessingTime = orderGroup.AverageProcessingTime,
                                        TotalOrders = orderGroup.TotalOrders
                                    }
                                );

            var employeesTrongNam = _context.Orders
                               .Where(o => o.Status == OrderStatus.GiaoHangThanhCong && o.EmployeeId.HasValue && o.Created.HasValue && o.Created.Value.Year == thisYear)
                               .AsEnumerable()
                               .GroupBy(o => o.EmployeeId)
                               .Select(g => new
                               {
                                   EmployeeId = g.Key,
                                   TotalRevenue = g.Sum(o => o.TotalPrice),
                                   AverageProcessingTime = g.Average(o => (o.SolveDate.HasValue && o.ReceiptDate.HasValue)
                                       ? (o.SolveDate.Value - o.ReceiptDate.Value).TotalHours
                                       : 0),
                                   TotalOrders = g.Count()
                               })
                               .Join(
                                   _context.Employees,
                                   orderGroup => orderGroup.EmployeeId,
                                   employee => employee.Id,
                                   (orderGroup, employee) => new
                                   {
                                       EmployeeId = orderGroup.EmployeeId,
                                       FullName = employee.FullName,
                                       TotalRevenue = orderGroup.TotalRevenue,
                                       AverageProcessingTime = orderGroup.AverageProcessingTime,
                                       TotalOrders = orderGroup.TotalOrders
                                   }
                               );
                                
            var topEmployeesTrongThang = employeesTrongThang.OrderByDescending(e => e.TotalRevenue).Take(3).ToList();
            var topEmployeesTrongNam = employeesTrongNam.OrderByDescending(e => e.TotalRevenue).Take(3).ToList();
            var topEmployeeDonHangTrongThang = employeesTrongThang.OrderByDescending(e => e.TotalOrders).Take(3).ToList();
            var topEmployeeDonHangTrongNam = employeesTrongNam.OrderByDescending(e => e.TotalOrders).Take(3).ToList();
            var botEmployeesTrongThang = employeesTrongThang.OrderBy(e => e.TotalRevenue).Take(3).ToList();
            var botEmployeeDonHangTrongThang = employeesTrongThang.OrderBy(e => e.TotalOrders).Take(3).ToList();


            var topKhachTrungThanh = _context.Orders
                                .Where(o => o.Status == OrderStatus.GiaoHangThanhCong && o.UserId.HasValue)
                                .AsEnumerable()
                                .GroupBy(o => o.UserId)
                                .Select(g => new
                                {
                                    UserId = g.Key,
                                    TotalRevenue = g.Sum(o => o.TotalPrice),
                                    TotalOrders = g.Count()
                                })
                                .Join(
                                    _context.Users,
                                    orderGroup => orderGroup.UserId,
                                    user => user.Id,
                                    (orderGroup, user) => new
                                    {
                                        UserId = orderGroup.UserId,
                                        FullName = user.FullName,
                                        TotalRevenue = orderGroup.TotalRevenue,
                                        TotalOrders = orderGroup.TotalOrders
                                    }
                                ).OrderByDescending(e => e.TotalRevenue)
                                .Take(5)
                                .ToList();

            var topKhachMuaNhieuTrongThang = _context.Orders
                                .Where(o => o.Status == OrderStatus.GiaoHangThanhCong && o.UserId.HasValue && o.Created.HasValue && o.Created.Value.Year == thisYear && o.Created.Value.Month == thisMonth)
                                .AsEnumerable()
                                .GroupBy(o => o.UserId)
                                .Select(g => new
                                {
                                    UserId = g.Key,
                                    TotalRevenue = g.Sum(o => o.TotalPrice),
                                    TotalOrders = g.Count()
                                })
                                .Join(
                                    _context.Users,
                                    orderGroup => orderGroup.UserId,
                                    user => user.Id,
                                    (orderGroup, user) => new
                                    {
                                        UserId = orderGroup.UserId,
                                        FullName = user.FullName,
                                        TotalRevenue = orderGroup.TotalRevenue,
                                        TotalOrders = orderGroup.TotalOrders
                                    }
                                ).OrderByDescending(e => e.TotalRevenue)
                                .Take(3)
                                .ToList();
            return new
            {
                topEmployeesTrongThang = topEmployeesTrongThang,
                topEmployeesTrongNam = topEmployeesTrongNam,
                topEmployeeDonHangTrongThang = topEmployeeDonHangTrongThang,
                topEmployeeDonHangTrongNam = topEmployeeDonHangTrongNam,
                topKhachTrungThanh = topKhachTrungThanh,
                topKhachMuaNhieuTrongThang = topKhachMuaNhieuTrongThang,
                botEmployeesTrongThang = botEmployeesTrongThang,
                botEmployeeDonHangTrongThang = botEmployeeDonHangTrongThang
            };
        }

        public async Task<IEnumerable<object>> GetListSanPhamSapHetHang()
        {
            var thisYear = DateTime.Now.Year;
            var thisMonth = DateTime.Now.Month;
            var Book = (from book in _context.Books
                               orderby book.Quantity
                               select new
                               {
                                   book.Id,
                                   book.Title,
                                   book.Price,
                                   book.Code,
                                   book.PriceDiscount,
                                   book.ImageUrls,
                                   stock = book.Quantity
                               })
                               .Take(10)
                               .ToList();
            return Book;
        }

        public async Task<object> GetThongKeQuanLy()
        {
            var thisYear = DateTime.Now.Year;
            var thisMonth = DateTime.Now.Month;

            var query = await (from ql in _context.Managers
                               join em in _context.Employees on ql.Id equals em.ManagerId into emGroup
                               from em in emGroup.DefaultIfEmpty()
                               join od in _context.Orders on em.Id equals od.EmployeeId into odGroup
                               from od in odGroup.DefaultIfEmpty()
                               where (od.Created.HasValue && od.Created.Value.Year == thisYear && od.Status == OrderStatus.GiaoHangThanhCong || od == null)
                               group new { em, od } by new { ql.Id, ql.FullName } into grouped
                               select new
                               {
                                   grouped.Key.Id,
                                   grouped.Key.FullName,
                                   soNhanVien = grouped.Select(x => x.em.Id).Distinct().Count(x => x!= null),
                                   doanhThu = grouped.Sum(x => x.od == null ? 0 : x.od.TotalPrice)
                               }).ToListAsync();

             var queryMonth = await (from ql in _context.Managers
                               join em in _context.Employees on ql.Id equals em.ManagerId into emGroup
                               from em in emGroup.DefaultIfEmpty()
                               join od in _context.Orders on em.Id equals od.EmployeeId into odGroup
                               from od in odGroup.DefaultIfEmpty()
                               where (od.Created.HasValue && od.Created.Value.Year == thisYear && od.Created.Value.Month == thisMonth && od.Status == OrderStatus.GiaoHangThanhCong || od == null)
                               group new { em, od } by new { ql.Id, ql.FullName } into grouped
                               select new
                               {
                                   grouped.Key.Id,
                                   grouped.Key.FullName,
                                   soNhanVien = grouped.Select(x => x.em.Id).Distinct().Count(x => x!= null),
                                   doanhThu = grouped.Sum(x => x.od == null ? 0 : x.od.TotalPrice)
                               }).ToListAsync();

            return new
            {
                topManager = query,
                topManagerMonth = queryMonth
            };
        }


        public  async Task<double> GetDoanhThuTrongNgayManager(Guid managerId)
        {
            var query = from od in _context.Orders
                        join em in _context.Employees on od.EmployeeId equals em.Id
                        where em.ManagerId == managerId
                        && od.Created.HasValue && od.Created.Value.Date == DateTime.Today && od.Status == OrderStatus.GiaoHangThanhCong
                        select od;
             return query.Sum(x => x.TotalPrice) ?? 0;
        }

        public async Task<double> GetDoanhThuTrongTuanManager(Guid managerId)
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek + 1);
            if (today.DayOfWeek == DayOfWeek.Sunday)
            {
                startOfWeek = today.AddDays(-6);
            }
            var endOfWeek = startOfWeek.AddDays(7);

            var doanhThu = await (from od in _context.Orders
                                  join em in _context.Employees on od.EmployeeId equals em.Id
                                  where em.ManagerId == managerId
                                        && od.Created.HasValue
                                        && od.Created.Value >= startOfWeek
                                        && od.Created.Value < endOfWeek
                                        && od.Status == OrderStatus.GiaoHangThanhCong
                                  select (double?)od.TotalPrice)
                                  .SumAsync() ?? 0;

            return doanhThu;
        }


        public async Task<IEnumerable<object>> GetSoLuongDonHangTheoThangManager(Guid managerId)
        {
            int currentYear = DateTime.Now.Year;

            var orderStats = await (from od in _context.Orders
                                    join em in _context.Employees on od.EmployeeId equals em.Id
                                    where em.ManagerId == managerId
                                          && od.Created.HasValue
                                          && od.Created.Value.Year == currentYear
                                    group od by od.Created.Value.Month into g
                                    select new
                                    {
                                        Month = g.Key,
                                        TotalOrders = g.Count(),
                                        CanceledOrders = g.Count(x => x.Status == OrderStatus.DaHuy)
                                    }).ToListAsync();

            var fullYearData = Enumerable.Range(1, 12).Select(month => new
            {
                Month = month,
                TotalOrders = orderStats.FirstOrDefault(x => x.Month == month)?.TotalOrders ?? 0,
                CanceledOrders = orderStats.FirstOrDefault(x => x.Month == month)?.CanceledOrders ?? 0
            });

            return fullYearData;
        }

        public async Task<IEnumerable<object>> ThongKeTheoNamManager(int year, Guid managerId)
        {
            var monthlyRevenue = await (from od in _context.Orders
                                        join em in _context.Employees on od.EmployeeId equals em.Id
                                        where em.ManagerId == managerId
                                              && od.Status == OrderStatus.GiaoHangThanhCong
                                              && od.Created.HasValue
                                              && od.Created.Value.Year == year
                                        group od by od.Created.Value.Month into g
                                        select new
                                        {
                                            Month = g.Key,               // Tháng
                                            Revenue = g.Sum(o => o.TotalPrice) // Tổng doanh thu
                                        })
                                        .OrderBy(x => x.Month) // Sắp xếp theo tháng
                                        .ToListAsync();

            var allMonths = Enumerable.Range(1, 12); // Danh sách từ 1 đến 12
            var filledRevenue = allMonths
                .GroupJoin(
                    monthlyRevenue,
                    month => month,
                    revenue => revenue.Month,
                    (month, revenueGroup) => new
                    {
                        Month = month,
                        Revenue = revenueGroup.Sum(r => r.Revenue) // Nếu không có doanh thu thì mặc định là 0
                    })
                .ToList();

            return filledRevenue;
        }

        public async Task<object> GetTopEmployeesAndUsersManager(Guid managerId)
        {
            var thisYear = DateTime.Now.Year;
            var thisMonth = DateTime.Now.Month;

            var query = await (from od in _context.Orders
                                 join em in _context.Employees on od.EmployeeId equals em.Id
                                 where od.Status == OrderStatus.GiaoHangThanhCong
                                       && od.Created.HasValue
                                       && od.Created.Value.Year == thisYear
                                       && od.Created.Value.Month == thisMonth
                                       && em.ManagerId == managerId
                                 group od by new { em.Id, em.FullName } into g
                                 select new
                                 {
                                     EmployeeId = g.Key.Id,
                                     FullName = g.Key.FullName,
                                     Orders = g.ToList(), // Lấy danh sách đơn hàng
                                     TotalOrders = g.Count()
                                 }).ToListAsync();

            var employeesTrongThang = query.Select(e => new
                        {
                            EmployeeId = e.EmployeeId,
                            FullName = e.FullName,
                            TotalRevenue = e.Orders.Sum(o => o.TotalPrice), // Tổng giá trị đơn hàng
                            AverageProcessingTime = e.Orders.Average(o => 
                                (o.SolveDate.HasValue && o.ReceiptDate.HasValue) 
                                    ? (o.SolveDate.Value - o.ReceiptDate.Value).TotalHours 
                                    : 0), // Thời gian xử lý trung bình
                            TotalOrders = e.TotalOrders
                        }).ToList();


                var query2 = await (from od in _context.Orders
                                   join em in _context.Employees on od.EmployeeId equals em.Id
                                   where od.Status == OrderStatus.GiaoHangThanhCong
                                         && od.Created.HasValue
                                         && od.Created.Value.Year == thisYear
                                         && em.ManagerId == managerId
                                   group od by new { em.Id, em.FullName } into g
                                   select new
                                   {
                                       EmployeeId = g.Key.Id,
                                       FullName = g.Key.FullName,
                                       Orders = g.ToList(),
                                       TotalOrders = g.Count()
                                   }).ToListAsync();
            var employeesTrongNam = query2.Select(e => new
                        {
                            EmployeeId = e.EmployeeId,
                            FullName = e.FullName,
                            TotalRevenue = e.Orders.Sum(o => o.TotalPrice), // Tổng doanh thu
                            AverageProcessingTime = e.Orders.Average(o => 
                                (o.SolveDate.HasValue && o.ReceiptDate.HasValue) 
                                    ? (o.SolveDate.Value - o.ReceiptDate.Value).TotalHours 
                                    : 0), // Thời gian xử lý trung bình
                            TotalOrders = e.TotalOrders
                        }).ToList();

            var topEmployeesTrongThang = employeesTrongThang.OrderByDescending(e => e.TotalRevenue).Take(3).ToList();
            var topEmployeesTrongNam = employeesTrongNam.OrderByDescending(e => e.TotalRevenue).Take(3).ToList();
            var topEmployeeDonHangTrongThang = employeesTrongThang.OrderByDescending(e => e.TotalOrders).Take(3).ToList();
            var topEmployeeDonHangTrongNam = employeesTrongNam.OrderByDescending(e => e.TotalOrders).Take(3).ToList();
            var botEmployeesTrongThang = employeesTrongThang.OrderBy(e => e.TotalRevenue).Take(3).ToList();
            var botEmployeeDonHangTrongThang = employeesTrongThang.OrderBy(e => e.TotalOrders).Take(3).ToList();

            return new
            {
                topEmployeesTrongThang = topEmployeesTrongThang,
                topEmployeesTrongNam = topEmployeesTrongNam,
                topEmployeeDonHangTrongThang = topEmployeeDonHangTrongThang,
                topEmployeeDonHangTrongNam = topEmployeeDonHangTrongNam,
                botEmployeesTrongThang = botEmployeesTrongThang,
                botEmployeeDonHangTrongThang = botEmployeeDonHangTrongThang
            };
        }

        public  async Task<object> GetThongKeManagerExtendManager(Guid managerId)
        {
            var thisYear = DateTime.Now.Year;
            var lastYear = thisYear - 1;

            var doanhThuNamTruoc = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId && eo.ord.Created.HasValue && eo.ord.Created.Value.Year == lastYear && eo.ord.Status == OrderStatus.GiaoHangThanhCong)
                .SumAsync(eo => eo.ord.TotalPrice);

            var doanhThuNamHienTai = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId && eo.ord.Created.HasValue && eo.ord.Created.Value.Year == thisYear && eo.ord.Status == OrderStatus.GiaoHangThanhCong)
                .SumAsync(eo => eo.ord.TotalPrice);

            var lastMonth = DateTime.Now.AddMonths(-1);

            var doanhThuThangHienTai = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId && eo.ord.Created.HasValue && eo.ord.Created.Value.Year == thisYear && eo.ord.Created.Value.Month == DateTime.Now.Month && eo.ord.Status == OrderStatus.GiaoHangThanhCong)
                .SumAsync(eo => eo.ord.TotalPrice);

            var doanhThuThangTruoc = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId && eo.ord.Created.HasValue && eo.ord.Created.Value.Year == lastMonth.Year && eo.ord.Created.Value.Month == lastMonth.Month && eo.ord.Status == OrderStatus.GiaoHangThanhCong)
                .SumAsync(eo => eo.ord.TotalPrice);

            var tangTruongTheoThang = doanhThuThangTruoc == 0 ? 0 : (((double)doanhThuThangHienTai - (double)doanhThuThangTruoc) / doanhThuThangTruoc);


            var soDonHangHuyVaThanhCong = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId && (eo.ord.Status == OrderStatus.GiaoHangThanhCong || eo.ord.Status == OrderStatus.DaHuy))
                .CountAsync();

            var soDonHangThanhCong = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId && eo.ord.Status == OrderStatus.GiaoHangThanhCong)
                .CountAsync();

            var tiLeHoanThanhDonHang = soDonHangHuyVaThanhCong == 0 ? 0 : ((double)soDonHangThanhCong / soDonHangHuyVaThanhCong);

            var soDonHangHuyVaThanhCongTrongThang = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId && 
                             (eo.ord.Status == OrderStatus.GiaoHangThanhCong || eo.ord.Status == OrderStatus.DaHuy) &&
                             eo.ord.Created.HasValue &&
                             eo.ord.Created.Value.Year == thisYear &&
                             eo.ord.Created.Value.Month == DateTime.Now.Month)
                .CountAsync();

            var soDonHangThanhCongTrongThang = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId &&
                             eo.ord.Status == OrderStatus.GiaoHangThanhCong &&
                             eo.ord.Created.HasValue &&
                             eo.ord.Created.Value.Year == thisYear &&
                             eo.ord.Created.Value.Month == DateTime.Now.Month)
                .CountAsync();

            var tiLeHoanThanhDonHangTrongThang = soDonHangHuyVaThanhCong == 0 ? 0: ((double)soDonHangThanhCongTrongThang / soDonHangHuyVaThanhCongTrongThang);
            

            var soDonHangXuLyTrongThang = await _context.Orders
                .Join(_context.Employees,
                        ord => ord.EmployeeId,
                        emp => emp.Id,
                        (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId &&
                                eo.ord.Created.HasValue &&
                                eo.ord.Created.Value.Year == thisYear &&
                                eo.ord.Created.Value.Month == DateTime.Now.Month)
                .CountAsync();

            var soDonHangXuLyTrongNam = await _context.Orders
                .Join(_context.Employees,
                        ord => ord.EmployeeId,
                        emp => emp.Id,
                        (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId &&
                                eo.ord.Created.HasValue &&
                                eo.ord.Created.Value.Year == thisYear)
                .CountAsync();



           var thoiGianXuLyDonHangTrongThang = _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId &&
                             eo.ord.SolveDate.HasValue && 
                             eo.ord.ReceiptDate.HasValue &&
                             eo.ord.Created.HasValue &&
                             eo.ord.Created.Value.Year == thisYear &&
                             eo.ord.Created.Value.Month == DateTime.Now.Month)
                .AsEnumerable()
                .Sum(x => (x.ord.SolveDate.Value - x.ord.ReceiptDate.Value).TotalHours > 0 
                         ? (x.ord.SolveDate.Value - x.ord.ReceiptDate.Value).TotalHours : 0);

            var tongSoDonHangTrongThang = await _context.Orders
                .Join(_context.Employees,
                      ord => ord.EmployeeId,
                      emp => emp.Id,
                      (ord, emp) => new { ord, emp })
                .Where(eo => eo.emp.ManagerId == managerId &&
                             eo.ord.Created.HasValue &&
                             eo.ord.Created.Value.Year == thisYear &&
                             eo.ord.Created.Value.Month == DateTime.Now.Month)
                .CountAsync();

            var thoiGianXuLyDonHangTrungBinhTrongThang = tongSoDonHangTrongThang == 0 ? 0 : ((double)thoiGianXuLyDonHangTrongThang / tongSoDonHangTrongThang);

            var soDonHuyTrongThang = await _context.Orders
                                .Join(_context.Employees,
                                      ord => ord.EmployeeId,
                                      emp => emp.Id,
                                      (ord, emp) => new { ord, emp })
                                .Where(eo => eo.emp.ManagerId == managerId &&
                                             eo.ord.Status == OrderStatus.DaHuy &&
                                             eo.ord.Created.HasValue &&
                                             eo.ord.Created.Value.Year == thisYear &&
                                             eo.ord.Created.Value.Month == DateTime.Now.Month)
                                .CountAsync();

            var tiLeHuyDonTrongThang = soDonHangXuLyTrongThang == 0 ? 0 : ((double)soDonHuyTrongThang / soDonHangXuLyTrongThang);


            return new
            {
                doanhThuNamTruoc = doanhThuNamTruoc,
                doanhThuNamHienTai = doanhThuNamHienTai,
                tangTruongTheoThang = tangTruongTheoThang,
                tiLeHoanThanhDonHang = tiLeHoanThanhDonHang,
                tiLeHoanThanhDonHangTrongThang = tiLeHoanThanhDonHangTrongThang,
                soDonHangXuLyTrongThang = soDonHangXuLyTrongThang,
                soDonHangXuLyTrongNam = soDonHangXuLyTrongNam,
                thoiGianXuLyDonHangTrungBinhTrongThang = thoiGianXuLyDonHangTrungBinhTrongThang,
                tiLeHuyDonTrongThang = tiLeHuyDonTrongThang
            };
        }
    }
}
