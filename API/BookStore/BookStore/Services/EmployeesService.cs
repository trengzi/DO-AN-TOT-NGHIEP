using BookStore.Models;
using BookStore.Models.CustomModel;
using BookStore.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Services
{
    public class EmployeesService : IEmployeesService
    {
        private readonly DbBookContext _context;
        private readonly IAuthService _authService;

        public EmployeesService(DbBookContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        public async Task<object> GetEmployeeById(Guid id)
        {
            return await _context.Employees
                .Where(em => em.Id == id)
                .Select(em => new
                {
                    em.Id,
                    em.HiredDate,
                    em.FullName,
                    em.Address,
                    em.Phone,
                    em.Salary,
                    em.ManagerId,
                    em.Email,
                    em.Created,
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateEmployee(Guid id, Employee employee)
        {
            if (id != employee.Id)
                return false;

            employee.Created = DateTime.Now;
            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return _context.Employees.Any(e => e.Id == id);
            }
        }

        public async Task<bool> CreateEmployee(Employee employee)
        {
            var lUser = new LoginUser
            {
                UserName = employee.Email,
                Password = "Abc123!@#"
            };

            if (await _authService.RegisterEmployee(lUser))
            {
                employee.Created = DateTime.Now;
                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteEmployee(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return false;

            var relatedOrders = await _context.Orders.Where(o => o.EmployeeId == id).ToListAsync();
            foreach (var order in relatedOrders)
                order.EmployeeId = null;

            if (await _authService.DeleteUserAndRolesAsync(employee.Email))
            {
                await _context.SaveChangesAsync();
                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}
