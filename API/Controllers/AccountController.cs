using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context) : BaseAPIController
{
    [HttpPost("register")]
    public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Email))
            return BadRequest("Email is already taken");

        using var hmac = new System.Security.Cryptography.HMACSHA512();

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email.ToLower(),
            PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
    {
        string Email = loginDto.Email.ToLowerInvariant();  // Changed to ToLowerInvariant for consistency
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == Email);

        if (user == null) return Unauthorized("Invalid email or password");

        using var hmac = new System.Security.Cryptography.HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid email or password");
        }

        return user;
    }

    private async Task<bool> UserExists(string email)
    {
        return await context.Users.AnyAsync(u => u.Email == email.ToLower());
    }
}

