using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeesService _employeesService;

        public EmployeesController(IEmployeesService employeeService)
        {
            _employeesService = employeeService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(Guid id)
        {
            var employee = await _employeesService.GetEmployeeById(id);
            return employee != null ? Ok(employee) : NotFound();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(Guid id, Employee employee)
        {
            return await _employeesService.UpdateEmployee(id, employee)
                ? Ok(new { status = "success" })
                : BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> PostEmployee(Employee employee)
        {
            return await _employeesService.CreateEmployee(employee)
                ? Ok(new { status = "success" })
                : Ok(new { status = "error" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            return await _employeesService.DeleteEmployee(id)
                ? Ok(new { status = "success" })
                : Ok(new { status = "error" });
        }
    }
}
