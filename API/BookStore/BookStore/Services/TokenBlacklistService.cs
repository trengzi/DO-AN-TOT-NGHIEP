using System.Collections.Concurrent;

namespace BookStore.Services
{
    public class TokenBlacklistService
    {
        private readonly ConcurrentDictionary<string, DateTime> _blacklist = new ConcurrentDictionary<string, DateTime>();

        // Thêm token vào danh sách đen
        public void AddToBlacklist(string token, DateTime expiry)
        {
            _blacklist[token] = expiry;
        }

        // Kiểm tra token có trong danh sách đen không
        public bool IsTokenBlacklisted(string token)
        {
            if (_blacklist.TryGetValue(token, out var expiry))
            {
                if (expiry < DateTime.UtcNow)
                {
                    _blacklist.TryRemove(token, out _);
                    return false;
                }
                return true;
            }
            return false;
        }
    }

}
