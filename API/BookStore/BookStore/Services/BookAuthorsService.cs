using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class BookAuthorsService : IBookAuthorsService
    {
        public BookAuthorsService(DbBookContext context)
        {
            _context = context;
        }

        private readonly DbBookContext _context;

        // GET: api/BookAuthors
        public async Task<IEnumerable<BookAuthor>> GetBookAuthors()
        {
            return await _context.BookAuthors.ToListAsync();
        }

        public async Task<BookAuthor> GetBookAuthor(Guid id)
        {
            return await _context.BookAuthors.FindAsync(id);
        }

        public async Task<bool> PutBookAuthor(Guid id, BookAuthor BookAuthor)
        {
            if (id != BookAuthor.Id)
            {
                return false;
            }

            _context.Entry(BookAuthor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookAuthorExists(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<BookAuthor> PostBookAuthor(BookAuthor BookAuthor)
        {
            _context.BookAuthors.Add(BookAuthor);
            await _context.SaveChangesAsync();
            return BookAuthor;
        }

        public async Task<bool> PostBookAuthors([FromBody] List<BookAuthor> bookAuthors)
        {
            if (bookAuthors == null || !bookAuthors.Any())
            {
                return false;
            }

            var entities = bookAuthors.Select(dto => new BookAuthor
            {
                BookId = dto.BookId,
                AuthorId = dto.AuthorId
            }).ToList();

            await _context.BookAuthors.AddRangeAsync(entities);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteBookAuthors(Guid bookId)
        {
            if (bookId == null)
            {
                return false;
            }

            var recordsToDelete = await _context.BookAuthors
                .Where(ba => ba.BookId == bookId)
                .ToListAsync();

            if (!recordsToDelete.Any())
            {
                return false;
            }

            _context.BookAuthors.RemoveRange(recordsToDelete);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteBookAuthor(Guid id)
        {
            var BookAuthor = await _context.BookAuthors.FindAsync(id);
            if (BookAuthor == null)
            {
                return false;
            }

            _context.BookAuthors.Remove(BookAuthor);
            await _context.SaveChangesAsync();

            return true;
        }

        private bool BookAuthorExists(Guid id)
        {
            return _context.BookAuthors.Any(e => e.Id == id);
        }

        public async Task<bool> UpdateAuthorsForBook(Guid bookId, List<Guid?> authorIds)
        {
            var existingAuthors = await _context.BookAuthors
                .Where(x => x.BookId == bookId)
                .ToListAsync();

            var existingAuthorIds = existingAuthors.Select(x => x.AuthorId).ToList();

            var authorsToRemove = existingAuthors
                .Where(x => !authorIds.Contains(x.AuthorId))
                .ToList();

            if (authorsToRemove.Any())
            {
                _context.BookAuthors.RemoveRange(authorsToRemove);
            }

            var authorsToAdd = authorIds
                .Where(x => !existingAuthorIds.Contains(x))
                .Select(authorId => new BookAuthor
                {
                    BookId = bookId,
                    AuthorId = authorId
                }).ToList();

            if (authorsToAdd.Any())
            {
                await _context.BookAuthors.AddRangeAsync(authorsToAdd);
            }

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
