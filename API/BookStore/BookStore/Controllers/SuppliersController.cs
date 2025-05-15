using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly ISuppliersService _suppliersService;

        public SuppliersController(ISuppliersService suppliersService)
        {
            _suppliersService = suppliersService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            return Ok(await _suppliersService.GetSuppliers());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> GetSupplier(Guid id)
        {
            var supplier = await _suppliersService.GetSupplier(id);
            return supplier != null ? Ok(supplier) : NotFound();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSupplier(Guid id, Supplier supplier)
        {
            var result = await _suppliersService.UpdateSupplier(id, supplier);
            return result ? Ok(new { status = "success" }) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> PostSupplier(Supplier supplier)
        {
            var result = await _suppliersService.AddSupplier(supplier);
            return result ? Ok(new { status = "success" }) : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(Guid id)
        {
            var result = await _suppliersService.DeleteSupplier(id);
            return result switch
            {
                "exist" => Ok(new { status = "exist" }),
                "not_found" => NotFound(),
                _ => Ok(new { status = "success" })
            };
        }
    }
}
