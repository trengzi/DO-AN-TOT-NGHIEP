using BookStore.Models;

namespace BookStore.Services
{
    public interface ISuppliersService
    {
        Task<IEnumerable<Supplier>> GetSuppliers();
        Task<Supplier?> GetSupplier(Guid id);
        Task<bool> UpdateSupplier(Guid id, Supplier supplier);
        Task<bool> AddSupplier(Supplier supplier);
        Task<string> DeleteSupplier(Guid id);
    }
}
