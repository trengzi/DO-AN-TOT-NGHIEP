using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public class OrderDetailsService : IOrderDetailsService
    {
        private readonly DbBookContext _context;

        public OrderDetailsService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetails()
        {
            return await _context.OrderDetails.ToListAsync();
        }

        public async Task<OrderDetail?> GetOrderDetailById(Guid id)
        {
            return await _context.OrderDetails.FindAsync(id);
        }

        public async Task<bool> UpdateOrderDetail(Guid id, OrderDetail orderDetail)
        {
            if (id != orderDetail.Id) return false;

            _context.Entry(orderDetail).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return _context.OrderDetails.Any(e => e.Id == id);
            }
        }

        public async Task<bool> CreateOrderDetails(IEnumerable<OrderDetail> orderDetails)
        {
            _context.OrderDetails.AddRange(orderDetails);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrderDetail(Guid id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null) return false;

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetListSanPhamByIdDonHang(Guid id, Guid userId)
        {
            var data = await (from od in _context.OrderDetails
                              join bk in _context.Books on od.BookId equals bk.Id
                              where od.OrderId == id
                              select new
                              {
                                  bk.Id,
                                  bk.Title,
                                  bk.ImageUrls,
                                  unitPrice = od.UnitPrice,
                                  od.Quantity,
                                  bk.Code,
                                  isDanhGia = _context.Reviews.Any(rv => rv.BookId == bk.Id && rv.UserId == userId)
                              }).ToListAsync();

            return data;
        }


        public async Task<object> GetListSanPhamByIdDonHangAdmin(Guid id)
        {
            return await (from od in _context.OrderDetails
                          join bk in _context.Books on od.BookId equals bk.Id
                          where od.OrderId == id
                          select new
                          {
                              bk.Id,
                              bk.Title,
                              bk.ImageUrls,
                              unitPrice = od.UnitPrice,
                              od.Quantity,
                              bk.Code
                          }).ToListAsync();
        }
    }
}
