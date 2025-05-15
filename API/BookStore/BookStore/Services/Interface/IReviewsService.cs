using BookStore.Models;

namespace BookStore.Services
{
    public interface IReviewsService
    {
        Task<IEnumerable<Review>> GetReviews();
        Task<Review?> GetReview(Guid id);
        Task<bool> UpdateReview(Guid id, Review review);
        Task<bool> AddReview(Review review);
        Task<bool> DeleteReview(Guid id);
        Task<object?> GetDanhGiaVeSanPhamByAccount(Guid id, Guid userId, Guid orderId);
        Task<object?> GetReviewByBookId(Guid bookId);
    }
}
