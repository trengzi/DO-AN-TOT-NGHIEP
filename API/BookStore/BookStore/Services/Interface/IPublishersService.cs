using BookStore.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services.Interface
{
    public interface IPublishersService
    {
        Task<IEnumerable<Publisher>> GetPublishers();
        Task<Publisher?> GetPublisherById(Guid id);
        Task<bool> CreatePublisher(Publisher publisher);
        Task<bool> UpdatePublisher(Publisher publisher);
        Task<string> DeletePublisher(Guid id);
    }
}
