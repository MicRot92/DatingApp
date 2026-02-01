using System;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();
        if (context.HttpContext.User.Identity is { IsAuthenticated: true })
        {
            var userId = resultContext.HttpContext.User.GetMemberId();
            var userRepository = resultContext.HttpContext.RequestServices.GetService<IMemberRepository>();
            if (userRepository != null)
            {
                var user = await userRepository.GetMemberForUpdateAsync(userId);
                if (user != null)
                {
                    user.LastActive = DateTime.UtcNow;
                    await userRepository.SaveAllAsync();
                }
            }
        }
    }
}
