using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public class MessagesService : IMessagesService
    {
        private readonly DbBookContext _context;

        public MessagesService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetMessages()
        {
            return await _context.Messages.ToListAsync();
        }

        public async Task<Message?> GetMessageById(Guid id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<bool> CreateMessage(Message message)
        {
            message.Created = DateTime.Now;
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMessage(Guid id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
                return false;

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
