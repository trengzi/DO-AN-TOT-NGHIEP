using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStore.Models;
using BookStore.Models.CustomModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using BookStore.Services;
using BookStore.Services.Interface;

namespace IdentityTest_3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly DbBookContext _context;
        private readonly TokenBlacklistService _blacklistService;
        public AuthController(IAuthService authService, UserManager<IdentityUser> userManager, DbBookContext context, TokenBlacklistService blacklistService)
        {
            _authService = authService;
            _userManager = userManager;
            _context = context;
            _blacklistService = blacklistService;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser(LoginUser user)
        {
            if(await _authService.RegisterUser(user))
            {
                return Ok(new { status = "success" });
            }
            return Ok(new {status = "error"});
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginUser user)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _authService.Login(user);
            if(result == 1)
            {
                var tokenString = await _authService.GenerateTokenStringAsync(user);
                return Ok( new {status = "success", TokenString = tokenString});
            }
            else if(result == 2)
            {
                return Ok(new {status = "lock"});
            }
            return Ok(new {status = "false"});
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] TokenModel token)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(token.token);

            if (jwtToken != null)
            {
                var expiry = jwtToken.ValidTo; // Lấy thời gian hết hạn của token
                _blacklistService.AddToBlacklist(token.token, expiry);
                return Ok(new { message = "Token added to blacklist" });
            }
            return BadRequest(new { message = "Invalid token" });
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { status = "error", message = "Dữ liệu không hợp lệ." });
            }

            // Kiểm tra người dùng hiện tại
            var user = await _authService.GetCurrentUserAsync(model.email);
            if (user == null)
            {
                return Unauthorized(new { status = "error", message = "Người dùng không xác thực." });
            }


            // Thay đổi mật khẩu
            var result = await _authService.ChangePasswordAsync(user, model.OldPass, model.NewPass);

            if (result.Succeeded)
            {
                return Ok(new { status = "success", message = "Thay đổi mật khẩu thành công." });
            }

            return Ok(new { status = "error", message = "Thay đổi mật khẩu không thành công." });
        }

        [HttpGet("CheckEmail/{email}")]
        public async Task<IActionResult> CheckEmail (string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
    
            if (user != null)
            {
                return Ok(new { status = "error", message = "Email already exists." });
            }

            return Ok(new {  status = "success", message = "Email is available." });
        }

        [HttpGet("lockUser/{email}")]
        public async Task<IActionResult> LockUser (string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
    
            if (user == null)
            {
                return Ok(new { status = "error", message = "Không tìm thấy tài khoản" });
            }

            user.LockoutEnd = DateTimeOffset.MaxValue;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { status = "success", message = "User account locked permanently." });
            }
            return Ok(new { status = "error", message = "lock fail" });
        }

        [HttpGet("unlockUser/{email}")]
        public async Task<IActionResult> UnlockUser (string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
    
            if (user == null)
            {
                return Ok(new { status = "error", message = "Không tìm thấy tài khoản" });
            }

            user.LockoutEnd = null;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { status = "success", message = "User account unlocked permanently." });
            }
            return Ok(new { status = "error", message = "unlock fail" });
        }

        [HttpPost("AdminLogin")]
        public async Task<IActionResult> AdminLogin(LoginUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { status = "invalid_model" });
            }

            var result = await _authService.Login(user);

            if (result == 1)
            {
                var identityUser = await _userManager.FindByEmailAsync(user.UserName);

                if (identityUser == null)
                {
                    return Unauthorized(new { status = "user_not_found" });
                }

                var isAdmin = await _userManager.IsInRoleAsync(identityUser, "Admin");

                if (isAdmin)
                {
                    
                    var tokenString = await _authService.GenerateTokenStringAsync(user);
                    return Ok(new { status = "success", TokenString = tokenString, Role="Admin" });
                }

                var manager = await _userManager.IsInRoleAsync(identityUser, "Manager");
                var curManager = await _context.Managers.FirstOrDefaultAsync(x => x.Email == identityUser.Email);
                if (manager)
                {
                    var tokenString = await _authService.GenerateTokenStringAsync(user);
                    return Ok(new { status = "success", TokenString = tokenString, Role="Manager", EmployeeId = curManager?.Id });
                }

                var isEmployee = await _userManager.IsInRoleAsync(identityUser, "Employee");

                if (isEmployee)
                {
                    var curEmployee = await _context.Employees.FirstOrDefaultAsync(x => x.Email == identityUser.Email);
                    var tokenString = await _authService.GenerateTokenStringAsync(user);
                    return Ok(new { status = "success", TokenString = tokenString, Role="Employee", EmployeeId = curEmployee?.Id });
                }
                return Ok(new { status = "not_allow" });
                
            }
            else if (result == 2)
            {
                return Ok(new { status = "lock" });
            }

            return Ok(new { status = "Unauthorized" });
        }

        [HttpPost("checkBlackList")]
        public IActionResult CheckBlacklist([FromBody] TokenModel token)
        {
            if (_blacklistService.IsTokenBlacklisted(token.token))
            {
                return Ok(new { status = true });
            }
            return Ok(new { status = false });
        }

    }
}
