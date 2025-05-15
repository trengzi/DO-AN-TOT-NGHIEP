using BookStore.Models;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;

namespace BookStore.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinarySetting> cloudinarySettings)
        {
            var settings = cloudinarySettings.Value;
            _cloudinary = new Cloudinary(new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret));
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file.Length <= 0) throw new ArgumentException("File is empty");

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "bookstore/images" // Thư mục lưu ảnh trong Cloudinary
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return uploadResult.SecureUrl.AbsoluteUri; // Trả về URL của ảnh
            }

            throw new Exception("Image upload failed");
        }

        public async Task<List<string>> UploadImagesAsync(List<IFormFile> files)
        {
            var uploadedUrls = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using var stream = file.OpenReadStream();
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Folder = "bookstore/images"
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        uploadedUrls.Add(uploadResult.SecureUrl.AbsoluteUri);
                    }
                    else
                    {
                        throw new Exception($"Failed to upload {file.FileName}");
                    }
                }
            }

            return uploadedUrls;
        }

    }
}
