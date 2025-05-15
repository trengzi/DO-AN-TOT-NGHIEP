using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class AuthorsService : IAuthorsService
    {
        private readonly DbBookContext _context;

        public AuthorsService(DbBookContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Author>> GetAuthors()
        {
            return await _context.Authors.OrderByDescending(x => x.Created).ToListAsync();
        }

        public async Task<Author> GetAuthor(Guid id)
        {
            return await _context.Authors.FindAsync(id);
        }

        // PUT: api/Authors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<bool> PutAuthor(Guid id, Author author)
        {
            if (id != author.Id)
            {
                return false; 
            }

            author.Created = DateTime.Now;
            _context.Entry(author).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true; 
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuthorExists(id))
                {
                    return false; 
                }
                throw; 
            }
        }

        public async Task<Author> PostAuthor(Author Author)
        {
            Author.Created = DateTime.Now;
            _context.Authors.Add(Author);
            await _context.SaveChangesAsync();

            return Author;
        }

        // DELETE: api/Authors/5
        [HttpDelete("{id}")]
        public async Task<bool> DeleteAuthor(Guid id)
        {

            var anyBookAuthor = _context.BookAuthors.Any(x => x.AuthorId == id);
            if(anyBookAuthor)
            {
                return false;
            }
            var Author = await _context.Authors.FindAsync(id);
            if (Author == null)
            {
                return false;
            }

            _context.Authors.Remove(Author);
            await _context.SaveChangesAsync();

            return true;
        }

        private bool AuthorExists(Guid id)
        {
            return _context.Authors.Any(e => e.Id == id);
        }

        public async Task<List<Guid>> GetAuthorByBookId(Guid bookId)
        {
            var bookAuthors = await _context.BookAuthors.Where(x => x.BookId == bookId).Select(x => x.AuthorId).ToListAsync();

            var listAuthor = await _context.Authors.Where(x => bookAuthors.Contains(x.Id)).Select(x => x.Id).ToListAsync();

            return listAuthor;
        }
    }
}
