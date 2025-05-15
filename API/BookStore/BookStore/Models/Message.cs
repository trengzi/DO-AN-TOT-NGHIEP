using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Message
{
    public Guid Id { get; set; }

    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? Subject { get; set; }

    public string? Content { get; set; }

    public DateTime? Created { get; set; }
}
