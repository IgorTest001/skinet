using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extenstions
{
    public static class UserManagerExtensions
    {
        public static async Task<AppUser> FindByUserByClaimsPrincipleWithAddressAsync (this UserManager<AppUser> userManager, ClaimsPrincipal claimsPrincipalUser)
        {
            var email = claimsPrincipalUser.FindFirstValue(ClaimTypes.Email);

            return await userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
        }
    
        public static async Task<AppUser> FindByEmailFromClaimsPrinciple (this UserManager<AppUser> userManager, ClaimsPrincipal claimsPrincipalUser)
        {
            var email = claimsPrincipalUser.FindFirstValue(ClaimTypes.Email);

            return await userManager.Users.SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}
