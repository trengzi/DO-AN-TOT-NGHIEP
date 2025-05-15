using BookStore.Models;
using BookStore.Models.CustomModel;

namespace BookStore.Services.Interface
{
    public interface IBooksService
    {
        public  Task<IEnumerable<Book>> GetBooks();

        public  Task<object> GetBook(Guid id);

        public  Task<bool> PutBook(Guid id, Book Book);


        public Task<bool> PostBook(Book Book);


        public Task<bool> DeleteBook(Guid id);


        public Task<List<Book>> Get10NewestBook();
        

        public Task<IEnumerable<object>> get3HighestReviewBook();


        public Task<IEnumerable<object>> get3SanPhamTuan();


        public Task<IEnumerable<object>> get3SanPhamThang();


        public Task<object> getAllSanPhamWithFilter(string keyword, Guid categoryId, int rangeFrom, int rangeTo, int order, int page);


        public Task<IEnumerable<Book>> getCategory20Book(Guid id);


        public Task<IEnumerable<Book>> GetAllSanPhamYeuThich(Guid userId);


        public Task<bool> XoaSanPhamYeuThich(Guid bookId, Guid userId);


        public Task<bool> PostYeuThich(Wishlist wishlist);


        public Task<object> checkYeuThich(Guid bookId, Guid userId);


        public Task<int> UpdateProducts(List<ProductUpdateDto> products);

        public Task<object> GetAllSanPhamSearch(string keyword, int page);


        public Task<object> GetBookByIdToUpdate(Guid id);


        public Task<object> CheckSoLuong(Guid bookId, int quantity);


        public Task<object> CheckSoLuongMany( List<CheckBookModel> books);
        
    }
}
