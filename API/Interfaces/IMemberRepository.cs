using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Upadate(Member member);
    Task<bool> SaveAllAsync();

    Task<PaginatedResult<Member>> GetMembersAsync(PagingParams pagingParams);
    Task<Member?> GetMemberByIdAsync(string id);

    Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId);

    Task<Member?> GetMemberForUpdateAsync(string Id);
}
