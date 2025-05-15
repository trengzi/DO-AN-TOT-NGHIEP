using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagersController : ControllerBase
    {
        private readonly IManagersService _managersService;

        public ManagersController(IManagersService managerService)
        {
            _managersService = managerService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetManager(Guid id)
        {
            var manager = await _managersService.GetManagerById(id);
            return manager != null ? Ok(manager) : NotFound();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutManager(Guid id, Manager manager)
        {
            return await _managersService.UpdateManager(id, manager)
                ? Ok(new { status = "success" })
                : BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> PostManager(Manager manager)
        {
            return await _managersService.CreateManager(manager)
                ? Ok(new { status = "success" })
                : Ok(new { status = "error" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManager(Guid id)
        {
            return await _managersService.DeleteManager(id)
                ? Ok(new { status = "success" })
                : Ok(new { status = "error" });
        }

        [HttpGet("getAllManager")]
        public async Task<IActionResult> GetAllManager()
        {
            var managers = await _managersService.GetAllManagers();
            return Ok(managers);
        }
    }
}
