using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Page
{
    public Guid Id { get; set; }

    public string? Content { get; set; }

    public DateTime? Created { get; set; }

    public string? Code { get; set; }

    public string? Title { get; set; }
}
