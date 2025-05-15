using BookStore.Models;

namespace BookStore.Services
{
    public interface IWishlistsService
    {
        Task<IEnumerable<Wishlist>> GetWishlists();
        Task<Wishlist?> GetWishlistById(Guid id);
        Task<bool> UpdateWishlist(Wishlist wishlist);
        Task CreateWishlist(Wishlist wishlist);
        Task<bool> DeleteWishlist(Guid id);
    }
}
