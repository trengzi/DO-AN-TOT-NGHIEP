using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Wishlist
{
    public Guid Id { get; set; }

    public DateTime? Created { get; set; }

    public Guid? UserId { get; set; }

    public Guid? BookId { get; set; }

    public virtual Book? Book { get; set; }

    public virtual User? User { get; set; }
}
