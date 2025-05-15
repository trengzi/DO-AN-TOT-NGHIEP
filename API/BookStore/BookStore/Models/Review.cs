using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Review
{
    public Guid Id { get; set; }

    public string? Comment { get; set; }

    public int? Stars { get; set; }

    public DateTime? Created { get; set; }

    public Guid? UserId { get; set; }

    public Guid? BookId { get; set; }

    public Guid? OrderId { get; set; }

    public virtual Book? Book { get; set; }

    public virtual Order? Order { get; set; }

    public virtual User? User { get; set; }
}
