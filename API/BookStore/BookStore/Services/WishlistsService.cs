using BookStore.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class WishlistsService : IWishlistsService
    {
        private readonly DbBookContext _context;

        public WishlistsService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Wishlist>> GetWishlists()
        {
            return await _context.Wishlists.ToListAsync();
        }

        public async Task<Wishlist?> GetWishlistById(Guid id)
        {
            return await _context.Wishlists.FindAsync(id);
        }

        public async Task<bool> UpdateWishlist(Wishlist wishlist)
        {
            _context.Entry(wishlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return _context.Wishlists.Any(e => e.Id == wishlist.Id);
            }
        }

        public async Task CreateWishlist(Wishlist wishlist)
        {
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteWishlist(Guid id)
        {
            var wishlist = await _context.Wishlists.FindAsync(id);
            if (wishlist == null)
            {
                return false;
            }

            _context.Wishlists.Remove(wishlist);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
