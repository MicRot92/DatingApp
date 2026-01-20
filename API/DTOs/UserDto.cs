using System;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace API.DTOs;

public class UserDto
{
    public string Id { get; set; }

    public string DisplayName { get; set; } = "";

    public string Email { get; set; } = "";

    public required string Token { get; set; }

    public string? PhotoUrl { get; set; }
}
