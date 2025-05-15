using BookStore.Models;

namespace BookStore.Services
{
    public interface IUsersService
    {
        Task<IEnumerable<object>> GetUsersAsync();
        Task<object?> GetUserByIdAsync(Guid id);
        Task<bool> UpdateUserAsync(Guid id, User user);
        Task<bool> CreateUserAsync(User user);
        Task<bool> DeleteUserAsync(Guid id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<IEnumerable<object>> GetListUserForAdminSupportAsync();
      //  Task<bool> UpdateUserRoleAsync(Guid userId, int roleId);
    }
}
