﻿using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Category
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public DateTime? Created { get; set; }

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
