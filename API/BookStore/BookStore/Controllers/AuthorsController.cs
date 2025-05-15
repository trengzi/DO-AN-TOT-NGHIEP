using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorsService _authorsService;
        public AuthorsController(IAuthorsService authorsService)
        {
            _authorsService = authorsService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        {
            var authors = await _authorsService.GetAuthors();
            return Ok(authors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(Guid id)
        {
            var author = await _authorsService.GetAuthor(id);
            if (author == null)
            {
                return NotFound();
            }
            return Ok(author);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(Guid id, Author author)
        {
            var result = await _authorsService.PutAuthor(id, author);
            if (!result)
            {
                return BadRequest(); // Hoặc NotFound nếu cần
            }
            return Ok(new { status = "success" });
        }

        [HttpPost]
        public async Task<ActionResult<Author>> PostAuthor(Author Author)
        {
            await _authorsService.PostAuthor(Author);

            return Ok(new {status = "success"});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(Guid id)
        {
            var res = await _authorsService.DeleteAuthor(id);
            if(res)
                return Ok(new {status = "success"});
            return Ok(new {status = "error"});
        }

        [HttpGet("GetAuthorByBookId/{bookId}")]
        public async Task<ActionResult<Author>> GetAuthorByBookId(Guid bookId)
        {
            var listAuthor = await _authorsService.GetAuthorByBookId(bookId);

            return Ok(listAuthor);
        }
    }
}
