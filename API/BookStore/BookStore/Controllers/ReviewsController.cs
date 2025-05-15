using BookStore.Models;
using BookStore.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewsService _reviewsService;

        public ReviewsController(IReviewsService reviewsService)
        {
            _reviewsService = reviewsService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return Ok(await _reviewsService.GetReviews());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(Guid id)
        {
            var review = await _reviewsService.GetReview(id);
            if (review == null) return NotFound();
            return Ok(review);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(Guid id, Review review)
        {
            var result = await _reviewsService.UpdateReview(id, review);
            if (!result) return NotFound();
            return Ok(new { status = "success" });
        }

        [HttpPost]
        public async Task<IActionResult> PostReview(Review review)
        {
            var result = await _reviewsService.AddReview(review);
            return result ? Ok(new { status = "success" }) : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var result = await _reviewsService.DeleteReview(id);
            return result ? Ok(new { status = "success" }) : NotFound();
        }

        [HttpGet("getDanhGiaVeSanPhamByAccount/{id}/{userId}/{orderId}")]
        public async Task<IActionResult> GetDanhGiaVeSanPhamByAccount(Guid id, Guid userId, Guid orderId)
        {
            var review = await _reviewsService.GetDanhGiaVeSanPhamByAccount(id, userId,orderId);
            return review != null ? Ok(review) : NotFound();
        }

        [HttpGet("getReviewByBookId/{bookId}")]
        public async Task<IActionResult> GetReviewByBookId(Guid bookId)
        {
            var review = await _reviewsService.GetReviewByBookId(bookId);
            return review != null ? Ok(review) : NotFound();
        }
    }
}
