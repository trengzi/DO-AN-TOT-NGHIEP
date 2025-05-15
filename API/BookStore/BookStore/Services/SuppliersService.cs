using BookStore.Models;
using BookStore.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Services
{
    public class SuppliersService : ISuppliersService
    {
        private readonly DbBookContext _context;

        public SuppliersService(DbBookContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Supplier>> GetSuppliers()
        {
            return await _context.Suppliers.OrderByDescending(x => x.Created).ToListAsync();
        }

        public async Task<Supplier?> GetSupplier(Guid id)
        {
            return await _context.Suppliers.FindAsync(id);
        }

        public async Task<bool> UpdateSupplier(Guid id, Supplier supplier)
        {
            if (id != supplier.Id) return false;

            supplier.Created = DateTime.UtcNow;
            _context.Entry(supplier).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return _context.Suppliers.Any(e => e.Id == id);
            }
        }

        public async Task<bool> AddSupplier(Supplier supplier)
        {
            supplier.Created = DateTime.Now;
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> DeleteSupplier(Guid id)
        {
            var anyBook = await _context.Books.AnyAsync(x => x.SupplierId == id);
            if (anyBook) return "exist";

            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return "not_found";

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
            return "success";
        }
    }
}
