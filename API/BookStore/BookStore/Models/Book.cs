using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Book
{
    public Guid Id { get; set; }

    public string? Code { get; set; }

    public string? ImageUrls { get; set; }

    public string? Title { get; set; }

    public int? Price { get; set; }

    public int? PriceDiscount { get; set; }

    public int? Quantity { get; set; }

    public string? Description { get; set; }

    public int? PageNumber { get; set; }

    public string? CoverType { get; set; }

    public double? Weight { get; set; }

    public int? PublicationYear { get; set; }

    public string? Size { get; set; }

    public DateTime? ImportDate { get; set; }

    public int? ImportPrice { get; set; }

    public DateTime? Created { get; set; }

    public Guid? PublisherId { get; set; }

    public Guid? CategoryId { get; set; }

    public Guid? SupplierId { get; set; }

    public virtual ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();

    public virtual Category? Category { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual Publisher? Publisher { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual Supplier? Supplier { get; set; }

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
