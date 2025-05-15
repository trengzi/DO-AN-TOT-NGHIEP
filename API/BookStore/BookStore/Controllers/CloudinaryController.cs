using BookStore.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CloudinaryController : ControllerBase
    {
        private readonly CloudinaryService _cloudinaryService;

        public CloudinaryController(CloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        // API upload một file
        [HttpPost("upload")]
        public async Task<IActionResult> UploadSingleImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(file);
                return Ok(new { Url = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // API upload nhiều file
        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadMultipleImages([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded");

            try
            {
                var imageUrls = await _cloudinaryService.UploadImagesAsync(files);
                return Ok(new { Urls = imageUrls });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
