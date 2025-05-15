using BookStore.Models;
using Microsoft.EntityFrameworkCore;

public class CategoriesService : ICategoriesService
{
    private readonly DbBookContext _context;

    public CategoriesService(DbBookContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<object>> GetCategoriesAsync()
    {
        return await (from ct in _context.Categories
                      join bk in _context.Books on ct.Id equals bk.CategoryId into bk2
                      from bk in bk2.DefaultIfEmpty()
                      group bk.Id by new { ct.Id, ct.Name, ct.Created } into grouped
                      orderby grouped.Key.Created descending
                      select new
                      {
                          grouped.Key.Id,
                          grouped.Key.Name,
                          bookNumber = grouped.Count(x => x != null)
                      }).ToListAsync();
    }

    public async Task<Category> GetCategoryByIdAsync(Guid id)
    {
        return await _context.Categories.FindAsync(id);
    }

    public async Task<bool> UpdateCategoryAsync(Guid id, Category category)
    {
        if (id != category.Id)
            return false;

        category.Created = DateTime.Now;
        _context.Entry(category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }
    }

    public async Task<bool> AddCategoryAsync(Category category)
    {
        category.Created = DateTime.Now;
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string> DeleteCategoryAsync(Guid id)
    {
        if (_context.Books.Any(x => x.CategoryId == id))
            return "exist";

        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return "not_found";

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return "success";
    }
}
