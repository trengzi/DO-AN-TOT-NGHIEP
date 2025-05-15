using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public class PublishersService : IPublishersService
    {
        private readonly DbBookContext _context;

        public PublishersService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Publisher>> GetPublishers()
        {
            return await _context.Publishers.OrderByDescending(x => x.Created).ToListAsync();
        }

        public async Task<Publisher?> GetPublisherById(Guid id)
        {
            return await _context.Publishers.FindAsync(id);
        }

        public async Task<bool> CreatePublisher(Publisher publisher)
        {
            publisher.Created = DateTime.UtcNow;
            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePublisher(Publisher publisher)
        {
            _context.Entry(publisher).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }

        public async Task<string> DeletePublisher(Guid id)
        {
            bool hasBooks = _context.Books.Any(x => x.PublisherId == id);
            if (hasBooks) return "exist";

            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null) return "notfound";

            _context.Publishers.Remove(publisher);
            await _context.SaveChangesAsync();
            return "success";
        }
    }
}
