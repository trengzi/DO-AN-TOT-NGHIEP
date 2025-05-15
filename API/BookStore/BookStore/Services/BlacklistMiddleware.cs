namespace BookStore.Services
{
    public class BlacklistMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TokenBlacklistService _blacklistService;

        public BlacklistMiddleware(RequestDelegate next, TokenBlacklistService blacklistService)
        {
            _next = next;
            _blacklistService = blacklistService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token != null && _blacklistService.IsTokenBlacklisted(token))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token is blacklisted");
                return;
            }
            await _next(context);
        }
    }

}
