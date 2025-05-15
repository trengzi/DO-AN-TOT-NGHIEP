using BookStore.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services.Interface
{
    public interface IOrderDetailsService
    {
        Task<IEnumerable<OrderDetail>> GetOrderDetails();
        Task<OrderDetail?> GetOrderDetailById(Guid id);
        Task<bool> UpdateOrderDetail(Guid id, OrderDetail orderDetail);
        Task<bool> CreateOrderDetails(IEnumerable<OrderDetail> orderDetails);
        Task<bool> DeleteOrderDetail(Guid id);
        Task<object> GetListSanPhamByIdDonHang(Guid id, Guid userId);
        Task<object> GetListSanPhamByIdDonHangAdmin(Guid id);
    }
}
