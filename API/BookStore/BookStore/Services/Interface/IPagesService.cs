using BookStore.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services.Interface
{
    public interface IPagesService
    {
        Task<IEnumerable<Page>> GetPages();
        Task<Page?> GetPageById(Guid id);
        Task<bool> CreatePage(Page page);
    }
}
