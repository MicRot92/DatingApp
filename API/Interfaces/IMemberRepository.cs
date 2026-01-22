using System;
using API.Entities;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Upadate(Member member);
    Task<bool> SaveAllAsync();

    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<Member?> GetMemberByIdAsync(string id);

    Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId);
}
