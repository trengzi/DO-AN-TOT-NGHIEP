using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoriesService _categoryService;

    public CategoriesController(ICategoriesService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetCategories()
    {
        return Ok(await _categoryService.GetCategoriesAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(Guid id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        return category != null ? Ok(category) : NotFound();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCategory(Guid id, Category category)
    {
        return await _categoryService.UpdateCategoryAsync(id, category) 
            ? Ok(new { status = "success" }) 
            : BadRequest();
    }

    [HttpPost]
    public async Task<IActionResult> PostCategory(Category category)
    {
        return await _categoryService.AddCategoryAsync(category) 
            ? Ok(new { status = "success" }) 
            : BadRequest();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var status = await _categoryService.DeleteCategoryAsync(id);
        return Ok(new { status });
    }
}
