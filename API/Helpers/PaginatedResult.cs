using System;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginationMetadata Metadata { get; set; } = default!;
    public IReadOnlyList<T> Items { get; set; } = default!;
}

public class PaginationMetadata
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }

    public PaginationMetadata(int currentPage, int pageSize, int totalCount)
    {
        CurrentPage = currentPage;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
    }


}
public static class PagingHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> source, int currentPage, int pageSize)
    {
        var totalCount = await source.CountAsync();
        var items = await source
            .Skip((currentPage - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<T>
        {
            Metadata = new PaginationMetadata(currentPage, pageSize, totalCount),
            Items = items
        };
    }
}