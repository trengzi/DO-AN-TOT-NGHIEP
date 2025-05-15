using BookStore.Enum;
using BookStore.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services.Interface
{
    public interface IOrdersService
    {
        public Task<IEnumerable<Order>> GetOrders();

        public Task<object> GetOrdersAdmin(int page);
       
        public Task<object> GetOrder(Guid id);

        public Task<int> PutOrder(Guid id, Order Order);

        public Task<bool> PostOrder(Order Order);

        public Task<bool> DeleteOrder(Guid id);

        public Task<object> getListDonHangByAccountId(Guid id);


        public Task<int> HuyDonHang(Guid id, Order Order);

        public Task<object> ChangeStatusUp(Guid id);

        public Task<object> ChangeStatusDown(Guid id);

        public Task<IEnumerable<object>> GetAllEmployee();

        public Task<IEnumerable<object>> GetAllEmployee(Guid managerId);

        public Task<object> SetEmployeeForOrder(Guid orderId, Guid employeeId);

        public Task<IEnumerable<Order>> getAllOrderByEmployeeId(Guid employeeId);
        
    }
}
