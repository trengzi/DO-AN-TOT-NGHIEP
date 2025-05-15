using BookStore.Models;

public interface ICategoriesService
{
    Task<IEnumerable<object>> GetCategoriesAsync();
    Task<Category> GetCategoryByIdAsync(Guid id);
    Task<bool> UpdateCategoryAsync(Guid id, Category category);
    Task<bool> AddCategoryAsync(Category category);
    Task<string> DeleteCategoryAsync(Guid id);
}
