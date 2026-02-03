using System;

namespace API.Helpers;

public class LikesParams : PagingParams
{
    public string Predicate { get; set; } = string.Empty;

    public string? CurrentMemberId { get; set; }

}
