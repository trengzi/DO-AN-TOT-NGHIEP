using BookStore.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public class CartsService : ICartsService
    {
        private readonly DbBookContext _context;

        public CartsService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cart>> GetCarts()
        {
            return await _context.Carts.ToListAsync();
        }

        public async Task<Cart> GetCart(Guid id)
        {
            return await _context.Carts.FindAsync(id);
        }

        public async Task<bool> UpdateCart(Guid id, Cart cart)
        {
            var existingCart = await _context.Carts.FirstOrDefaultAsync(x => x.UserId == id);
            if (existingCart == null) return false;

            existingCart.IdsItem = cart.IdsItem;
            _context.Entry(existingCart).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCart(Guid id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart == null) return false;

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CartExists(Guid id)
        {
            return await _context.Carts.AnyAsync(e => e.UserId == id);
        }

        public async Task<object> AddToCart(Cart cart)
        {
            var findUser = await _context.Carts.FirstOrDefaultAsync(x => x.UserId == cart.UserId);
            if (findUser == null)
            {
                var items = new List<Item>();
                if (!string.IsNullOrEmpty(cart.IdsItem))
                {
                    var newItem = JsonConvert.DeserializeObject<Item>(cart.IdsItem);
                    items.Add(newItem);
                }
                cart.IdsItem = JsonConvert.SerializeObject(items);
                _context.Carts.Add(cart);
            }
            else
            {
                var idsItem = !string.IsNullOrEmpty(findUser.IdsItem)
                    ? JsonConvert.DeserializeObject<List<Item>>(findUser.IdsItem)
                    : new List<Item>();

                if (cart.IdsItem != null)
                {
                    var newItem = JsonConvert.DeserializeObject<Item>(cart.IdsItem);
                    var existingItem = idsItem.FirstOrDefault(item => item.BookId == newItem.BookId);
                    if (existingItem != null)
                    {
                        existingItem.Soluong = newItem.Soluong;
                    }
                    else
                    {
                        idsItem.Add(newItem);
                    }
                }

                findUser.IdsItem = JsonConvert.SerializeObject(idsItem);
                _context.Carts.Update(findUser);
            }

            await _context.SaveChangesAsync();
            return new { Status = "success" };
        }

        public async Task<object> GetSanPhamTrongGioHang(Guid userId)
        {
            var strItems = await _context.Carts.Where(x => x.UserId == userId).Select(x => x.IdsItem).FirstOrDefaultAsync();
            if (strItems == null) return null;

            var listItem = JsonConvert.DeserializeObject<List<Item>>(strItems);
            if (listItem == null) return null;

            var idsItem = listItem.Select(item => item.BookId).ToArray();
            var books = await _context.Books.Where(bk => idsItem.Contains(bk.Id)).ToListAsync();

            var result = books.Select(book => new
            {
                Book = book,
                SoLuong = listItem.FirstOrDefault(item => item.BookId == book.Id)?.Soluong ?? 0
            }).ToList();

            foreach (var item in books)
            {
                item.ImageUrls = item.ImageUrls.Split(",")[0];
            }

            return result;
        }

        public async Task<bool> ClearCart(Guid userId)
        {
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null) return false;

            cart.IdsItem = null;
            await _context.SaveChangesAsync();
            return true;
        }

        public class Item
        {
            public Guid BookId { get; set; }
            public int Soluong { get; set; }
        }
    }
}
