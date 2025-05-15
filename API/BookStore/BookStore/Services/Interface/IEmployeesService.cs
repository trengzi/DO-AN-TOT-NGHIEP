using BookStore.Models;
using BookStore.Models.CustomModel;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Services.Interface
{
    public interface IEmployeesService
    {
        Task<object> GetEmployeeById(Guid id);
        Task<bool> UpdateEmployee(Guid id, Employee employee);
        Task<bool> CreateEmployee(Employee employee);
        Task<bool> DeleteEmployee(Guid id);
    }
}
