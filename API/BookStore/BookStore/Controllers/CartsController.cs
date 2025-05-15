using BookStore.Models;
using BookStore.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartsService _cartService;

        public CartsController(ICartsService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCarts()
        {
            return Ok(await _cartService.GetCarts());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(Guid id)
        {
            var cart = await _cartService.GetCart(id);
            if (cart == null) return NotFound();
            return Ok(cart);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCart(Guid id, Cart cart)
        {
            if (!await _cartService.UpdateCart(id, cart)) return NotFound();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult> PostCart(Cart cart)
        {
            return Ok(await _cartService.AddToCart(cart));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(Guid id)
        {
            if (!await _cartService.DeleteCart(id)) return NotFound();
            return NoContent();
        }

        [HttpGet("getSanPhamTrongGioHang/{userId}")]
        public async Task<IActionResult> GetSanPhamTrongGioHang(Guid userId)
        {
            var result = await _cartService.GetSanPhamTrongGioHang(userId);
            if (result == null) return NoContent();
            return Ok(result);
        }

        [HttpPut("updateCart/{userId}")]
        public async Task<IActionResult> UpdateCart(Guid userId, Cart updatedCart)
        {
            if (!await _cartService.UpdateCart(userId, updatedCart)) return NotFound();
            return Ok();
        }

        [HttpPut("deleteBook/{userId}")]
        public async Task<IActionResult> DeleteBook(Guid userId)
        {
            if (!await _cartService.ClearCart(userId)) return NotFound();
            return Ok();
        }
    }
}
