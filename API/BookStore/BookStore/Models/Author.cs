using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Author
{
    public Guid Id { get; set; }

    public string? FullName { get; set; }

    public string? Biography { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public DateTime? Created { get; set; }

    public virtual ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
}
