using BookStore.Models.CustomModel;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.Services.Interface;

namespace BookStore.Services
{
    public class BooksService : IBooksService
    {
        private readonly DbBookContext _context;

        public BooksService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetBooks()
        {
            return await _context.Books.ToListAsync();
        }

        public async Task<object> GetBook(Guid id)
        {
            var book = await (from bk in _context.Books
                  join bktg in _context.BookAuthors on bk.Id equals bktg.BookId into bktgGroup
                  from bktg in bktgGroup.DefaultIfEmpty()
                  join tg in _context.Authors on bktg.AuthorId equals tg.Id into tgGroup
                  from tg in tgGroup.DefaultIfEmpty()
                  join ncc in _context.Suppliers on bk.SupplierId equals ncc.Id into nccGroup
                  from ncc in nccGroup.DefaultIfEmpty()
                  join nph in _context.Publishers on bk.PublisherId equals nph.Id into nphGroup
                  from nph in nphGroup.DefaultIfEmpty()
                  join rv in _context.Reviews on bk.Id equals rv.BookId into rvGroup
                  from rv in rvGroup.DefaultIfEmpty()
                  join od in _context.OrderDetails on bk.Id equals od.BookId into odGroup
                  from od in odGroup.DefaultIfEmpty()
                  join dm in _context.Categories on bk.CategoryId equals dm.Id
                  where bk.Id == id
                  select new
                  {
                      bk.Id,
                      bk.ImageUrls,
                      bk.PageNumber,
                      bk.Price,
                      bk.PriceDiscount,
                      bk.Code,
                      bk.Size,
                      bk.Weight,
                      bk.Title,
                      bk.Description,
                      bk.Quantity,
                      bk.Reviews,
                      bk.PublicationYear,
                      bk.CoverType,
                      bk.OrderDetails,
                      tenTacGia = tg != null ? tg.FullName : null,
                      tenNhaCungCap = ncc != null ? ncc.FullName : null,
                      tenNhaPhatHanh = nph != null ? nph.FullName : null,
                      tenDanhMuc = dm.Name,
                      bk.CategoryId,
                      bk.SupplierId,
                  }).ToListAsync();


            
            var ans = book.Select(b => new
                      {
                          b.Id,
                          b.ImageUrls,
                          b.PageNumber,
                          b.Price,
                          b.PriceDiscount,
                          b.Code,
                          b.Size,
                          b.Weight,
                          b.Title,
                          b.Description,
                          b.Quantity,
                          b.Reviews,
                          stars = b.Reviews.Average(x => x.Stars),
                          tenTacGia = string.Join(", ", b.tenTacGia),
                          soLuongDaBan = (from ord in _context.Orders
                                       join ordd in _context.OrderDetails on ord.Id equals ordd.OrderId
                                       where ord.Status == "Giao hàng thành công" && ordd.BookId == b.Id
                                       select ordd.Quantity
                                       ).Sum(),
                          b.tenNhaCungCap,
                          b.tenNhaPhatHanh,
                          b.tenDanhMuc,
                          b.PublicationYear,
                          b.CoverType,
                          b.CategoryId,
                          b.SupplierId,
                      }).FirstOrDefault();

            return ans;
        }

        public async Task<bool> PutBook(Guid id, Book Book)
        {
            if (id != Book.Id)
            {
                return false;
            }
            Book.Created = DateTime.Now;

            _context.Entry(Book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }


        public async Task<bool> PostBook(Book Book)
        {
            Book.Created =  DateTime.Now;
            _context.Books.Add(Book);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteBook(Guid id)
        {
            var Book = await _context.Books.FindAsync(id);
            if (Book == null)
            {
                return false;
            }

            _context.Books.Remove(Book);
            await _context.SaveChangesAsync();

            return true;
        }

        private bool BookExists(Guid id)
        {
            return _context.Books.Any(e => e.Id == id);
        }


        public async Task<List<Book>> Get10NewestBook()
        {
            return await _context.Books.OrderByDescending(x => x.ImportDate).Take(10).ToListAsync();
        }

        public async Task<IEnumerable<object>> get3HighestReviewBook()
        {
            var books = (from book in _context.Books
                       join review in _context.Reviews on book.Id equals review.BookId into reviewsGroup
                       from review in reviewsGroup.DefaultIfEmpty()
                       group review by new { book.Id, book.Title, book.Price, book.Code, book.PriceDiscount, book.ImageUrls } into bookGroup
                       select new
                       {
                           bookGroup.Key.Id,
                           bookGroup.Key.Title,
                           bookGroup.Key.Price,
                           bookGroup.Key.Code,
                           bookGroup.Key.PriceDiscount,
                           bookGroup.Key.ImageUrls,
                           AverageStar = bookGroup.Average(r => r.Stars)
                       })
                       .OrderByDescending(b => b.AverageStar)
                       .Take(3)
                       .ToList();


            return books;
        }

        public async Task<IEnumerable<object>> get3SanPhamTuan()
        {
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);

            var Book = (from book in _context.Books
                       join orderDetail in _context.OrderDetails on book.Id equals orderDetail.BookId into orderDetails
                       from orderDetail in orderDetails.DefaultIfEmpty()
                        where
                                            (orderDetail != null &&
                                             orderDetail.Created.HasValue &&
                                             orderDetail.Created.Value.AddHours(7) >= startOfWeek &&
                                             orderDetail.Created.Value.AddHours(7) < endOfWeek)
                                            || orderDetail == null
                        group orderDetail by new { book.Id, book.Title, book.Price, book.Code, book.PriceDiscount, book.ImageUrls } into bookGroup
                       select new
                       {
                           bookGroup.Key.Id,
                           bookGroup.Key.Title,
                           bookGroup.Key.Price,
                           bookGroup.Key.Code,
                           bookGroup.Key.PriceDiscount,
                           bookGroup.Key.ImageUrls,
                           numberSell = bookGroup.Sum(x => x.Quantity)
                       })
                       .OrderByDescending(b => b.numberSell)
                       .Take(3)
                       .ToList();

            return Book;
        }

        public async Task<IEnumerable<object>> get3SanPhamThang()
        {
            var startOfMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            var Book = (from book in _context.Books
                       join orderDetail in _context.OrderDetails on book.Id equals orderDetail.BookId into orderDetails
                       from orderDetail in orderDetails.DefaultIfEmpty()
                       where orderDetail.Created >= startOfMonth && orderDetail.Created < endOfMonth || orderDetail == null// thêm trạng thái là đã giao hàng
                       group orderDetail by new { book.Id, book.Title, book.Price, book.Code, book.PriceDiscount, book.ImageUrls } into bookGroup
                       select new
                       {
                           bookGroup.Key.Id,
                           bookGroup.Key.Title,
                           bookGroup.Key.Price,
                           bookGroup.Key.Code,
                           bookGroup.Key.PriceDiscount,
                           bookGroup.Key.ImageUrls,
                           numberSell = bookGroup.Sum(x => x.Quantity)
                       })
                       .OrderByDescending(b => b.numberSell)
                       .Take(3)
                       .ToList();

            return Book;
        }


        public async Task<object> getAllSanPhamWithFilter(string keyword, Guid categoryId, int rangeFrom, int rangeTo, int order, int page)
        {

            var totalRecords = await (from bk in _context.Books
                          where ((rangeFrom == 0 && rangeTo == 0)
                                  || (bk.PriceDiscount != null ? (bk.PriceDiscount >= rangeFrom && bk.PriceDiscount <= rangeTo) : (bk.Price >= rangeFrom && bk.Price <= rangeTo)))
                                  && (categoryId == Guid.Empty || bk.CategoryId == categoryId)
                                  && (keyword == "null" || bk.Title == null || bk.Title.Contains(keyword))
                          select bk).CountAsync();

            var book = await (from bk in _context.Books
                            where ((rangeFrom == 0 && rangeTo == 0)
                                  || (bk.PriceDiscount != null ? (bk.PriceDiscount >= rangeFrom && bk.PriceDiscount <= rangeTo) : (bk.Price >= rangeFrom && bk.Price <= rangeTo)))
                                  && (categoryId == Guid.Empty || bk.CategoryId == categoryId)
                                  && (keyword == "null" || bk.Title == null || bk.Title.Contains(keyword))
                            orderby
                                  (order == 0 ? bk.Created : null) descending,
                                  (order == 1 ? (bk.PriceDiscount ?? bk.Price) : null) ascending,
                                  (order == 2 ? (bk.PriceDiscount ?? bk.Price) : null) descending,
                                  (order == 3 ? bk.Title : null) ascending
                            select bk).Skip(page * 20).Take(20).ToListAsync();
            
            return new { TotalRecords = totalRecords, Books = book } ;
        }

        public async Task<IEnumerable<Book>> getCategory20Book(Guid id)
        {
            return await _context.Books.Where(x => x.CategoryId == id).Take(20).ToListAsync();
        }

        public async Task<IEnumerable<Book>> GetAllSanPhamYeuThich(Guid userId)
        {
            var lstBookId = await _context.Wishlists.Where(x => x.UserId == userId).Select(x => x.BookId).ToListAsync();

            return await _context.Books.Where(x => lstBookId.Contains(x.Id)).ToListAsync();
        }

        public async Task<bool> XoaSanPhamYeuThich(Guid bookId, Guid userId)
        {
            var spyt = (from am in _context.Wishlists
                                     where am.UserId == userId && am.BookId == bookId
                                     select am)
                                    .FirstOrDefault();
            if (spyt == null)
            {
                return false;
            }
            _context.Wishlists.Remove(spyt);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PostYeuThich(Wishlist wishlist)
        {
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<object> checkYeuThich(Guid bookId, Guid userId)
        {
            var ck = _context.Wishlists.FirstOrDefaultAsync(x => x.BookId == bookId && x.UserId == userId);
            if(ck.Result != null)
            {
                return (new { status = true });
            }
            return (new { status = false });
        }

        public async Task<int> UpdateProducts( List<ProductUpdateDto> products)
        {
            if (products == null || products.Count == 0)
                return 0;

            foreach (var product in products)
            {
                var existingProduct = await _context.Books.FindAsync(product.ProductId);
                if (existingProduct == null)
                    return 1;

                existingProduct.Quantity -= product.Bought;
                _context.Books.Update(existingProduct);
            }

            await _context.SaveChangesAsync();
            return 2;
        }

        public async Task<object> GetAllSanPhamSearch(string keyword, int page)
        {
            var query = await (from bk in _context.Books
                               join cate in _context.Categories on bk.CategoryId equals cate.Id into cateGroup
                               from cate in cateGroup.DefaultIfEmpty()

                               join ba in _context.BookAuthors on bk.Id equals ba.BookId into baGroup
                               from ba in baGroup.DefaultIfEmpty()

                               join at in _context.Authors on ba.AuthorId equals at.Id into atGroup
                               from at in atGroup.DefaultIfEmpty()

                               group new { bk, cate.Name, AuthorName = at.FullName } by new
                               {
                                   bk.Id,
                                   bk.Title,
                                   bk.Price,
                                   bk.PriceDiscount,
                                   bk.ImageUrls,
                                   bk.Code,
                                   CategoryName = cate.Name
                               } into grouped

                               select new
                               {
                                   grouped.Key.Id,
                                   grouped.Key.Title,
                                   grouped.Key.Price,
                                   grouped.Key.PriceDiscount,
                                   grouped.Key.ImageUrls,
                                   CategoryName = grouped.Key.CategoryName ?? "",
                                   grouped.Key.Code,
                                   TenTacGia = string.Join(", ", grouped.Select(x => x.AuthorName).ToArray())
                               }).ToListAsync();

            var filtered = query.Where(x =>
                (x.TenTacGia?.ToLower().Contains(keyword.ToLower()) ?? false) ||
                (x.Title?.ToLower().Contains(keyword.ToLower()) ?? false) ||
                (x.CategoryName?.ToLower().Contains(keyword.ToLower()) ?? false)||
                (x.Code?.ToLower().Contains(keyword.ToLower()) ?? false)
            );

            var totalRecords = filtered.Count();

            var book = filtered
                .Skip(page * 20)
                .Take(20);

            return new
            {
                TotalRecords = totalRecords,
                Books = book
            };
        }


        public async Task<object> GetBookByIdToUpdate(Guid id)
        {
            var book = await (from bk in _context.Books
                  join ncc in _context.Suppliers on bk.SupplierId equals ncc.Id into nccGroup
                  from ncc in nccGroup.DefaultIfEmpty()
                  join nph in _context.Publishers on bk.PublisherId equals nph.Id into nphGroup
                  from nph in nphGroup.DefaultIfEmpty()
                  join rv in _context.Reviews on bk.Id equals rv.BookId into rvGroup
                  from rv in rvGroup.DefaultIfEmpty()
                  join od in _context.OrderDetails on bk.Id equals od.BookId into odGroup
                  from od in odGroup.DefaultIfEmpty()
                  join dm in _context.Categories on bk.CategoryId equals dm.Id
                  where bk.Id == id
                  select new
                  {
                      bk.Id,
                      bk.ImageUrls,
                      bk.PageNumber,
                      bk.Price,
                      bk.PriceDiscount,
                      bk.Code,
                      bk.Size,
                      bk.Weight,
                      bk.Title,
                      bk.Description,
                      bk.Quantity,
                      bk.Reviews,
                      bk.PublicationYear,
                      bk.CoverType,
                      bk.OrderDetails,
                      bk.SupplierId,
                      bk.PublisherId,
                      bk.CategoryId,
                      bk.ImportDate,
                      bk.ImportPrice
                  }).ToListAsync();


            
            var ans = book.Select(b => new
                      {
                          b.Id,
                          b.ImageUrls,
                          b.PageNumber,
                          b.Price,
                          b.PriceDiscount,
                          b.Code,
                          b.Size,
                          b.Weight,
                          b.Title,
                          b.Description,
                          b.Quantity,
                          b.Reviews,
                          b.PublisherId,
                          b.CategoryId,
                          b.PublicationYear,
                          b.CoverType,
                          b.SupplierId,
                          b.ImportDate,
                          b.ImportPrice
                      }).FirstOrDefault();

            return ans;
        }

        public async Task<object> CheckSoLuong(Guid bookId, int quantity)
        {
            var ck = await _context.Books.FirstOrDefaultAsync(x => x.Id == bookId);
            if(ck.Quantity >= quantity)
            {
                return new { status = true };
            }
            return new { status = "error" };
        }

        public async Task<object> CheckSoLuongMany( List<CheckBookModel> books)
        {
            var rs = true;
            foreach (var item in books)
            {
                var book = _context.Books.FirstOrDefault(b => b.Id == item.id);
                if (book.Quantity < item.soLuong)
                {
                    rs = false;
                    return new { status = "error" };
                }
            }
            return new { status = "success" };
        }
    }
}
