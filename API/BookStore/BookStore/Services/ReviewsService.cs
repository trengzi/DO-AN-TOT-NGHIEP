using BookStore.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class ReviewsService : IReviewsService
    {
        private readonly DbBookContext _context;

        public ReviewsService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Review>> GetReviews()
        {
            return await _context.Reviews.ToListAsync();
        }

        public async Task<Review?> GetReview(Guid id)
        {
            return await _context.Reviews.FindAsync(id);
        }

        public async Task<bool> UpdateReview(Guid id, Review review)
        {
            if (id != review.Id) return false;

            _context.Entry(review).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return _context.Reviews.Any(e => e.Id == id);
            }
        }

        public async Task<bool> AddReview(Review review)
        {
            review.Created = DateTime.Now;
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteReview(Guid id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object?> GetDanhGiaVeSanPhamByAccount(Guid bookId, Guid userId, Guid orderId)
        {
            var reviews = await (from rv in _context.Reviews
                                 join user in _context.Users on rv.UserId equals user.Id
                                 join bk in _context.Books on rv.BookId equals bk.Id
                                 where rv.UserId == userId
                                     && rv.BookId == bookId
                                     && rv.OrderId == orderId // thêm dòng này
                                 select new
                                 {
                                     rv.Created,
                                     bk.Code,
                                     bk.Title,
                                     rv.Stars,
                                     user.FullName,
                                     userId = user.Id,
                                     rv.Comment,
                                     bk.ImageUrls,
                                 }).ToListAsync();

            return reviews.Any() ? reviews : null;
        }

        public async Task<object?> GetReviewByBookId(Guid bookId)
        {
            var reviews = await (from rv in _context.Reviews
                                 join user in _context.Users on rv.UserId equals user.Id
                                 join bk in _context.Books on rv.BookId equals bk.Id
                                 where rv.BookId == bookId
                                 orderby rv.Created descending
                                 select new
                                 {
                                     rv.Created,
                                     user.FullName,
                                     rv.Comment,
                                     rv.Stars,
                                 }).ToListAsync();

            return reviews.Any() ? reviews : null;
        }

    }
}
