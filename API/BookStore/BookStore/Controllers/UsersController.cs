using BookStore.DTOs;
using BookStore.Models;
using BookStore.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService userService)
        {
            _usersService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _usersService.GetUsersAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var result = await _usersService.GetUserByIdAsync(id);
            return result != null ? Ok(result) : NotFound();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(Guid id, User user)
        {
            var success = await _usersService.UpdateUserAsync(id, user);
            return success ? NoContent() : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> PostUser(User user)
        {
            var success = await _usersService.CreateUserAsync(user);
            return success ? Ok(new { status = "success" }) : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var success = await _usersService.DeleteUserAsync(id);
            return success ? NoContent() : NotFound();
        }

        [HttpGet("getUserByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var result = await _usersService.GetUserByEmailAsync(email);
            return result != null ? Ok(result) : NotFound();
        }

        [HttpGet("getlistuserforadminsupport")]
        public async Task<IActionResult> GetListUserForAdminSupport()
        {
            var result = await _usersService.GetListUserForAdminSupportAsync();
            return Ok(result);
        }
        //[HttpPost("update-role")]
        //public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleDto dto)
        //{
        //    var success = await _usersService.UpdateUserRoleAsync(dto.UserId, dto.Role);
        //    return success
        //        ? Ok(new { status = "success", message = "Cập nhật vai trò thành công" })
        //        : NotFound(new { status = "error", message = "Người dùng không tồn tại" });
        //}
    }
}
