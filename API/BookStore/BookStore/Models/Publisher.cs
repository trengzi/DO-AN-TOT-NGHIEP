using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Publisher
{
    public Guid Id { get; set; }

    public string? FullName { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public DateTime? Created { get; set; }

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
