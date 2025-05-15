using BookStore.Context;
using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using IdentityTest_3.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddSingleton<TokenBlacklistService>();
builder.Services.Configure<CloudinarySetting>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddDbContext<IdentityContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection"));
});
builder.Services.AddDbContext<DbBookContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 5;
}).AddEntityFrameworkStores<IdentityContext>().AddDefaultTokenProviders();

builder.Services.AddScoped<IAuthorsService, AuthorsService>(); 

builder.Services.AddScoped<IBooksService, BooksService>(); 
builder.Services.AddScoped<IAuthorsService, AuthorsService>(); 
builder.Services.AddScoped<IAuthService, AuthService>(); 
builder.Services.AddScoped<IBookAuthorsService, BookAuthorsService>(); 
builder.Services.AddScoped<ICartsService, CartsService>(); 
builder.Services.AddScoped<ICategoriesService, CategoriesService>(); 
builder.Services.AddScoped<ICouponService, CouponService>(); 
builder.Services.AddScoped<IDashboardsService, DashboardsService>(); 
builder.Services.AddScoped<IEmployeesService, EmployeesService>(); 
builder.Services.AddScoped<IManagersService, ManagersService>(); 
builder.Services.AddScoped<IMessagesService, MessagesService>(); 
builder.Services.AddScoped<IOrderDetailsService, OrderDetailsService>(); 
builder.Services.AddScoped<IOrdersService, OrdersService>(); 
builder.Services.AddScoped<IPagesService, PagesService>(); 
builder.Services.AddScoped<IPublishersService, PublishersService>(); 
builder.Services.AddScoped<IReviewsService, ReviewsService>(); 
builder.Services.AddScoped<ISuppliersService, SuppliersService>(); 
builder.Services.AddScoped<IUsersService, UsersService>(); 
builder.Services.AddScoped<IWishlistsService, WishlistsService>(); 





var app = builder.Build();

app.UseMiddleware<BlacklistMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(options =>
{
    options.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();

});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
