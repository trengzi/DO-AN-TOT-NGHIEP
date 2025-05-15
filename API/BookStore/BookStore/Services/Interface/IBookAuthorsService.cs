using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services.Interface
{
    public interface IBookAuthorsService
    {
        public Task<IEnumerable<BookAuthor>> GetBookAuthors();
        public Task<BookAuthor> GetBookAuthor(Guid id);
        public Task<bool> PutBookAuthor(Guid id, BookAuthor BookAuthor);
        public Task<BookAuthor> PostBookAuthor(BookAuthor BookAuthor);

        public Task<bool> PostBookAuthors([FromBody] List<BookAuthor> bookAuthors);

        public Task<bool> DeleteBookAuthors(Guid bookId);

        public Task<bool> DeleteBookAuthor(Guid id);

        public Task<bool> UpdateAuthorsForBook(Guid bookId, List<Guid?> authorIds);
    }
}
