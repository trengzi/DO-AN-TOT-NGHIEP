using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistsController : ControllerBase
    {
        private readonly IWishlistsService _wishlistService;

        public WishlistsController(IWishlistsService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Wishlist>>> GetWishlists()
        {
            return Ok(await _wishlistService.GetWishlists());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Wishlist>> GetWishlist(Guid id)
        {
            var wishlist = await _wishlistService.GetWishlistById(id);
            if (wishlist == null)
            {
                return NotFound();
            }
            return Ok(wishlist);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutWishlist(Guid id, Wishlist wishlist)
        {
            if (id != wishlist.Id)
            {
                return BadRequest();
            }

            var result = await _wishlistService.UpdateWishlist(wishlist);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Wishlist>> PostWishlist(Wishlist wishlist)
        {
            await _wishlistService.CreateWishlist(wishlist);
            return CreatedAtAction(nameof(GetWishlist), new { id = wishlist.Id }, wishlist);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWishlist(Guid id)
        {
            var result = await _wishlistService.DeleteWishlist(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
