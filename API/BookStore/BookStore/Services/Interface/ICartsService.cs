using BookStore.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public interface ICartsService
    {
        Task<IEnumerable<Cart>> GetCarts();
        Task<Cart> GetCart(Guid id);
        Task<bool> UpdateCart(Guid id, Cart cart);
        Task<bool> DeleteCart(Guid id);
        Task<bool> CartExists(Guid id);
        Task<object> AddToCart(Cart cart);
        Task<object> GetSanPhamTrongGioHang(Guid userId);
        Task<bool> ClearCart(Guid userId);
    }
}
