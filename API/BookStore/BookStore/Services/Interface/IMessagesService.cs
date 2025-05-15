using BookStore.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services.Interface
{
    public interface IMessagesService
    {
        Task<IEnumerable<Message>> GetMessages();
        Task<Message?> GetMessageById(Guid id);
        Task<bool> CreateMessage(Message message);
        Task<bool> DeleteMessage(Guid id);
    }
}
