using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository : ILikesRepository
{

    private readonly AppDbContext _context;

    public LikesRepository(AppDbContext context)
    {
        _context = context;
    }

    public void AddLike(MemberLike memberLike)
    {
        _context.Likes.Add(memberLike);
    }

    public void DeleteLike(MemberLike memberLike)
    {
        _context.Likes.Remove(memberLike);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIdsAsync(string memberId)
    {
        var likeIds = await _context.Likes
            .Where(like => like.SourceMemberId == memberId)
            .Select(like => like.TargetMemberId)
            .ToListAsync();

        return likeIds;
    }

    public async Task<MemberLike?> GetMemberLikeAsync(string sourceMemberId, string targetMemberId)
    {
        var like = await _context.Likes.FindAsync(sourceMemberId, targetMemberId);
        return like;
    }

    public async Task<IReadOnlyList<Member>> GetMemberLikesAsync(string memberId, string predicate)
    {
        var query = _context.Likes.AsQueryable();
        switch (predicate)
        {
            case "liked":
                query = query.Where(like => like.SourceMemberId == memberId);
                return await query.Select(like => like.TargetMember).AsNoTracking().ToListAsync();

            case "likedBy":
                query = query.Where(like => like.TargetMemberId == memberId);
                return await query.Select(like => like.SourceMember).AsNoTracking().ToListAsync();
            default: //mutual likes
                var likeIds = await GetCurrentMemberLikeIdsAsync(memberId);
                return await query
                    .Where(like => like.SourceMemberId == memberId && likeIds.Contains(like.TargetMemberId))
                    .Select(like => like.TargetMember)
                    .AsNoTracking()
                    .ToListAsync();

        }

    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
