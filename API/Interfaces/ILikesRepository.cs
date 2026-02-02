using System;
using API.Entities;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<MemberLike?> GetMemberLikeAsync(string sourceMemberId, string targetMemberId);
    Task<IReadOnlyList<Member>> GetMemberLikesAsync(string memberId, string predicate);

    Task<IReadOnlyList<string>> GetCurrentMemberLikeIdsAsync(string memberId);

    void DeleteLike(MemberLike memberLike);

    void AddLike(MemberLike memberLike);

    Task<bool> SaveAllAsync();
}
