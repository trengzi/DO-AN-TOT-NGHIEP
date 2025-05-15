using BookStore.Enum;
using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class OrdersService : IOrdersService
    {
        private readonly DbBookContext _context;

        public OrdersService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetOrders()
        {
            return await _context.Orders.OrderByDescending(x => x.Created).ToListAsync();
        }

        public async Task<object> GetOrdersAdmin(int page)
        {
            var totalRecords = await _context.Orders.CountAsync();
            var query = await (from od in _context.Orders
                               join em in _context.Employees on od.EmployeeId equals em.Id into emGroup
                               from em in emGroup.DefaultIfEmpty()
                               orderby od.Created descending
                               select new
                               {
                                   od.Code,
                                   od.Id,
                                   od.Status,
                                   od.TotalPrice,
                                   od.Address,
                                   od.Created,
                                   FullName = em != null ? em.FullName : "",
                                   EmployeeId = em != null ? em.Id : Guid.Empty,
                               }).Skip(page * 20).Take(20).ToListAsync();
            return new { TotalRecords = totalRecords, order = query };
        }


        public async Task<object> GetOrder(Guid id)
        {
            var Order = await (from od in _context.Orders
                               join cp in _context.Coupons on od.CouponId equals cp.Id into cpGroup
                               from cp in cpGroup.DefaultIfEmpty()
                               join us in _context.Users on od.UserId equals us.Id
                               where od.Id == id
                               select new
                               {
                                   od.Address,
                                   od.Code,
                                   od.Created,
                                   od.Id,
                                   od.Note,
                                   od.PaymentMethod,
                                   od.PhoneNumber,
                                   od.ShippingMethod,
                                   od.Status,
                                   od.TotalPrice,
                                   od.UserId,
                                   od.CouponId,
                                   couponCode = cp.Code,
                                   couponPercent = cp.DiscountPercent,
                                   fullName = us.FullName,
                                   email= us.Email,
                               }).FirstOrDefaultAsync();
            return Order;
        }

        public async Task<int> PutOrder(Guid id, Order Order)
        {
            if (id != Order.Id)
            {
                return 0;
            }

            _context.Entry(Order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return 1;
                }
                else
                {
                    throw;
                }
            }

            return 2;
        }

        public async Task<bool> PostOrder(Order Order)
        {
            Order.Created = DateTime.Now;
            _context.Orders.Add(Order);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteOrder(Guid id)
        {
            var Order = await _context.Orders.FindAsync(id);
            if (Order == null)
            {
                return false;
            }

            _context.Orders.Remove(Order);
            await _context.SaveChangesAsync();

            return true;
        }

        private bool OrderExists(Guid id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
        public async Task<object> getListDonHangByAccountId(Guid id)
        {
            var Order = await (from od in _context.Orders
                               join cp in _context.Coupons on od.CouponId equals cp.Id into cpGroup
                                from cp in cpGroup.DefaultIfEmpty()
                               where od.UserId == id
                               orderby od.Created descending
                               select new
                               {
                                   orderCode = od.Code,
                                   od.Id,
                                   od.CouponId,
                                   od.Created,
                                   couponCode = cp.Code,
                                   od.Status,
                                   od.TotalPrice,
                               }).ToListAsync();
            return Order;
        }

        public async Task<int> HuyDonHang(Guid id, Order Order)
        {
            if (id != Order.Id)
            {
                return 0;
            }

            _context.Entry(Order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return 1;
                }
                else
                {
                    throw;
                }
            }

            return 2;
        }

        public async Task<object> ChangeStatusUp(Guid id)
        {
            var Order = await _context.Orders.FindAsync(id);
            if(Order == null)
            {
                return new { status = "false" };
            }

            if(Order.Status == OrderStatus.DaHuy)
            {
                Order.Status = OrderStatus.ChoXacNhan;
            }
            else if(Order.Status == OrderStatus.ChoXacNhan)
            {
                Order.Status = OrderStatus.DangChuanBiHang;
            }
            else if(Order.Status == OrderStatus.DangChuanBiHang)
            {
                Order.SolveDate = DateTime.Now;
                Order.Status = OrderStatus.DangGiaoHang;
            }
            else if(Order.Status == OrderStatus.DangGiaoHang)
            {
                Order.Status = OrderStatus.GiaoHangThanhCong;
            }
            _context.Entry(Order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return new {status = "not found"};
                }
                else
                {
                    throw;
                }
            }

            return new {status = "success"};
        }

        public async Task<object> ChangeStatusDown(Guid id)
        {
            var Order = await _context.Orders.FindAsync(id);
            if(Order == null)
            {
                return new { status = "false" };
            }
            else if(Order.Status == OrderStatus.GiaoHangThanhCong)
            {
                Order.Status = OrderStatus.DangGiaoHang;
            }

            else if(Order.Status == OrderStatus.DangGiaoHang)
            {
                Order.Status = OrderStatus.DangChuanBiHang;
            }
            else if(Order.Status == OrderStatus.DangChuanBiHang)
            {
                Order.Status = OrderStatus.ChoXacNhan;
            }
            else if(Order.Status == OrderStatus.ChoXacNhan)
            {
                Order.Status = OrderStatus.DaHuy;
            }

            _context.Entry(Order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return new {status = "not found"};
                }
                else
                {
                    throw;
                }
            }

            return new {status = "success"};
        }

        public async Task<IEnumerable<object>> GetAllEmployee()
        {
            var query = await (from em in _context.Employees
                          join ma in _context.Managers on em.ManagerId equals ma.Id into maGroup
                          from ma in maGroup.DefaultIfEmpty()
                          orderby em.Created descending
                          select new
                          {
                              em.Id,
                              em.Address,
                              em.HiredDate,
                              em.Salary,
                              em.FullName,
                              em.Phone,
                              em.Email,
                              em.Created,
                              managerFullName = ma.FullName,
                          }).ToListAsync();
            return query;
        }

        public async Task<IEnumerable<object>> GetAllEmployee(Guid managerId)
        {
            var query = await (from em in _context.Employees
                          join ma in _context.Managers on em.ManagerId equals ma.Id into maGroup
                          from ma in maGroup.DefaultIfEmpty()
                          where em.ManagerId == managerId
                          orderby em.Created descending
                          select new
                          {
                              em.Id,
                              em.Address,
                              em.HiredDate,
                              em.Salary,
                              em.FullName,
                              em.Phone,
                              em.Email,
                              em.Created,
                              managerFullName = ma.FullName,
                          }).ToListAsync();
            return query;
        }

        public async Task<object> SetEmployeeForOrder(Guid orderId, Guid employeeId)
        {

            var curOrder = _context.Orders.FirstOrDefault(x => x.Id == orderId);
            curOrder.EmployeeId = employeeId;
            curOrder.ReceiptDate = DateTime.Now;
            _context.Entry(curOrder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(orderId))
                {
                    return new {status = "not found"};
                }
                else
                {
                    throw;
                }
            }

            return new {status = "success"};
        }

        public async Task<IEnumerable<Order>> getAllOrderByEmployeeId(Guid employeeId)
        {
            return await _context.Orders.Where(x => x.EmployeeId == employeeId).OrderByDescending(x => x.Created).ToListAsync();
        }
    }
}
