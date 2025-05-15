using BookStore.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services.Interface
{
    public interface IManagersService
    {
        Task<object> GetManagerById(Guid id);
        Task<bool> UpdateManager(Guid id, Manager manager);
        Task<bool> CreateManager(Manager manager);
        Task<bool> DeleteManager(Guid id);
        Task<IEnumerable<object>> GetAllManagers();
    }
}
