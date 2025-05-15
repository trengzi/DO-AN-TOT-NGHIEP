using BookStore.Models;
using BookStore.Models.CustomModel;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdentityTest_3.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly IConfiguration _configuration;

        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly DbBookContext _context;

        public AuthService(UserManager<IdentityUser> userManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager, DbBookContext context)
        {
            _userManager = userManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _context = context;
        }
        public async Task<bool> RegisterUser(LoginUser user)
        {
            var identityUser = new IdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName
            };
            var result = await _userManager.CreateAsync(identityUser, user.Password);
            if (result.Succeeded)
            {
                var role = await _roleManager.FindByNameAsync("User");
                if (role != null)
                {
                    var roleResult = await _userManager.AddToRoleAsync(identityUser, role.Name);
                    return roleResult.Succeeded;
                }
            }
    
            return false;
        }

        public async Task<bool> RegisterEmployee(LoginUser user)
        {
            var identityUser = new IdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName
            };

            var result = await _userManager.CreateAsync(identityUser, user.Password);
            if (result.Succeeded)
            {
                var role = await _roleManager.FindByNameAsync("Employee");
                if (role != null)
                {
                    var roleResult = await _userManager.AddToRoleAsync(identityUser, role.Name);
                    return roleResult.Succeeded;
                }
            }

            return false;
        }

        public async Task<bool> RegisterManager(LoginUser user)
        {
            var identityUser = new IdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName
            };
            var result = await _userManager.CreateAsync(identityUser, user.Password);
            if (result.Succeeded)
            {
                var role = await _roleManager.FindByNameAsync("Manager");
                if (role != null)
                {
                    var roleResult = await _userManager.AddToRoleAsync(identityUser, role.Name);
                    return roleResult.Succeeded;
                }
            }
    
            return false;
        }

        public async Task<int> Login(LoginUser user)
        {
            var identityUser = await _userManager.FindByEmailAsync(user.UserName);
            if(identityUser == null)
            {
                return 0;
            }
            if (identityUser.LockoutEnd != null && identityUser.LockoutEnd > DateTimeOffset.Now)
            {
                return 2; 
            }
            var ck = await _userManager.CheckPasswordAsync(identityUser, user.Password);
            return ck ? 1 : 0;
        }

        public async Task<string> GenerateTokenStringAsync(LoginUser user)
        {

            var us = _context.Users.FirstOrDefault(x => x.Email == user.UserName);
            var usidentity = await _userManager.FindByEmailAsync(user.UserName);
            if (usidentity == null)
            {
                return null;
            }
            var roles = await _userManager.GetRolesAsync(usidentity);
            IEnumerable<System.Security.Claims.Claim> claims = new List<Claim> 
            { 
                new Claim("Email", user.UserName),
                new Claim("Role", string.Join(",", roles)),
                new Claim("FullName", us == null ? "" : us.FullName),
                new Claim("UserId", us == null ? "" : us.Id.ToString()),
            };

            SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt:Key").Value));

            SigningCredentials signingCred = new SigningCredentials(securityKey,SecurityAlgorithms.HmacSha256Signature);

            SecurityToken securityToken = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                issuer: _configuration.GetSection("Jwt:Issuer").Value,
                audience: _configuration.GetSection("Jwt:Audience").Value,
                signingCredentials: signingCred
                );

            string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return tokenString;
        }

        //public AuthService(UserManager<IdentityUser> userManager, IHttpContextAccessor httpContextAccessor)
        //{
        //    _userManager = userManager;
        //    _httpContextAccessor = httpContextAccessor;
        //}

        public async Task<IdentityUser> GetCurrentUserAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<IdentityResult> ChangePasswordAsync(IdentityUser user, string currentPassword, string newPassword)
        {
            return await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        }


        public async Task<bool> DeleteUserAndRolesAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return false; 
            }

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                var roleResult = await _userManager.RemoveFromRoleAsync(user, role);
                if (!roleResult.Succeeded)
                {
                    return false;
                }
            }

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
    }
}
