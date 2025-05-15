using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BookAuthorStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookAuthorsController : ControllerBase
    {
        private readonly IBookAuthorsService _bookAuthorsService;

        public BookAuthorsController(IBookAuthorsService bookAuthorsService)
        {
            _bookAuthorsService = bookAuthorsService;
        }

        // GET: api/BookAuthors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookAuthor>>> GetBookAuthors()
        {
            var bookAuthors = await _bookAuthorsService.GetBookAuthors();
            return Ok(bookAuthors);
        }

        // GET: api/BookAuthors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookAuthor>> GetBookAuthor(Guid id)
        {
            var BookAuthor = await _bookAuthorsService.GetBookAuthor(id);

            if (BookAuthor == null)
            {
                return NotFound();
            }

            return BookAuthor;
        }

        // PUT: api/BookAuthors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookAuthor(Guid id, BookAuthor BookAuthor)
        {
            var res = await _bookAuthorsService.PutBookAuthor(id, BookAuthor);

            if (res)
                return NoContent();
            return BadRequest();

        }

        // POST: api/BookAuthors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BookAuthor>> PostBookAuthor(BookAuthor bookAuthor)
        {
             var createdBookAuthor = await _bookAuthorsService.PostBookAuthor(bookAuthor);
            return CreatedAtAction(nameof(GetBookAuthor), new { id = createdBookAuthor.Id }, createdBookAuthor);
        }

        [HttpPost("postRange")]
        public async Task<IActionResult> PostBookAuthors([FromBody] List<BookAuthor> bookAuthors)
        {

            var res = await _bookAuthorsService.PostBookAuthors(bookAuthors);
            if (!res)
                return BadRequest("Dữ liệu không hợp lệ.");

            return Ok(new { message = "Thêm tác giả cho sách thành công!" });
        }

        [HttpDelete("deleteByBookId/{bookId}")]
        public async Task<IActionResult> DeleteBookAuthors(Guid bookId)
        {
            var res = await _bookAuthorsService.DeleteBookAuthors(bookId);
            
            if (!res)
                return BadRequest("Sách cần xóa không hợp lệ.");

            return Ok(new { status = "success", message = "Xóa thành công!" });
        }

        // DELETE: api/BookAuthors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookAuthor(Guid id)
        {
            var res = await _bookAuthorsService.DeleteBookAuthor(id);
            if (!res)
            {
                return NotFound();
            }
            return NoContent();
        }


        [HttpPut("UpdateAuthorsForBook/{bookId}")]
        public async Task<IActionResult> UpdateAuthorsForBook(Guid bookId, [FromBody] List<Guid?> authorIds)
        {
            var res = await _bookAuthorsService.UpdateAuthorsForBook(bookId, authorIds);

            if(res)
                return Ok(new { Status = "success", Message = "Danh sách tác giả đã được cập nhật thành công." });
            return BadRequest();
        }
    }
}
