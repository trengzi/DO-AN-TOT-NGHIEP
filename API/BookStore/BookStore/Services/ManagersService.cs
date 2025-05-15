using BookStore.Models;
using BookStore.Models.CustomModel;
using BookStore.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public class ManagersService : IManagersService
    {
        private readonly DbBookContext _context;
        private readonly IAuthService _authService;

        public ManagersService(DbBookContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        public async Task<object> GetManagerById(Guid id)
        {
            return await _context.Managers
                .Where(m => m.Id == id)
                .Select(m => new
                {
                    m.Id,
                    m.FullName,
                    m.Address,
                    m.Branch,
                    m.Salary,
                    m.Phone,
                    m.Email,
                    m.Created
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateManager(Guid id, Manager manager)
        {
            if (id != manager.Id)
                return false;

            manager.Created = DateTime.Now;
            _context.Entry(manager).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return _context.Managers.Any(e => e.Id == id);
            }
        }

        public async Task<bool> CreateManager(Manager manager)
        {
            var lUser = new LoginUser
            {
                UserName = manager.Email,
                Password = "Abc123!@#"
            };

            if (await _authService.RegisterManager(lUser))
            {
                manager.Created = DateTime.Now;
                _context.Managers.Add(manager);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteManager(Guid id)
        {
            var manager = await _context.Managers.FindAsync(id);
            if (manager == null)
                return false;

            var relatedEmployees = await _context.Employees.Where(e => e.ManagerId == id).ToListAsync();
            foreach (var em in relatedEmployees)
                em.ManagerId = null;

            if (await _authService.DeleteUserAndRolesAsync(manager.Email))
            {
                await _context.SaveChangesAsync();
                _context.Managers.Remove(manager);
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<IEnumerable<object>> GetAllManagers()
        {
            return await _context.Managers
                .OrderByDescending(m => m.Created)
                .Select(m => new
                {
                    m.Id,
                    m.FullName,
                    m.Address,
                    m.Branch,
                    m.Salary,
                    m.Phone,
                    m.Email,
                    m.Created
                })
                .ToListAsync();
        }
    }
}
