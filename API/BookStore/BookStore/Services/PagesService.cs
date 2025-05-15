using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public class PagesService : IPagesService
    {
        private readonly DbBookContext _context;

        public PagesService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Page>> GetPages()
        {
            return await _context.Pages.ToListAsync();
        }

        public async Task<Page?> GetPageById(Guid id)
        {
            return await _context.Pages.FindAsync(id);
        }

        public async Task<bool> CreatePage(Page page)
        {
            page.Created = DateTime.Now;
            _context.Pages.Add(page);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
