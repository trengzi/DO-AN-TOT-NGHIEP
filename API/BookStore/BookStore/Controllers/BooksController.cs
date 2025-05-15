using BookStore.Models;
using BookStore.Models.CustomModel;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static System.Reflection.Metadata.BlobBuilder;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBooksService _booksService;
        private readonly DbBookContext _context;

        public BooksController(IBooksService booksService, DbBookContext context)
        {
            _booksService = booksService;
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var res = await _booksService.GetBooks();
            if (!res.Any())
            {
                return NotFound();
            }

            return Ok(res);
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(Guid id)
        {
            var res = await _booksService.GetBook(id);
            return Ok(res);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(Guid id, Book Book)
        {
            var res = _booksService.PutBook(id, Book);
            if(res != null && res.Result)
                return Ok(new {status = "success"});
            return BadRequest();
            
        }

        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book Book)
        {
            var res = await _booksService.PostBook(Book);

            return CreatedAtAction("GetBook", new { id = Book.Id }, Book);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var res = _booksService.DeleteBook(id);
            if(res != null && res.Result)
                return NoContent();
            return NotFound();
            
        }

        private bool BookExists(Guid id)
        {
            return _context.Books.Any(e => e.Id == id);
        }


        [HttpGet("get10NewestBook")]
        public async Task<ActionResult<Book>> Get10NewestBook()
        {
            var res = await _booksService.Get10NewestBook();

            return Ok(res);
        }

        [HttpGet("get3HighestReviewBook")]
        public async Task<ActionResult<Book>> get3HighestReviewBook()
        {
            var res = await _booksService.get3HighestReviewBook();
            return Ok(res);
     
        }

        [HttpGet("get3SanPhamTuan")]
        public async Task<ActionResult<Book>> get3SanPhamTuan()
        {
            var res = await _booksService.get3SanPhamTuan();
            return Ok(res);
            
        }

        [HttpGet("get3SanPhamThang")]
        public async Task<ActionResult<Book>> get3SanPhamThang()
        {
            var res = await _booksService.get3SanPhamThang();
            return Ok(res);
        }


        [HttpGet("getAllSanPhamWithFilter/{keyword}/{categoryId}/{rangeFrom}/{rangeTo}/{order}/{page}")]
        public async Task<ActionResult<Book>> getAllSanPhamWithFilter(string keyword, Guid categoryId, int rangeFrom, int rangeTo, int order, int page)
        {
            var res = await _booksService.getAllSanPhamWithFilter(keyword, categoryId, rangeFrom, rangeTo, order, page);
            return Ok(res);
        }

        [HttpGet("getCategory20Book/{id}")]
        public async Task<ActionResult<IEnumerable<Book>>> getCategory20Book(Guid id)
        {
            var res = await _booksService.getCategory20Book(id);
            return Ok(res);
        }

        [HttpGet("getAllSanPhamyeuThich/{userId}")]
        public async Task<ActionResult<IEnumerable<Book>>> GetAllSanPhamYeuThich(Guid userId)
        {
            var res = await _booksService.GetAllSanPhamYeuThich(userId);
            return Ok(res);
        }

        [HttpDelete("xoaSanPhamYeuThich/{bookId}/{userId}")]
        public async Task<IActionResult> XoaSanPhamYeuThich(Guid bookId, Guid userId)
        {
            var res = await _booksService.XoaSanPhamYeuThich(bookId, userId);
            if(res)
                return Ok(NoContent());
            return NotFound();
            
        }

        [HttpPost("postYeuThich")]
        public async Task<ActionResult<Book>> PostYeuThich(Wishlist wishlist)
        {
            var res = await _booksService.PostYeuThich(wishlist);
            if(res)
                return Ok();
            return BadRequest();
        }

        [HttpGet("checkYeuThich/{bookId}/{userId}")]
        public async Task<ActionResult<Book>> checkYeuThich(Guid bookId, Guid userId)
        {
            var res = await _booksService.checkYeuThich(bookId, userId);
            return Ok(res);
        }

        [HttpPut("update-products")]
        public async Task<IActionResult> UpdateProducts([FromBody] List<ProductUpdateDto> products)
        {
            var res = await _booksService.UpdateProducts(products);
            if (res == 0)
                return BadRequest("No products provided.");
            if (res == 1)
                return NotFound($"Product not found.");
            return Ok("Products updated successfully.");
        }

        [HttpGet("getAllSanPhamSearch/{keyword}/{page}")]
        public async Task<ActionResult<Book>> GetAllSanPhamSearch(string keyword, int page)
        {
            var res = await _booksService.GetAllSanPhamSearch(keyword, page);
            return Ok(res);
        }

        [HttpGet("GetBookByIdToUpdate/{id}")]
        public async Task<ActionResult<Book>> GetBookByIdToUpdate(Guid id)
        {
            var res = await _booksService.GetBookByIdToUpdate(id);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpGet("checkSoLuong/{bookId}/{quantity}")]
        public async Task<ActionResult<Book>> CheckSoLuong(Guid bookId, int quantity)
        {
            var res = await _booksService.CheckSoLuong(bookId, quantity);
            if (res == null)
                return NotFound();
            return Ok(res);
        }


        [HttpPost("checkSoLuongMany")]
        public async Task<ActionResult<Book>> CheckSoLuongMany([FromBody] List<CheckBookModel> books)
        {
            var res = await _booksService.CheckSoLuongMany(books);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

    }
}
