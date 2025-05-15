using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Services.Interface
{
    public interface IAuthorsService
    {
        public Task<IEnumerable<Author>> GetAuthors();
        public Task<Author> GetAuthor(Guid id);
        public Task<bool> PutAuthor(Guid id, Author author);
        public Task<Author> PostAuthor(Author Author);
        public Task<bool> DeleteAuthor(Guid id);
        public Task<List<Guid>> GetAuthorByBookId(Guid bookId);
    }
}
