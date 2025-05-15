using BookStore.Models;
using BookStore.Models.CustomModel;
using Microsoft.AspNetCore.Identity;

namespace BookStore.Services.Interface
{
    public interface IAuthService
    {
        Task<string> GenerateTokenStringAsync(LoginUser user);
        Task<int> Login(LoginUser user);
        Task<bool> RegisterUser(LoginUser user);

        Task<bool> RegisterEmployee(LoginUser user);

        Task<bool> RegisterManager(LoginUser user);

        Task<IdentityUser> GetCurrentUserAsync(string email);
        Task<IdentityResult> ChangePasswordAsync(IdentityUser user, string currentPassword, string newPassword);

        Task<bool> DeleteUserAndRolesAsync(string email);
    }
}